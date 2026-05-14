'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { updateProfile } from './actions'

type ProfileUser = {
  email?: string | null
}

type ProfileData = {
  full_name?: string | null
  avatar_url?: string | null
} | null

export default function ProfileForm({ user, profile }: { user: ProfileUser; profile: ProfileData }) {
  const [isLoading, setIsLoading] = useState(false)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(profile?.avatar_url || null)

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setAvatarPreview(url)
    }
  }

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true)
    const res = await updateProfile(formData)
    setIsLoading(false)

    if (res.error) {
      toast.error(res.error)
    } else {
      toast.success('Cập nhật hồ sơ thành công!')
      // Reset password field
      const form = document.getElementById('profile-form') as HTMLFormElement
      if (form) form.reset()
    }
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Cập nhật Hồ sơ</CardTitle>
        <CardDescription>Quản lý thông tin cá nhân và bảo mật tài khoản.</CardDescription>
      </CardHeader>
      <CardContent>
        <form id="profile-form" action={handleSubmit} className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
            <Avatar className="w-24 h-24 border">
              <AvatarImage src={avatarPreview || ''} />
              <AvatarFallback className="text-2xl">{profile?.full_name?.charAt(0) || user.email?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="space-y-2 flex-1">
              <Label htmlFor="avatar">Ảnh đại diện mới</Label>
              <Input id="avatar" name="avatar" type="file" accept="image/*" onChange={handleAvatarChange} />
              <p className="text-xs text-muted-foreground">Khuyến nghị ảnh vuông, tối đa 2MB.</p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="email">Email (Không thể thay đổi)</Label>
              <Input id="email" value={user.email} disabled className="bg-muted" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="full_name">Họ và tên hiển thị</Label>
              <Input id="full_name" name="full_name" defaultValue={profile?.full_name || ''} placeholder="Nhập tên của bạn" />
            </div>
          </div>

          <div className="space-y-2 pt-4 border-t">
            <Label htmlFor="password">Đổi Mật khẩu mới (Tùy chọn)</Label>
            <Input id="password" name="password" type="password" placeholder="Bỏ trống nếu không muốn đổi" />
            <p className="text-xs text-muted-foreground">Mật khẩu mới sẽ có hiệu lực ngay lập tức.</p>
          </div>

          <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Lưu thay đổi
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}