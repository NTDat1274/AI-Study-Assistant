'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateProfile(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Unauthorized' }
  }

  const fullName = formData.get('full_name') as string
  const avatarFile = formData.get('avatar') as File | null
  const password = formData.get('password') as string

  try {
    let avatarUrl = undefined

    // 1. Upload Avatar if provided
    if (avatarFile && avatarFile.size > 0) {
      const fileExt = avatarFile.name.split('.').pop()
      const fileName = `${user.id}/${Date.now()}.${fileExt}`
      
      const { error: uploadError, data } = await supabase.storage
        .from('avatars')
        .upload(fileName, avatarFile, { upsert: true })

      if (uploadError) throw new Error('Lỗi khi tải ảnh đại diện: ' + uploadError.message)
      
      // Get public URL
      const { data: publicUrlData } = supabase.storage.from('avatars').getPublicUrl(fileName)
      avatarUrl = publicUrlData.publicUrl
    }

    // 2. Update Auth Metadata & Password
    const updateData: any = { data: {} }
    if (fullName) updateData.data.full_name = fullName
    if (avatarUrl) updateData.data.avatar_url = avatarUrl
    if (password) updateData.password = password

    const { error: authError } = await supabase.auth.updateUser(updateData)
    if (authError) throw new Error('Lỗi khi cập nhật Auth: ' + authError.message)

    // 3. Update public.users table
    const dbUpdate: any = {}
    if (fullName) dbUpdate.full_name = fullName
    if (avatarUrl) dbUpdate.avatar_url = avatarUrl

    if (Object.keys(dbUpdate).length > 0) {
      const { error: dbError } = await supabase
        .from('users')
        .update(dbUpdate)
        .eq('id', user.id)
      
      if (dbError) throw new Error('Lỗi khi cập nhật Database: ' + dbError.message)
    }

    revalidatePath('/dashboard')
    return { success: true }
  } catch (error: any) {
    return { error: error.message }
  }
}
