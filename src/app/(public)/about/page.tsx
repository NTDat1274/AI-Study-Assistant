import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto py-16 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Giới thiệu về Dự án</h1>
        <p className="text-xl text-slate-600">Tìm hiểu về mục tiêu, tác giả và công nghệ phía sau AI Study Assistant</p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-2xl text-primary">Thông tin Đề tài</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-slate-700 leading-relaxed">
            <p><strong>Tên đề tài:</strong> AI Study Assistant – Hệ thống hỗ trợ học tập thông minh tích hợp trí tuệ nhân tạo.</p>
            <p><strong>Sinh viên thực hiện:</strong> Nguyễn Tiến Đạt (MSSV: 2212353)</p>
            <p><strong>Giáo viên hướng dẫn:</strong> Nguyễn Trọng Hiếu</p>
            <p className="pt-4 border-t">
              Đề tài được xây dựng nhằm giải quyết bài toán khó khăn của sinh viên trong việc tiếp thu khối lượng tài liệu học thuật lớn. Thông qua việc ứng dụng AI, hệ thống mong muốn tiết kiệm thời gian đọc hiểu và tăng cường khả năng ghi nhớ cho người học.
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-2xl text-primary">Kiến trúc Công nghệ</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-slate-700">
            <div>
              <h3 className="font-semibold text-lg text-slate-900 mb-2">Frontend</h3>
              <p>Phát triển dựa trên <strong>Next.js App Router</strong> kết hợp với <strong>TailwindCSS</strong> và bộ UI component <strong>shadcn/ui</strong> để đảm bảo giao diện hiện đại, tối ưu SEO và Server-side Rendering.</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg text-slate-900 mb-2">Backend & Database</h3>
              <p>Sử dụng nền tảng BaaS <strong>Supabase</strong> cung cấp PostgreSQL Database, hệ thống xác thực Auth an toàn, và Storage để lưu trữ tài liệu với Row Level Security (RLS).</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg text-slate-900 mb-2">AI Engine</h3>
              <p>Tích hợp <strong>Google Gemini API</strong> (gemini-1.5-flash) làm động cơ xử lý ngôn ngữ tự nhiên cho các tác vụ: Tóm tắt, Tạo Quiz định dạng JSON và Hỏi đáp có ngữ cảnh.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
