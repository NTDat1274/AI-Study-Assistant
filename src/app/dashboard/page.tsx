import { createClient } from '@/utils/supabase/server'
import { logout } from '../(auth)/actions'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <p className="mb-4">Xin chào, {user?.email}</p>
      <form action={logout}>
        <button type="submit" className="px-4 py-2 bg-red-500 text-white rounded">Đăng xuất</button>
      </form>
    </div>
  )
}