import { getAdminUsageLogs } from '@/actions/admin'
import {
  Table,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableBody,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

type AdminUsageLog = {
  id: string
  created_at: string
  action_type: string
  users?: { email?: string | null } | null
}

export default async function AdminUsagePage() {
  let logs: AdminUsageLog[] = []
  let errorMessage: string | null = null

  try {
    logs = await getAdminUsageLogs()
  } catch (error: unknown) {
    errorMessage = error instanceof Error ? error.message : 'Lỗi không xác định'
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

  if (errorMessage) {
    return <div className="p-8 text-red-500">Lỗi khi tải nhật ký API: {errorMessage}</div>
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
            {logs.map((log) => (
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
