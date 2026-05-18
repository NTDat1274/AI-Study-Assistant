import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Mail, MapPin, Phone } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="max-w-6xl mx-auto py-16 px-4">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Liên hệ với chúng tôi</h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
          Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn. Hãy gửi tin nhắn nếu bạn có bất kỳ câu hỏi hay đề xuất nào.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-6">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">Thông tin liên hệ</CardTitle>
              <CardDescription className="text-base mt-2">
                Đội ngũ hỗ trợ của chúng tôi sẽ phản hồi bạn trong vòng 24 giờ làm việc.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 mt-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-slate-900">Văn phòng chính</h3>
                  <p className="text-slate-600 mt-1">123 Đường Công Nghệ, Quận 1<br/>TP. Hồ Chí Minh, Việt Nam</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-slate-900">Email hỗ trợ</h3>
                  <p className="text-slate-600 mt-1">support@aistudy.com</p>
                  <p className="text-slate-600">contact@aistudy.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Phone className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-slate-900">Điện thoại</h3>
                  <p className="text-slate-600 mt-1">+84 123 456 789</p>
                  <p className="text-sm text-slate-500 mt-1">Thứ 2 - Thứ 6: 8:00 - 18:00</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Gửi tin nhắn cho chúng tôi</CardTitle>
              <CardDescription>Điền thông tin vào biểu mẫu dưới đây, chúng tôi sẽ liên hệ lại sớm nhất.</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Họ và tên</Label>
                    <Input id="name" placeholder="Nguyễn Văn A" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Địa chỉ Email</Label>
                    <Input id="email" type="email" placeholder="nguyenvana@example.com" required />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="subject">Tiêu đề</Label>
                  <Input id="subject" placeholder="Bạn cần hỗ trợ vấn đề gì?" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Nội dung tin nhắn</Label>
                  <textarea 
                    id="message" 
                    className="flex min-h-[150px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50" 
                    placeholder="Vui lòng mô tả chi tiết..." 
                    required 
                  />
                </div>

                <Button type="button" className="w-full md:w-auto">
                  Gửi tin nhắn
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
