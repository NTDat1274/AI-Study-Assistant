import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import PDFParser from "pdf2json";
import mammoth from "mammoth";

// Chạy trên Node.js runtime để hỗ trợ các thư viện đọc file native
export const runtime = "nodejs";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
];

type PdfParserDataError = { parserError?: Error };

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Kiểm tra quyền truy cập (Auth)
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate size and type
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File exceeds 10MB limit" },
        { status: 400 },
      );
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only PDF, DOCX, and TXT are supported." },
        { status: 400 },
      );
    }

    const fileBuffer = Buffer.from(await file.arrayBuffer());
    let rawText = "";

    // Extract text based on file type
    if (file.type === "application/pdf") {
      try {
        const rawTextContent = await new Promise<string>((resolve, reject) => {
          const pdfParser = new PDFParser(null, true);
          pdfParser.on("pdfParser_dataError", (errData: PdfParserDataError) => {
            reject(errData.parserError ?? new Error("PDF parse error"));
          });
          pdfParser.on("pdfParser_dataReady", () => {
            resolve(pdfParser.getRawTextContent());
          });
          pdfParser.parseBuffer(fileBuffer);
        });
        rawText = rawTextContent;
      } catch (err: unknown) {
        console.error("PDF Parse Error:", err);
        const message = err instanceof Error ? err.message : "Unknown error";
        return NextResponse.json(
          { error: "Failed to parse PDF file: " + message },
          { status: 500 },
        );
      }
    } else if (
      file.type ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      try {
        const result = await mammoth.extractRawText({ buffer: fileBuffer });
        rawText = result.value;
      } catch {
        return NextResponse.json(
          { error: "Failed to parse DOCX file" },
          { status: 500 },
        );
      }
    } else if (file.type === "text/plain") {
      rawText = fileBuffer.toString("utf-8");
    }

    // Nếu không lấy được chữ (ví dụ file rỗng hoặc pdf chỉ toàn ảnh)
    if (!rawText || rawText.trim() === "") {
      return NextResponse.json(
        {
          error:
            "Could not extract text from the document. The document might be empty or scanned as images.",
        },
        { status: 400 },
      );
    }

    // Generate unique filename for storage
    const fileExt = file.name.split(".").pop();
    const storageFileName = `${user.id}/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;

    // Upload to Supabase Storage
    const { error: storageError } = await supabase.storage
      .from("study_documents")
      .upload(storageFileName, fileBuffer, {
        contentType: file.type,
        upsert: false,
      });

    if (storageError) {
      return NextResponse.json(
        { error: "Failed to upload file to storage: " + storageError.message },
        { status: 500 },
      );
    }

    // Lấy Public URL của file (Tùy thuộc vào bucket public hay private. Nếu private thì dùng createSignedUrl sau này khi hiển thị)
    // Ở đây ta cứ lưu đường dẫn tương đối (path) vào DB
    const fileUrl = storageFileName;

    // Insert into Database
    const { data: docData, error: dbError } = await supabase
      .from("documents")
      .insert({
        user_id: user.id,
        filename: file.name,
        file_type: file.type,
        file_size: file.size,
        file_url: fileUrl,
        raw_text: rawText,
        status: "ready", // Xử lý trực tiếp nên chuyển sang ready luôn
      })
      .select()
      .single();

    if (dbError) {
      // Rollback storage if db insert fails
      await supabase.storage.from("study_documents").remove([storageFileName]);
      return NextResponse.json(
        { error: "Failed to save document metadata: " + dbError.message },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true, document: docData });
  } catch (error: unknown) {
    console.error("Upload Error:", error);
    const message =
      error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
