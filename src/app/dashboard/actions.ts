'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function deleteDocument(documentId: string, fileUrl: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Unauthorized' }
  }

  // Verify ownership
  const { data: doc } = await supabase
    .from('documents')
    .select('id')
    .eq('id', documentId)
    .eq('user_id', user.id)
    .single()
  
  if (!doc) {
    return { error: 'Không tìm thấy tài liệu hoặc không có quyền' }
  }

  // Delete from storage if it exists
  if (fileUrl) {
    await supabase.storage.from('study_documents').remove([fileUrl])
  }

  // Delete from database
  const { error } = await supabase
    .from('documents')
    .delete()
    .eq('id', documentId)

  if (error) {
    return { error: 'Lỗi khi xóa dữ liệu từ DB' }
  }

  revalidatePath('/dashboard')
  return { success: true }
}
