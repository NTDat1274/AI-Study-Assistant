# Đặc tả Yêu cầu Kỹ thuật (SPEC.md) - AI Study Assistant

## 1. Tổng quan Hệ thống
**AI Study Assistant** là nền tảng web hỗ trợ học tập thông minh, giúp sinh viên quản lý tài liệu, tóm tắt nội dung, ôn tập bằng quiz và hỏi đáp trực tiếp với tài liệu dựa trên Trí tuệ Nhân tạo (AI).

**Kiến trúc Công nghệ:**
- **Frontend:** Next.js (TypeScript), TailwindCSS.
- **Backend & Database & Storage:** Supabase (PostgreSQL, Supabase Storage).
- **AI Engine:** Google Gemini API.

---

## 2. Xác thực & Quản lý Người dùng (Authentication)
Hệ thống sử dụng **Supabase Auth** để quản lý danh tính người dùng.

### 2.1. Phương thức Đăng nhập
- **Email/Password:** Hỗ trợ đăng ký và đăng nhập truyền thống. Mật khẩu được mã hóa bởi Supabase.
- **OAuth (Social Login):** Hỗ trợ đăng nhập qua Google và GitHub.

### 2.2. Luồng Nghiệp vụ
- Đăng nhập thành công -> Điều hướng về Dashboard.
- Thông tin người dùng (User Profile) được lưu trong bảng `users` (id, email, full_name, avatar_url) đồng bộ với Supabase Auth.
- Mỗi phiên đăng nhập (session) được duy trì bằng JWT (quản lý bởi Supabase Client).

---

## 3. Quản lý Tài liệu (Document Management)
Cho phép người dùng upload tài liệu học tập để AI phân tích.

### 3.1. Giới hạn Hệ thống (File Limits)
Để tối ưu chi phí lưu trữ trên Supabase và lượng token của Gemini API:
- **Định dạng cho phép:** PDF (`application/pdf`), DOCX (`application/vnd.openxmlformats-officedocument.wordprocessingml.document`), TXT (`text/plain`).
- **Dung lượng tối đa:** 10MB / file.
- **Số trang tối đa (đối với PDF/DOCX):** 50 trang / file.

### 3.2. Luồng Nghiệp vụ
1. Người dùng chọn file trên giao diện. Frontend kiểm tra dung lượng và định dạng trước khi tải lên.
2. File được upload lên **Supabase Storage** (Bucket: `study_documents`). Đường dẫn (URL) lưu vào bảng `documents` trong database (cùng với metadata: `user_id`, `filename`, `file_type`, `file_size`, `status`).
3. Trạng thái tài liệu ban đầu là `processing`. Hệ thống (hoặc Edge Function) sẽ trích xuất văn bản (Text Extraction) từ file và lưu văn bản thô vào database (hoặc đưa trực tiếp cho Gemini), sau đó chuyển trạng thái sang `ready`.

---

## 4. Đặc tả Tính năng AI (Core AI Features)
Toàn bộ các tác vụ xử lý ngôn ngữ tự nhiên được thực hiện thông qua **Gemini API**.

### 4.1. Tóm tắt Nội dung (Summarization)
- **Nghiệp vụ:** Trích xuất ý chính, từ khóa quan trọng từ tài liệu đang xem.
- **Dữ liệu đầu vào:** Toàn bộ text đã được trích xuất từ tài liệu (hoặc nội dung 1 chương cụ thể nếu tài liệu quá dài).
- **Cấu trúc Prompt Đề xuất:**
  ```text
  Bạn là một trợ lý học tập xuất sắc. Hãy tóm tắt tài liệu sau đây một cách ngắn gọn, súc tích và dễ hiểu nhất cho sinh viên. 
  Yêu cầu:
  1. Trình bày dưới dạng gạch đầu dòng các ý chính.
  2. Nêu bật 3-5 từ khóa quan trọng nhất.
  3. Chỉ sử dụng thông tin có trong tài liệu được cung cấp.

  Nội dung tài liệu:
  {document_text}
  ```

