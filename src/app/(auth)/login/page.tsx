import { login } from '../actions'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default async function LoginPage(props: { searchParams: Promise<{ error?: string }> }) {
  const searchParams = await props.searchParams;
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Đăng nhập</CardTitle>
        <CardDescription>Nhập email và mật khẩu của bạn để tiếp tục.</CardDescription>
      </CardHeader>
      <form action={login}>
        <CardContent className="space-y-4">
          {searchParams.error && (
            <div className="text-sm font-medium text-red-500">{searchParams.error}</div>
          )}
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
          <Button type="submit" className="w-full">Đăng nhập</Button>
          <div className="text-sm text-center text-muted-foreground">
            Chưa có tài khoản? <Link href="/register" className="underline hover:text-primary">Đăng ký ngay</Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  )
}