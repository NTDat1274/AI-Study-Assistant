'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import { BookOpen, HelpCircle, MessageSquare, Send, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import ReactMarkdown from 'react-markdown'

export default function StudyTabs({ documentId }: { documentId: string }) {
  // States for Summary
  const [summary, setSummary] = useState<string | null>(null)
  const [isLoadingSummary, setIsLoadingSummary] = useState(false)

  // States for Quiz
  const [quizzes, setQuizzes] = useState<any[]>([])
  const [isLoadingQuiz, setIsLoadingQuiz] = useState(false)
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({})
  const [showResults, setShowResults] = useState(false)

  // States for Chat
  const [chatHistory, setChatHistory] = useState<{role: string, content: string}[]>([])
  const [chatMessage, setChatMessage] = useState('')
  const [isChatting, setIsChatting] = useState(false)

  // --- Handlers ---

  const generateSummary = async () => {
    if (summary) return; // Đã có thì không gọi lại
    setIsLoadingSummary(true)
    try {
      const res = await fetch('/api/ai/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentId })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setSummary(data.summary)
    } catch (err: any) {
      toast.error(err.message || 'Lỗi khi tạo tóm tắt')
    } finally {
      setIsLoadingSummary(false)
    }
  }

  const generateQuiz = async () => {
    setIsLoadingQuiz(true)
    setQuizzes([])
    setShowResults(false)
    setUserAnswers({})
    try {
      const res = await fetch('/api/ai/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentId, numQuestions: 5, difficulty: 'Trung bình' })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setQuizzes(data.questions)
      toast.success('Đã tạo xong câu hỏi trắc nghiệm!')
    } catch (err: any) {
      toast.error(err.message || 'Lỗi khi tạo câu hỏi')
    } finally {
      setIsLoadingQuiz(false)
    }
  }

  const handleSelectAnswer = (qIndex: number, answer: string) => {
    if (showResults) return; // Không cho sửa khi đã nộp
    setUserAnswers(prev => ({ ...prev, [qIndex]: answer }))
  }

  const submitQuiz = () => {
    if (Object.keys(userAnswers).length < quizzes.length) {
      toast.warning('Vui lòng trả lời hết các câu hỏi trước khi nộp bài.')
      return;
    }
    setShowResults(true)
    // Thực tế có thể gửi API cập nhật điểm vào DB bảng quizzes ở đây
  }

  const sendChatMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!chatMessage.trim()) return

    const newMessage = chatMessage
    setChatMessage('')
    
    // Thêm tin nhắn user vào UI trước
    const newHistory = [...chatHistory, { role: 'user', content: newMessage }]
    setChatHistory(newHistory)
    setIsChatting(true)

    try {
      // Map history sang format của Gemini (model/user)
      const geminiHistory = chatHistory.map(msg => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }]
      }))

      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentId, message: newMessage, history: geminiHistory })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      
      setChatHistory([...newHistory, { role: 'assistant', content: data.reply }])
    } catch (err: any) {
      toast.error(err.message || 'Lỗi khi gửi tin nhắn')
      // Khôi phục lại tin nhắn
      setChatMessage(newMessage)
      setChatHistory(chatHistory) 
    } finally {
      setIsChatting(false)
    }
  }

  return (
    <Tabs defaultValue="summary" className="w-full" onValueChange={(val) => {
      if (val === 'summary') generateSummary()
    }}>
      <TabsList className="grid w-full grid-cols-3 mb-8">
        <TabsTrigger value="summary" className="flex gap-2"><BookOpen className="w-4 h-4"/> Tóm tắt</TabsTrigger>
        <TabsTrigger value="quiz" className="flex gap-2"><HelpCircle className="w-4 h-4"/> Trắc nghiệm</TabsTrigger>
        <TabsTrigger value="chat" className="flex gap-2"><MessageSquare className="w-4 h-4"/> Hỏi đáp</TabsTrigger>
      </TabsList>

      {/* TÓM TẮT */}
      <TabsContent value="summary">
        <Card>
          <CardHeader>
            <CardTitle>Tóm tắt Nội dung</CardTitle>
            <CardDescription>AI sẽ tự động đọc và tóm tắt những ý chính quan trọng nhất từ tài liệu của bạn.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingSummary ? (
              <div className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-[90%]" />
                <Skeleton className="h-4 w-[80%]" />
                <Skeleton className="h-4 w-[95%]" />
              </div>
            ) : summary ? (
              <div className="prose prose-sm md:prose-base max-w-none prose-blue">
                <ReactMarkdown>{summary}</ReactMarkdown>
              </div>
            ) : (
              <div className="text-center py-8">
                <Button onClick={generateSummary}>Bắt đầu tóm tắt ngay</Button>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      {/* QUiZ */}
      <TabsContent value="quiz">
        <Card>
          <CardHeader className="flex flex-row items-start justify-between">
            <div>
              <CardTitle>Ôn tập Kiến thức</CardTitle>
              <CardDescription>Kiểm tra mức độ hiểu bài thông qua bộ câu hỏi trắc nghiệm tự động.</CardDescription>
            </div>
            <Button onClick={generateQuiz} disabled={isLoadingQuiz} variant="outline">
              {isLoadingQuiz ? <Loader2 className="w-4 h-4 animate-spin mr-2"/> : null}
              Tạo bộ câu hỏi mới
            </Button>
          </CardHeader>
          <CardContent>
            {quizzes.length > 0 ? (
              <div className="space-y-8">
                {quizzes.map((q, i) => (
                  <div key={i} className="space-y-3">
                    <h3 className="font-semibold text-lg">{i + 1}. {q.question}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {q.options.map((opt: string, j: number) => {
                        const isSelected = userAnswers[i] === opt;
                        const isCorrect = showResults && opt === q.correct_answer;
                        const isWrong = showResults && isSelected && opt !== q.correct_answer;
                        
                        let btnClass = "justify-start h-auto py-3 px-4 text-left whitespace-normal"
                        if (showResults) {
                          if (isCorrect) btnClass += " bg-green-100 border-green-500 text-green-800 hover:bg-green-100"
                          else if (isWrong) btnClass += " bg-red-100 border-red-500 text-red-800 hover:bg-red-100"
                          else btnClass += " opacity-50"
                        } else if (isSelected) {
                          btnClass += " ring-2 ring-primary bg-primary/5"
                        }

                        return (
                          <Button 
                            key={j} 
                            variant="outline" 
                            className={btnClass}
                            onClick={() => handleSelectAnswer(i, opt)}
                          >
                            {opt}
                          </Button>
                        )
                      })}
                    </div>
                    {showResults && (
                      <div className="mt-2 p-3 bg-muted rounded-md text-sm">
                        <span className="font-semibold">Giải thích: </span>{q.explanation}
                      </div>
                    )}
                  </div>
                ))}
                
                {!showResults && (
                  <Button className="w-full mt-8" size="lg" onClick={submitQuiz}>Nộp bài kiểm tra</Button>
                )}
              </div>
            ) : (
               <div className="text-center py-12 text-muted-foreground">
                 Chưa có câu hỏi nào. Nhấn "Tạo bộ câu hỏi mới" để bắt đầu.
               </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      {/* CHAT */}
      <TabsContent value="chat">
        <Card className="flex flex-col h-[600px]">
          <CardHeader className="border-b shrink-0">
            <CardTitle>Gia sư AI</CardTitle>
            <CardDescription>Hỏi bất cứ điều gì liên quan đến tài liệu này.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden p-0 flex flex-col">
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {chatHistory.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">
                    Hãy đặt câu hỏi đầu tiên để bắt đầu cuộc trò chuyện.
                  </div>
                ) : (
                  chatHistory.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                        msg.role === 'user' 
                          ? 'bg-primary text-primary-foreground rounded-br-none' 
                          : 'bg-muted rounded-bl-none prose prose-sm md:prose-base'
                      }`}>
                        {msg.role === 'user' ? (
                           msg.content
                        ) : (
                          <ReactMarkdown>{msg.content}</ReactMarkdown>
                        )}
                      </div>
                    </div>
                  ))
                )}
                {isChatting && (
                  <div className="flex justify-start">
                    <div className="bg-muted rounded-2xl rounded-bl-none px-4 py-2">
                      <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
            <form onSubmit={sendChatMessage} className="p-4 border-t shrink-0 flex gap-2 bg-white">
              <Input 
                placeholder="Nhập câu hỏi của bạn..." 
                value={chatMessage}
                onChange={e => setChatMessage(e.target.value)}
                disabled={isChatting}
              />
              <Button type="submit" disabled={isChatting || !chatMessage.trim()}>
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </CardContent>
        </Card>
      </TabsContent>

    </Tabs>
  )
}