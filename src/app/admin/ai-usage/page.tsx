import { createClient } from '@/utils/supabase/server'
import {
  Table,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableBody,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export default async function AdminUsagePage() {
  const supabase = await createClient()

  // Fetch API Logs with user email
  const { data: logs, error } = await supabase
    .from('api_logs')
    .select(`
      *,
      users ( email )
    `)
    .order('created_at', { ascending: false })
    .limit(100) // Chỉ hiện 100 dòng mới nhất để tránh nặng trang

  if (error) {
    return <div className="p-8 text-red-500">Lỗi khi tải nhật ký API: {error.message}</div>
  }

  const getActionColor = (action: string) => {
    switch (action) {
      case 'summarize': return 'bg-blue-500'
      case 'quiz': return 'bg-purple-500'
      case 'chat': return 'bg-amber-500'
      default: return 'bg-slate-500'
    }
  }

  const getActionLabel = (action: string) => {
    switch (action) {
      case 'summarize': return 'Tóm tắt tài liệu'
      case 'quiz': return 'Tạo Quiz'
      case 'chat': return 'Hỏi đáp (Chat)'
      default: return action
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Thống kê API Usage (Gemini)</h1>
        <p className="text-slate-500 mt-2">Theo dõi 100 lượt gọi API gần nhất từ người dùng tới AI.</p>
      </div>

      <div className="border rounded-lg bg-white overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Thời gian</TableHead>
              <TableHead>Người dùng (Email)</TableHead>
              <TableHead>Loại Request</TableHead>
              <TableHead>Trạng thái</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs?.map((log: any) => (
              <TableRow key={log.id}>
                <TableCell>{new Date(log.created_at).toLocaleString('vi-VN')}</TableCell>
                <TableCell className="font-medium">{log.users?.email || 'N/A'}</TableCell>
                <TableCell>
                  <Badge className={getActionColor(log.action_type)}>
                    {getActionLabel(log.action_type)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-green-600 border-green-600">Thành công</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
