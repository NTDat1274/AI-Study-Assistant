import { createClient } from '@/utils/supabase/server'
import { logout } from '../(auth)/actions'
import UploadDocument from '@/components/UploadDocument'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, Calendar, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Lấy danh sách tài liệu
  const { data: documents } = await supabase
    .from('documents')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-muted/20">
      <header className="bg-white border-b sticky top-0 z-10 px-8 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-primary">AI Study Assistant</h1>
        <div className="flex items-center gap-4">
          <p className="text-sm text-muted-foreground">{user?.email}</p>
          <form action={logout}>
            <Button variant="outline" size="sm">Đăng xuất</Button>
          </form>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-8 grid gap-8">
        <UploadDocument />

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Tài liệu của bạn</h2>
          {documents && documents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {documents.map((doc: any) => (
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
                      <Button size="sm" className="w-full" variant="secondary">Học với AI</Button>
                      <Button size="sm" variant="destructive" className="px-2">
                        <Trash2 className="w-4 h-4" />
                      </Button>
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
    </div>
  )
}