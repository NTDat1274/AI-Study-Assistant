import { getAdminQuizzes } from "@/actions/admin";
import {
  Table,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableBody,
} from "@/components/ui/table";

type AdminQuiz = {
  id: string
  created_at: string
  questions?: unknown[] | null
  users?: { email?: string | null } | null
  documents?: { filename?: string | null } | null
}

export default async function AdminQuizzesPage() {
  let quizzes: AdminQuiz[] = []
  let errorMessage: string | null = null

  try {
    quizzes = await getAdminQuizzes()
  } catch (error: unknown) {
    errorMessage = error instanceof Error ? error.message : 'Lỗi không xác định'
  }

  if (errorMessage) {
    return <div className="p-8 text-red-500">Lỗi khi tải danh sách Quiz: {errorMessage}</div>
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
            {quizzes.map((q) => {
              const questionsCount = Array.isArray(q.questions) ? q.questions.length : 0
              const documentName = q.documents?.filename

              return (
                <TableRow key={q.id}>
                  <TableCell className="font-medium">{q.id.substring(0, 8)}</TableCell>
                  <TableCell className="max-w-[200px] truncate" title={documentName || undefined}>{documentName || 'N/A'}</TableCell>
                  <TableCell>{q.users?.email || 'N/A'}</TableCell>
                  <TableCell>{questionsCount} câu</TableCell>
                  <TableCell className="text-right">{new Date(q.created_at).toLocaleDateString('vi-VN')}</TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
