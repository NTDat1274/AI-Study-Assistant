import { resetPassword } from '../actions'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default async function ForgotPasswordPage(props: { searchParams: Promise<{ error?: string, message?: string }> }) {
  const searchParams = await props.searchParams;
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Quên mật khẩu</CardTitle>
        <CardDescription>Nhập địa chỉ email của bạn, chúng tôi sẽ gửi liên kết để đặt lại mật khẩu.</CardDescription>
      </CardHeader>
      <form action={resetPassword}>
        <CardContent className="space-y-4">
          {searchParams.error && (
            <div className="text-sm font-medium text-red-500">{searchParams.error}</div>
          )}
          {searchParams.message && (
            <div className="text-sm font-medium text-green-500">{searchParams.message}</div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required placeholder="m@example.com" />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button type="submit" className="w-full">Gửi liên kết</Button>
          <div className="text-sm text-center text-muted-foreground">
            Nhớ mật khẩu? <Link href="/login" className="underline hover:text-primary">Đăng nhập</Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  )
}
