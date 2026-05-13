import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.warn(
    "Missing GEMINI_API_KEY environment variable. AI features will not work.",
  );
}

// Khởi tạo Gemini Client
export const genAI = new GoogleGenerativeAI(apiKey || "");

// Sử dụng model gemini-2.5-flash cho các tác vụ text thông thường
export const geminiModel = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
});
