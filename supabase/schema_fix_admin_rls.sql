-- Xóa các policy RLS không an toàn cho admin (bypass RLS ở phía client)
DROP POLICY IF EXISTS "Admins have full access on users." ON public.users;
DROP POLICY IF EXISTS "Admins have full access on documents." ON public.documents;
DROP POLICY IF EXISTS "Admins can view all logs." ON public.api_logs;

-- Các policy gốc ở schema.sql đã đảm bảo user_id = auth.uid(), vì vậy không cần sửa gì thêm cho user thông thường.
-- Kể từ bây giờ, Admin sẽ lấy dữ liệu thông qua Server Actions sử dụng service_role key, bypassing RLS một cách an toàn.
