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

    const { documentId, difficulty = 'Trung bình', numQuestions = 5 } = await request.json();

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

    const prompt = `
Dựa vào tài liệu dưới đây, hãy tạo ra ${numQuestions} câu hỏi trắc nghiệm ở mức độ ${difficulty} để kiểm tra kiến thức.
Yêu cầu BẮT BUỘC:
1. Trả về kết quả CHỈ LÀ ĐỊNH DẠNG JSON MẢNG (Array), KHÔNG được bọc trong markdown block (không dùng \`\`\`json).
2. Không kèm theo bất kỳ văn bản nào khác ngoài JSON.
Cấu trúc JSON mỗi object:
{
  "question": "Nội dung câu hỏi",
  "options": ["Đáp án A", "Đáp án B", "Đáp án C", "Đáp án D"],
  "correct_answer": "Đáp án A",
  "explanation": "Giải thích ngắn gọn tại sao đây là đáp án đúng"
}

Nội dung tài liệu:
${document.raw_text.substring(0, 30000)}
`;

    const result = await geminiModel.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    // Làm sạch JSON (phòng trường hợp AI vẫn trả về markdown block)
    text = text.replace(/^```json\s*/i, '').replace(/```$/i, '').trim();

    let quizzes;
    try {
      quizzes = JSON.parse(text);
    } catch (e) {
      console.error('Failed to parse AI JSON:', text);
      return NextResponse.json({ error: 'AI trả về định dạng không hợp lệ, vui lòng thử lại.' }, { status: 500 });
    }

    // Lưu Quiz vào Database
    const { data: quizData, error: quizError } = await supabase
      .from('quizzes')
      .insert({
        document_id: documentId,
        user_id: user.id,
        questions: quizzes,
        score: null // Chưa làm bài
      })
      .select()
      .single();

    if (quizError) {
      return NextResponse.json({ error: 'Failed to save quiz to database' }, { status: 500 });
    }

    return NextResponse.json({ success: true, quizId: quizData.id, questions: quizzes });

  } catch (error: any) {
    console.error('Quiz Gen Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
