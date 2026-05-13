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

export default async function AdminDocumentsPage() {
  const supabase = await createClient()

  const { data: documents, error } = await supabase
    .from('documents')
    .select(`
      *,
      users ( email )
    `)
    .order('created_at', { ascending: false })

  if (error) {
    return <div className="p-8 text-red-500">Lỗi khi tải danh sách tài liệu: {error.message}</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Quản lý Tài liệu</h1>
        <p className="text-slate-500 mt-2">Xem danh sách tất cả tài liệu được tải lên bởi người dùng.</p>
      </div>

      <div className="border rounded-lg bg-white overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tên File</TableHead>
              <TableHead>Người tải lên</TableHead>
              <TableHead>Định dạng</TableHead>
              <TableHead>Dung lượng</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="text-right">Ngày tải lên</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {documents?.map((doc: any) => (
              <TableRow key={doc.id}>
                <TableCell className="font-medium max-w-[200px] truncate" title={doc.filename}>{doc.filename}</TableCell>
                <TableCell>{doc.users?.email || 'N/A'}</TableCell>
                <TableCell>
                  <Badge variant="outline">{doc.file_type.includes('pdf') ? 'PDF' : doc.file_type.includes('word') ? 'DOCX' : 'TXT'}</Badge>
                </TableCell>
                <TableCell>{(doc.file_size / 1024 / 1024).toFixed(2)} MB</TableCell>
                <TableCell>
                  <Badge variant={doc.status === 'ready' ? 'default' : 'secondary'} className={doc.status === 'ready' ? 'bg-green-500' : ''}>
                    {doc.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">{new Date(doc.created_at).toLocaleDateString('vi-VN')}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
