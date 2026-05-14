'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function submitQuiz(quizId: string, userAnswers: any, score: number) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Unauthorized' }
  }

  const { error } = await supabase
    .from('quizzes')
    .update({ user_answers: userAnswers, score: score })
    .eq('id', quizId)
    .eq('user_id', user.id)

  if (error) {
    return { error: 'Lỗi khi lưu bài làm' }
  }

  revalidatePath('/dashboard/study')
  return { success: true }
}
