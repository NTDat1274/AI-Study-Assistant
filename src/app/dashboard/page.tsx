import { createClient } from '@/lib/supabase/server'
import UploadDocument from '@/components/dashboard/UploadDocument'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import DeleteDocumentButton from '@/components/dashboard/DeleteDocumentButton'

type DashboardDocument = {
  id: string
  filename: string
  created_at: string
  status: string
  file_url: string
}

export default async function DashboardPage() {
  const supabase = await createClient()

  // Lấy danh sách tài liệu
  const { data: documents } = await supabase
    .from('documents')
    .select('*')
    .order('created_at', { ascending: false })

  const typedDocuments = (documents ?? []) as DashboardDocument[]

  return (
    <main className="max-w-5xl mx-auto p-8 grid gap-8">
      <UploadDocument />

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Tài liệu của bạn</h2>
        {typedDocuments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {typedDocuments.map((doc) => (
              <Card key={doc.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base truncate flex items-center gap-2" title={doc.filename}>
                    <FileText className="w-4 h-4 text-blue-500" />
                    {doc.filename}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xs text-muted-foreground flex items-center gap-2 mb-4">
                    <Calendar className="w-3 h-3" />
                    {new Date(doc.created_at).toLocaleDateString('vi-VN')}
                    <span className="ml-auto px-2 py-0.5 bg-green-100 text-green-700 rounded-full">
                      {doc.status}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/dashboard/study/${doc.id}`} className="w-full">
                      <Button size="sm" className="w-full" variant="secondary">Học với AI</Button>
                    </Link>
                    <DeleteDocumentButton documentId={doc.id} fileUrl={doc.file_url} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-8 bg-white border border-dashed rounded-lg">
            Bạn chưa tải lên tài liệu nào.
          </p>
        )}
      </div>
    </main>
  )
}
