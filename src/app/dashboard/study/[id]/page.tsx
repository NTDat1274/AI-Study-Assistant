import { createClient } from '@/lib/supabase/server'
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

  // Lấy thông tin tài liệu kèm summary
  const { data: document, error } = await supabase
    .from('documents')
    .select('id, filename, created_at, summary')
    .eq('id', params.id)
    .eq('user_id', user.id)
    .single()

  if (error || !document) {
    notFound()
  }

  // Lấy lịch sử Quiz
  const { data: quizzes } = await supabase
    .from('quizzes')
    .select('*')
    .eq('document_id', document.id)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  // Lấy lịch sử Chat
  const { data: chatHistory } = await supabase
    .from('chat_history')
    .select('role, content')
    .eq('document_id', document.id)
    .eq('user_id', user.id)
    .order('created_at', { ascending: true })

  return (
    <main className="flex-1 max-w-5xl mx-auto w-full p-4 md:p-8">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/dashboard">
          <Button variant="outline" size="icon">
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
      </div>
      <StudyTabs 
        documentId={document.id} 
        initialSummary={document.summary}
        initialQuizzes={quizzes || []}
        initialChatHistory={chatHistory || []}
      />
    </main>
  )
}
