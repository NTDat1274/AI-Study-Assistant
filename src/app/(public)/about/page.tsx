import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto py-16 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Giới thiệu về AI Study Assistant</h1>
        <p className="text-xl text-slate-600">Cách mạng hóa quá trình học tập và nghiên cứu bằng Trí tuệ Nhân tạo</p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 mb-8">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-2xl text-primary">Sứ mệnh & Tầm nhìn</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-slate-700 leading-relaxed">
            <p>
              Chúng tôi tin rằng học tập không nên là một gánh nặng. <strong>AI Study Assistant</strong> ra đời với sứ mệnh trao quyền cho sinh viên, nhà nghiên cứu và người học suốt đời bằng cách đơn giản hóa quá trình tiêu thụ thông tin.
            </p>
            <p>
              Bằng cách tận dụng các mô hình ngôn ngữ lớn (LLMs), chúng tôi cung cấp các công cụ mạnh mẽ để tóm tắt tài liệu, tạo câu hỏi ôn tập (quiz) và trả lời các thắc mắc phức tạp dựa trên ngữ cảnh cá nhân hóa, giúp người dùng tiết kiệm hàng nghìn giờ đọc tài liệu.
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-2xl text-primary">Đội ngũ Phát triển</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-slate-700 leading-relaxed">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-xl">
                NĐ
              </div>
              <div>
                <h3 className="font-semibold text-lg text-slate-900">Nguyễn Tiến Đạt</h3>
                <p className="text-sm text-slate-500">Founder & Lead Engineer</p>
              </div>
            </div>
            <p>
              Đội ngũ của chúng tôi tập hợp những kỹ sư đam mê công nghệ giáo dục (EdTech) và AI. Chúng tôi làm việc không ngừng nghỉ để đưa những công nghệ tối tân nhất vào các giải pháp thực tế, dễ sử dụng cho mọi người.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl text-primary">Nền tảng Công nghệ</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-slate-700">
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-semibold text-lg text-slate-900 mb-2">Frontend</h3>
              <p className="text-sm">Xây dựng trên kiến trúc <strong>Next.js App Router</strong> hiện đại, mang lại trải nghiệm mượt mà với Server-Side Rendering (SSR). Giao diện được thiết kế tối giản, tinh tế bằng <strong>TailwindCSS</strong> và <strong>shadcn/ui</strong>.</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg text-slate-900 mb-2">Hạ tầng & Dữ liệu</h3>
              <p className="text-sm">Hệ thống phân phối dữ liệu tốc độ cao, quản lý định danh người dùng và bảo mật RLS được cung cấp bởi hạ tầng đám mây <strong>Supabase</strong> (PostgreSQL).</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg text-slate-900 mb-2">AI Engine</h3>
              <p className="text-sm">Trái tim của hệ thống là <strong>Google Gemini AI</strong>, xử lý hàng triệu token với độ trễ thấp, đáp ứng các tác vụ tóm tắt thông minh và sinh ngữ cảnh học thuật chuẩn xác.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
