-- Thêm cột lưu trữ kết quả tóm tắt vào bảng documents
ALTER TABLE public.documents ADD COLUMN IF NOT EXISTS summary TEXT;

-- Thêm cột lưu trữ câu trả lời của người dùng vào bảng quizzes
ALTER TABLE public.quizzes ADD COLUMN IF NOT EXISTS user_answers JSONB;
