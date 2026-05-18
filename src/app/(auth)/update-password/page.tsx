import { updatePassword } from '../actions'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

export default async function UpdatePasswordPage(props: { searchParams: Promise<{ error?: string, message?: string }> }) {
  const searchParams = await props.searchParams;
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Đặt lại mật khẩu</CardTitle>
        <CardDescription>Vui lòng nhập mật khẩu mới của bạn.</CardDescription>
      </CardHeader>
      <form action={updatePassword}>
        <CardContent className="space-y-4">
          {searchParams.error && (
            <div className="text-sm font-medium text-red-500">{searchParams.error}</div>
          )}
          {searchParams.message && (
            <div className="text-sm font-medium text-green-500">{searchParams.message}</div>
          )}
          <div className="space-y-2">
            <Label htmlFor="password">Mật khẩu mới</Label>
            <Input id="password" name="password" type="password" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
            <Input id="confirmPassword" name="confirmPassword" type="password" required />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full">Cập nhật mật khẩu</Button>
        </CardFooter>
      </form>
    </Card>
  )
}
