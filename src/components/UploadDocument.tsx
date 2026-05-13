'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { UploadCloud, File, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function UploadDocument() {
  const [isUploading, setIsUploading] = useState(false)
  const router = useRouter()

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Client-side validation
    const MAX_SIZE = 10 * 1024 * 1024 // 10MB
    const ALLOWED_TYPES = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ]

    if (file.size > MAX_SIZE) {
      toast.error('File quá lớn. Vui lòng chọn file dưới 10MB.')
      e.target.value = '' // reset
      return
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error('Định dạng không được hỗ trợ. Vui lòng chọn PDF, DOCX hoặc TXT.')
      e.target.value = '' // reset
      return
    }

    setIsUploading(true)
    const toastId = toast.loading('Đang tải lên và phân tích tài liệu...')

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Có lỗi xảy ra khi tải tài liệu')
      }

      toast.success('Tải liệu lên thành công!', { id: toastId })
      router.refresh() // Reload data in dashboard
    } catch (error: any) {
      console.error(error)
      toast.error(error.message || 'Lỗi hệ thống', { id: toastId })
    } finally {
      setIsUploading(false)
      e.target.value = '' // reset
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tải lên Tài liệu</CardTitle>
        <CardDescription>Hỗ trợ PDF, DOCX, TXT (Tối đa 10MB)</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center w-full">
          <label htmlFor="dropzone-file" className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer bg-muted/20 hover:bg-muted/50 transition-colors ${isUploading ? 'opacity-50 pointer-events-none' : 'border-muted-foreground/30'}`}>
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              {isUploading ? (
                <Loader2 className="w-8 h-8 mb-3 text-primary animate-spin" />
              ) : (
                <UploadCloud className="w-8 h-8 mb-3 text-muted-foreground" />
              )}
              <p className="mb-2 text-sm text-muted-foreground">
                <span className="font-semibold">Nhấn để tải lên</span> hoặc kéo thả file vào đây
              </p>
            </div>
            <input 
              id="dropzone-file" 
              type="file" 
              className="hidden" 
              accept=".pdf,.docx,.txt"
              onChange={handleFileChange}
              disabled={isUploading}
            />
          </label>
        </div>
      </CardContent>
    </Card>
  )
}