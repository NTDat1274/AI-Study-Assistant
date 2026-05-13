import { createClient } from '@/utils/supabase/server'
import {
  Table,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableBody,
} from "@/components/ui/table"

export default async function AdminQuizzesPage() {
  const supabase = await createClient()

  const { data: quizzes, error } = await supabase
    .from('quizzes')
    .select(`
      *,
      users ( email ),
      documents ( filename )
    `)
    .order('created_at', { ascending: false })

  if (error) {
    return <div className="p-8 text-red-500">Lỗi khi tải danh sách Quiz: {error.message}</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Quản lý Quiz</h1>
        <p className="text-slate-500 mt-2">Xem danh sách các bộ câu hỏi trắc nghiệm được tạo tự động bởi AI.</p>
      </div>

      <div className="border rounded-lg bg-white overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mã Quiz</TableHead>
              <TableHead>Tài liệu gốc</TableHead>
              <TableHead>Người tạo</TableHead>
              <TableHead>Số câu hỏi</TableHead>
              <TableHead className="text-right">Ngày tạo</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {quizzes?.map((q: any) => (
              <TableRow key={q.id}>
                <TableCell className="font-medium">{q.id.substring(0, 8)}</TableCell>
                <TableCell className="max-w-[200px] truncate" title={q.documents?.filename}>{q.documents?.filename || 'N/A'}</TableCell>
                <TableCell>{q.users?.email || 'N/A'}</TableCell>
                <TableCell>{q.questions?.length || 0} câu</TableCell>
                <TableCell className="text-right">{new Date(q.created_at).toLocaleDateString('vi-VN')}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
