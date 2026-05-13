-- 1. Thêm cột role vào bảng users
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user';

-- 2. Cập nhật RLS cho users
CREATE POLICY "Admins have full access on users." ON public.users FOR ALL USING (
  (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
);

-- 3. Cập nhật RLS cho documents (để admin có thể xem/xóa tất cả tài liệu)
CREATE POLICY "Admins have full access on documents." ON public.documents FOR ALL USING (
  (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
);

-- 4. Tạo bảng api_logs để theo dõi việc sử dụng Gemini API
CREATE TABLE IF NOT EXISTS public.api_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  action_type TEXT NOT NULL, -- 'summarize', 'quiz', 'chat'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Bật RLS cho api_logs
ALTER TABLE public.api_logs ENABLE ROW LEVEL SECURITY;

-- Chỉ Admin mới được xem log, User được insert log (thông qua API)
CREATE POLICY "Admins can view all logs." ON public.api_logs FOR SELECT USING (
  (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
);
-- User có thể tự xem log của mình (nếu cần hiển thị sau này)
CREATE POLICY "Users can view own logs." ON public.api_logs FOR SELECT USING (
  auth.uid() = user_id
);
-- Allow API route to insert (API Route runs with user context or service key, but let's allow user to insert their own logs)
CREATE POLICY "Users can insert own logs." ON public.api_logs FOR INSERT WITH CHECK (
  auth.uid() = user_id
);
