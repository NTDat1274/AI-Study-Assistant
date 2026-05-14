import AdminSidebar from "@/components/admin/AdminSidebar";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Bọc thêm 1 lớp bảo vệ trên server (mặc dù đã có middleware) để lấy thông tin admin
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return (
    <div className="flex min-h-screen bg-slate-50/50">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <header className="h-16 border-b bg-white flex items-center px-8 justify-between">
          <h2 className="text-lg font-medium text-slate-800">
            Quản trị Hệ thống
          </h2>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-slate-600">
              Xin chào, {user.email}
            </span>
          </div>
        </header>
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}
