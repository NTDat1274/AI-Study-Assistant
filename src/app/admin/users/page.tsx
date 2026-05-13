import { createClient } from '@/utils/supabase/server'
import {
  Table,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableBody,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export default async function AdminUsersPage() {
  const supabase = await createClient()

  const { data: users, error } = await supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    return <div className="p-8 text-red-500">Lỗi khi tải danh sách người dùng: {error.message}</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Quản lý Người dùng</h1>
        <p className="text-slate-500 mt-2">Xem danh sách người dùng đã đăng ký trên hệ thống.</p>
      </div>

      <div className="border rounded-lg bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Họ và Tên</TableHead>
              <TableHead>Ngày tham gia</TableHead>
              <TableHead className="text-right">Phân quyền</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users?.map((u) => (
              <TableRow key={u.id}>
                <TableCell className="font-medium">{u.id.substring(0, 8)}...</TableCell>
                <TableCell>{u.email}</TableCell>
                <TableCell>{u.full_name || '-'}</TableCell>
                <TableCell>{new Date(u.created_at).toLocaleDateString('vi-VN')}</TableCell>
                <TableCell className="text-right">
                  {u.role === 'admin' ? (
                    <Badge variant="default" className="bg-purple-600">Admin</Badge>
                  ) : (
                    <Badge variant="secondary">User</Badge>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
