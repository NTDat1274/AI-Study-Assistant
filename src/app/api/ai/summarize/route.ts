import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { geminiModel } from '@/lib/gemini';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { documentId } = await request.json();

    if (!documentId) {
      return NextResponse.json({ error: 'documentId is required' }, { status: 400 });
    }

    // Lấy nội dung tài liệu từ DB
    const { data: document, error: docError } = await supabase
      .from('documents')
      .select('raw_text, filename')
      .eq('id', documentId)
      .eq('user_id', user.id)
      .single();

    if (docError || !document) {
      return NextResponse.json({ error: 'Document not found or access denied' }, { status: 404 });
    }

    if (!document.raw_text) {
      return NextResponse.json({ error: 'Document has no text content' }, { status: 400 });
    }

    const prompt = `
Bạn là một trợ lý học tập xuất sắc. Hãy tóm tắt tài liệu sau đây một cách ngắn gọn, súc tích và dễ hiểu nhất cho sinh viên. 
Yêu cầu:
1. Trình bày dưới dạng gạch đầu dòng các ý chính.
2. Nêu bật 3-5 từ khóa quan trọng nhất ở cuối.
3. Chỉ sử dụng thông tin có trong tài liệu được cung cấp. Không bịa đặt thêm.

Nội dung tài liệu (${document.filename}):
${document.raw_text.substring(0, 30000)} // Giới hạn một phần text để tránh vượt quá token limit nếu file quá dài
`;

    const result = await geminiModel.generateContent(prompt);
    const response = await result.response;
    const summary = response.text();

    // Log API Usage
    await supabase.from('api_logs').insert({
      user_id: user.id,
      action_type: 'summarize'
    });

    return NextResponse.json({ summary });

  } catch (error: any) {
    console.error('Summarize Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