### 4.2. Tạo Quiz Tự động (Quiz Generation)
- **Nghiệp vụ:** Sinh ra các câu hỏi trắc nghiệm dựa trên nội dung bài học để người dùng ôn tập.
- **Dữ liệu đầu vào:** Text của tài liệu, mức độ khó (Dễ/Trung bình/Khó - *Optionally*).
- **Định dạng đầu ra:** Yêu cầu trả về **Strict JSON**.
- **Cấu trúc Prompt Đề xuất:**
  ```text
  Dựa vào tài liệu dưới đây, hãy tạo ra 5 câu hỏi trắc nghiệm để kiểm tra kiến thức.
  Yêu cầu BẮT BUỘC:
  Trả về kết quả dưới định dạng JSON mảng (Array) chính xác, không kèm theo bất kỳ văn bản nào khác ngoài JSON.
  Cấu trúc JSON mỗi object:
  {
    "question": "Nội dung câu hỏi",
    "options": ["Đáp án A", "Đáp án B", "Đáp án C", "Đáp án D"],
    "correct_answer": "Đáp án A", // Nội dung chính xác của đáp án đúng
    "explanation": "Giải thích ngắn gọn tại sao đây là đáp án đúng"
  }

  Nội dung tài liệu:
  {document_text}
  ```

### 4.3. Chat với Tài liệu (Q&A)
- **Nghiệp vụ:** Trả lời các câu hỏi cụ thể của người dùng, giới hạn phạm vi kiến thức trong tài liệu đã upload.
- **Dữ liệu đầu vào:** Lịch sử chat (Context), Câu hỏi của người dùng, Nội dung tài liệu.
- **Cấu trúc Prompt Đề xuất:**
  ```text
  Bạn là một gia sư AI thân thiện. Hãy trả lời câu hỏi của người dùng DỰA HOÀN TOÀN VÀO nội dung tài liệu được cung cấp dưới đây.
  Nếu câu hỏi không liên quan đến tài liệu, hãy từ chối trả lời một cách lịch sự và nhắc nhở người dùng hỏi trong phạm vi tài liệu.

  Nội dung tài liệu:
  {document_text}

  Lịch sử trò chuyện:
  {chat_history}

  Câu hỏi mới: {user_question}
  ```

---

## 5. Dashboard & Thống kê
- **Nghiệp vụ:** Khu vực cung cấp cái nhìn tổng quan về quá trình học tập.
- **Các chỉ số cần hiển thị:**
  - Tổng số tài liệu đã upload.
  - Tổng số Quiz đã thực hiện và Điểm số trung bình.
  - Lịch sử hoạt động gần đây (VD: "Đã tạo quiz từ file A", "Đã upload file B").
- **Dữ liệu:** Được query trực tiếp từ các bảng liên quan trong PostgreSQL (Supabase) dựa trên `user_id`.

---

## 6. Giao diện người dùng phụ trợ (UI/UX Pages)
Hệ thống mở rộng thêm các trang tĩnh (Public) và trang quản lý cá nhân (Private) nhằm mang lại trải nghiệm hoàn thiện (SaaS style).

### 6.1. Trang chủ (Landing Page - `/`)
- **Phân quyền:** Public. Dùng chung layout có Header (Logo, Navigation) và Footer.
- **Cấu trúc nội dung (SaaS Style):**
  - **Hero Section:** Tiêu đề chính, đoạn mô tả giá trị (Value Proposition), và Nút Call-to-Action (Đăng nhập / Trải nghiệm ngay).
  - **Features:** Trình bày 3 tính năng cốt lõi (Tóm tắt AI, Tạo Quiz tự động, Gia sư AI).
  - **How it Works:** Trực quan hóa 3 bước sử dụng (Upload -> Phân tích -> Học tập).
  - **FAQ:** Danh sách các câu hỏi thường gặp dạng Accordion.

### 6.2. Trang Giới thiệu (About - `/about`)
- **Phân quyền:** Public.
- **Nội dung:** 
  - Thông tin đề tài: "AI Study Assistant – Hệ thống hỗ trợ học tập thông minh tích hợp trí tuệ nhân tạo".
  - Thông tin thực hiện: Sinh viên Nguyễn Tiến Đạt (2212353), GVHD: Nguyễn Trọng Hiếu.
  - Tóm tắt kiến trúc công nghệ (Next.js, Supabase, Gemini).

### 6.3. Trang Quản lý Cá nhân (Profile - `/dashboard/profile`)
- **Phân quyền:** Private (nằm trong Dashboard Layout).
- **Tính năng nâng cao:**
  - **Cập nhật thông tin:** Cho phép đổi Tên hiển thị (đồng bộ vào bảng `users` và metadata của Auth).
  - **Cập nhật Mật khẩu:** Cho phép user đổi mật khẩu thông qua `supabase.auth.updateUser`.
  - **Quản lý Avatar:** Cho phép tải ảnh đại diện lên Supabase Storage (Bucket: `avatars`) và cập nhật đường dẫn hiển thị.
