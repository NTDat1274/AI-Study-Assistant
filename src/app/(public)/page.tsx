import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { FileText, HelpCircle, MessageSquare, ArrowRight, Zap, Brain, Shield } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full py-24 md:py-32 lg:py-40 bg-gradient-to-b from-blue-50 to-white flex flex-col items-center justify-center text-center px-4">
        <div className="max-w-4xl space-y-6">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900">
            Học tập thông minh hơn với <span className="text-primary">AI Study Assistant</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Hệ thống hỗ trợ quản lý tài liệu, tự động tóm tắt nội dung, sinh bộ câu hỏi trắc nghiệm và hỏi đáp trực tiếp với trợ lý ảo bằng trí tuệ nhân tạo.
          </p>
          <div className="pt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="h-12 px-8 text-lg w-full sm:w-auto">Bắt đầu miễn phí <ArrowRight className="ml-2 w-5 h-5" /></Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="h-12 px-8 text-lg w-full sm:w-auto">Đăng nhập</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">Tính năng cốt lõi</h2>
            <p className="mt-4 text-slate-600 text-lg">Mọi công cụ bạn cần để tối ưu hóa thời gian và hiệu quả học tập</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-none shadow-lg bg-slate-50/50">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 text-blue-600">
                  <FileText className="w-6 h-6" />
                </div>
                <CardTitle className="text-xl">Tóm tắt tự động</CardTitle>
                <CardDescription className="text-base mt-2">
                  Trích xuất ngay các ý chính và từ khóa quan trọng từ tài liệu dài hàng chục trang chỉ trong vài giây.
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="border-none shadow-lg bg-slate-50/50">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 text-green-600">
                  <HelpCircle className="w-6 h-6" />
                </div>
                <CardTitle className="text-xl">Sinh câu hỏi Quiz</CardTitle>
                <CardDescription className="text-base mt-2">
                  Tự động tạo ra các bài kiểm tra trắc nghiệm từ nội dung bài học để bạn luyện tập và ghi nhớ kiến thức.
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="border-none shadow-lg bg-slate-50/50">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 text-purple-600">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <CardTitle className="text-xl">Gia sư AI Hỏi đáp</CardTitle>
                <CardDescription className="text-base mt-2">
                  Trò chuyện trực tiếp với AI. Đặt câu hỏi và nhận câu trả lời chính xác dựa trên ngữ cảnh của tài liệu bạn đã tải lên.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="w-full py-20 px-4 bg-slate-900 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold">Quy trình 3 bước đơn giản</h2>
            <p className="mt-4 text-slate-400 text-lg">Bắt đầu học tập thông minh chỉ với vài thao tác</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 text-center relative">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-2xl font-bold mb-6 relative z-10">1</div>
              <h3 className="text-xl font-semibold mb-2">Tải tài liệu lên</h3>
              <p className="text-slate-400">Hỗ trợ các định dạng phổ biến như PDF, DOCX, và TXT (tối đa 10MB).</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-2xl font-bold mb-6 relative z-10">2</div>
              <h3 className="text-xl font-semibold mb-2">AI Phân tích</h3>
              <p className="text-slate-400">Hệ thống trích xuất nội dung và chuẩn bị dữ liệu ngữ cảnh cho Gemini API.</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-2xl font-bold mb-6 relative z-10">3</div>
              <h3 className="text-xl font-semibold mb-2">Bắt đầu học tập</h3>
              <p className="text-slate-400">Đọc tóm tắt, làm trắc nghiệm, hoặc chat trực tiếp với tài liệu của bạn.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="w-full py-20 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900">Câu hỏi thường gặp</h2>
          </div>
          <Accordion className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-lg">Hệ thống hỗ trợ những định dạng file nào?</AccordionTrigger>
              <AccordionContent className="text-base text-slate-600">
                Hiện tại hệ thống hỗ trợ 3 định dạng phổ biến nhất là PDF, DOCX và TXT. Giới hạn dung lượng tối đa cho mỗi file là 10MB để đảm bảo hiệu năng phân tích của AI.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger className="text-lg">Dữ liệu tài liệu của tôi có được bảo mật không?</AccordionTrigger>
              <AccordionContent className="text-base text-slate-600">
                Có. Tất cả tài liệu tải lên được lưu trữ trên nền tảng đám mây Supabase an toàn và chỉ có duy nhất tài khoản của bạn mới có quyền truy cập vào tài liệu đó.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger className="text-lg">Chatbot AI có trả lời sai thông tin không?</AccordionTrigger>
              <AccordionContent className="text-base text-slate-600">
                Gia sư AI được thiết lập với Prompt đặc biệt buộc phải trả lời dựa trên ngữ cảnh tài liệu bạn đã tải lên. Nếu câu hỏi nằm ngoài tài liệu, AI sẽ từ chối trả lời để tránh cung cấp thông tin sai lệch (hallucination).
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>
    </div>
  )
}
