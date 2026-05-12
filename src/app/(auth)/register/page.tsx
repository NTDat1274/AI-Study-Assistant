import { signup } from '../actions'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default async function RegisterPage(props: { searchParams: Promise<{ error?: string }> }) {
  const searchParams = await props.searchParams;
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Đăng ký</CardTitle>
        <CardDescription>Tạo tài khoản mới để bắt đầu sử dụng AI Study Assistant.</CardDescription>
      </CardHeader>
      <form action={signup}>
        <CardContent className="space-y-4">
          {searchParams.error && (
            <div className="text-sm font-medium text-red-500">{searchParams.error}</div>
          )}
          <div className="space-y-2">
            <Label htmlFor="full_name">Họ và tên</Label>
            <Input id="full_name" name="full_name" type="text" required placeholder="Nguyễn Văn A" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required placeholder="m@example.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Mật khẩu</Label>
            <Input id="password" name="password" type="password" required />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button type="submit" className="w-full">Đăng ký</Button>
          <div className="text-sm text-center text-muted-foreground">
            Đã có tài khoản? <Link href="/login" className="underline hover:text-primary">Đăng nhập</Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  )
}