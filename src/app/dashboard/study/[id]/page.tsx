import { createClient } from '@/utils/supabase/server'
import { notFound, redirect } from 'next/navigation'
import StudyTabs from '@/components/StudyTabs'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default async function StudyPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Lấy thông tin tài liệu
  const { data: document, error } = await supabase
    .from('documents')
    .select('id, filename, created_at')
    .eq('id', params.id)
    .eq('user_id', user.id)
    .single()

  if (error || !document) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-muted/20 flex flex-col">
      <header className="bg-white border-b px-8 py-4 flex items-center gap-4 sticky top-0 z-10">
        <Link href="/dashboard">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-xl font-bold text-primary truncate max-w-2xl" title={document.filename}>
            {document.filename}
          </h1>
          <p className="text-xs text-muted-foreground">
            Đã tải lên vào {new Date(document.created_at).toLocaleDateString('vi-VN')}
          </p>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full p-4 md:p-8">
        <StudyTabs documentId={document.id} />
      </main>
    </div>
  )
}
