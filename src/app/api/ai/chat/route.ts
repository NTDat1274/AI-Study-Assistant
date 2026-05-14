import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { geminiModel } from '@/lib/gemini';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { documentId, message, history = [] } = await request.json();

    if (!documentId || !message) {
      return NextResponse.json({ error: 'documentId and message are required' }, { status: 400 });
    }

    // Lấy nội dung tài liệu
    const { data: document, error: docError } = await supabase
      .from('documents')
      .select('raw_text')
      .eq('id', documentId)
      .eq('user_id', user.id)
      .single();

    if (docError || !document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    // Khởi tạo Chat Session với Context
    const chat = geminiModel.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: `Bạn là một gia sư AI thân thiện. Hãy trả lời câu hỏi của tôi DỰA HOÀN TOÀN VÀO nội dung tài liệu được cung cấp dưới đây. Nếu câu hỏi không liên quan đến tài liệu, hãy từ chối trả lời một cách lịch sự và nhắc nhở tôi hỏi trong phạm vi tài liệu. \n\nNội dung tài liệu:\n${document.raw_text.substring(0, 30000)}` }],
        },
        {
          role: "model",
          parts: [{ text: "Đã rõ! Tôi sẽ chỉ trả lời dựa trên nội dung tài liệu được cung cấp. Bạn muốn hỏi gì nào?" }],
        },
        ...history // Lịch sử các câu hỏi trước đó nếu có (format của Gemini: role: user/model)
      ],
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = response.text();

    // Lưu vào chat history (tùy chọn)
    await supabase.from('chat_history').insert([
      { document_id: documentId, user_id: user.id, role: 'user', content: message },
      { document_id: documentId, user_id: user.id, role: 'assistant', content: text }
    ]);

    // Log API Usage
    await supabase.from('api_logs').insert({
      user_id: user.id,
      action_type: 'chat'
    });

    return NextResponse.json({ reply: text });

  } catch (error: unknown) {
    console.error('Chat Error:', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error'
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
