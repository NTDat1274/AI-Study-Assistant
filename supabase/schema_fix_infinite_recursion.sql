-- 1. Tạo một Function chạy với quyền hệ thống (SECURITY DEFINER) để lấy role của user
-- Bằng cách này, function sẽ bỏ qua RLS của bảng users, tránh gây ra vòng lặp vô hạn.
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS text
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.users WHERE id = auth.uid();
$$;

-- 2. Xóa các policy cũ gây ra lỗi infinite recursion
DROP POLICY IF EXISTS "Admins have full access on users." ON public.users;
DROP POLICY IF EXISTS "Admins have full access on documents." ON public.documents;
DROP POLICY IF EXISTS "Admins can view all logs." ON public.api_logs;

-- 3. Tạo lại policy mới, sử dụng function public.get_user_role()
CREATE POLICY "Admins have full access on users." 
ON public.users FOR ALL USING (
  public.get_user_role() = 'admin'
);

CREATE POLICY "Admins have full access on documents." 
ON public.documents FOR ALL USING (
  public.get_user_role() = 'admin'
);

CREATE POLICY "Admins can view all logs." 
ON public.api_logs FOR SELECT USING (
  public.get_user_role() = 'admin'
);