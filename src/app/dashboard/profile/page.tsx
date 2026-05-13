import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import ProfileForm from './ProfileForm'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Lấy thông tin chi tiết từ bảng users
  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .maybeSingle()

  return (
    <main className="max-w-5xl mx-auto p-4 md:p-8 mt-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-primary">Quản lý Tài khoản</h1>
      </div>
      <ProfileForm user={user} profile={profile} />
    </main>
  )
}
