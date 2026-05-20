"use client";

import { useState, useRef, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BookOpen,
  HelpCircle,
  MessageSquare,
  Send,
  Loader2,
  ArrowLeft,
  Play,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import { submitQuiz } from "@/app/dashboard/study/[id]/actions";

type QuizQuestion = {
  question: string;
  options: string[];
  correct_answer: string;
  explanation: string;
};

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

interface Quiz {
  id: string;
  questions: QuizQuestion[];
  score: number | null;
  user_answers: Record<number, string> | null;
  created_at: string;
}

export default function StudyTabs({
  documentId,
  initialSummary,
  initialQuizzes,
  initialChatHistory,
}: {
  documentId: string;
  initialSummary: string | null;
  initialQuizzes: Quiz[];
  initialChatHistory: ChatMessage[];
}) {
  // States for Summary
  const [summary, setSummary] = useState<string | null>(initialSummary);
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);

  // States for Quiz
  const [quizList, setQuizList] = useState<Quiz[]>(initialQuizzes);
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [isLoadingQuiz, setIsLoadingQuiz] = useState(false);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);

  // States for Chat
  const [chatHistory, setChatHistory] =
    useState<ChatMessage[]>(initialChatHistory);
  const [chatMessage, setChatMessage] = useState("");
  const [isChatting, setIsChatting] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Tự động cuộn xuống cuối chat
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatHistory, isChatting]);

  // --- Handlers ---

  const generateSummary = async () => {
    setIsLoadingSummary(true);
    try {
      const res = await fetch("/api/ai/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documentId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSummary(data.summary);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Lỗi khi tạo tóm tắt";
      toast.error(message);
    } finally {
      setIsLoadingSummary(false);
    }
  };

  const generateQuiz = async () => {
    setIsLoadingQuiz(true);
    try {
      const res = await fetch("/api/ai/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          documentId,
          numQuestions: 5,
          difficulty: "Trung bình",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      const newQuiz = {
        id: data.quizId,
        questions: data.questions,
        score: null,
        user_answers: null,
        created_at: new Date().toISOString(),
      };

      setQuizList([newQuiz, ...quizList]);
      openQuiz(newQuiz);
      toast.success("Đã tạo xong câu hỏi trắc nghiệm!");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Lỗi khi tạo câu hỏi";
      toast.error(message);
    } finally {
      setIsLoadingQuiz(false);
    }
  };

  const openQuiz = (quiz: Quiz) => {
    setActiveQuiz(quiz);
    setUserAnswers(quiz.user_answers || {});
    setShowResults(quiz.score !== null);
  };

  const handleSelectAnswer = (qIndex: number, answer: string) => {
    if (showResults) return; // Không cho sửa khi đã nộp
    setUserAnswers((prev) => ({ ...prev, [qIndex]: answer }));
  };

  const submitCurrentQuiz = async () => {
    if (!activeQuiz) return;

    if (Object.keys(userAnswers).length < activeQuiz.questions.length) {
      toast.warning("Vui lòng trả lời hết các câu hỏi trước khi nộp bài.");
      return;
    }

    let correctCount = 0;
    activeQuiz.questions.forEach((q, i) => {
      if (userAnswers[i] === q.correct_answer) correctCount++;
    });

    setShowResults(true);

    // Save to DB
    const res = await submitQuiz(activeQuiz.id, userAnswers, correctCount);
    if (res.success) {
      toast.success(
        `Đã nộp bài! Điểm: ${correctCount}/${activeQuiz.questions.length}`,
      );
      // Update local list
      setQuizList(
        quizList.map((q) =>
          q.id === activeQuiz.id
            ? { ...q, score: correctCount, user_answers: userAnswers }
            : q,
        ),
      );
    } else {
      toast.error(res.error);
    }
  };

  const sendChatMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    const newMessage = chatMessage;
    setChatMessage("");

    // Thêm tin nhắn user vào UI trước
    const newHistory: ChatMessage[] = [
      ...chatHistory,
      { role: "user", content: newMessage },
    ];
    setChatHistory(newHistory);
    setIsChatting(true);

    try {
      // Map history sang format của Gemini (model/user)
      const geminiHistory = chatHistory.map((msg) => ({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.content }],
      }));

      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          documentId,
          message: newMessage,
          history: geminiHistory,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setChatHistory([
        ...newHistory,
        { role: "assistant", content: data.reply ?? "" },
      ]);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Lỗi khi gửi tin nhắn";
      toast.error(message);
      setChatMessage(newMessage);
      setChatHistory(chatHistory);
    } finally {
      setIsChatting(false);
    }
  };

  return (
    <Tabs defaultValue="summary" className="w-full">
      <TabsList className="grid w-full grid-cols-3 mb-8">
        <TabsTrigger value="summary" className="flex gap-2">
          <BookOpen className="w-4 h-4" /> Tóm tắt
        </TabsTrigger>
        <TabsTrigger value="quiz" className="flex gap-2">
          <HelpCircle className="w-4 h-4" /> Trắc nghiệm
        </TabsTrigger>
        <TabsTrigger value="chat" className="flex gap-2">
          <MessageSquare className="w-4 h-4" /> Hỏi đáp
        </TabsTrigger>
      </TabsList>

      {/* TÓM TẮT */}
      <TabsContent value="summary">
        <Card>
          <CardHeader className="flex flex-row items-start justify-between">
            <div>
              <CardTitle>Tóm tắt Nội dung</CardTitle>
              <CardDescription>
                AI sẽ tự động đọc và tóm tắt những ý chính quan trọng nhất từ
                tài liệu của bạn.
              </CardDescription>
            </div>
            {!isLoadingSummary && (
              <Button onClick={generateSummary} variant="outline" size="sm">
                {summary ? "Tạo lại tóm tắt" : "Bắt đầu tóm tắt ngay"}
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {isLoadingSummary ? (
              <div className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-[90%]" />
                <Skeleton className="h-4 w-[80%]" />
                <Skeleton className="h-4 w-[95%]" />
              </div>
            ) : summary ? (
              <div className="prose prose-sm md:prose-base max-w-none prose-blue">
                <ReactMarkdown>{summary}</ReactMarkdown>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">
                  Tài liệu chưa được tóm tắt.
                </p>
                <Button onClick={generateSummary}>Bắt đầu tóm tắt ngay</Button>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      {/* QUiZ */}
      <TabsContent value="quiz">
        {!activeQuiz ? (
          <Card>
            <CardHeader className="flex flex-row items-start justify-between">
              <div>
                <CardTitle>Lịch sử Bài kiểm tra</CardTitle>
                <CardDescription>
                  Các bộ câu hỏi trắc nghiệm đã được AI tạo cho tài liệu này.
                </CardDescription>
              </div>
              <Button
                onClick={generateQuiz}
                disabled={isLoadingQuiz}
                variant="default"
              >
                {isLoadingQuiz ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : null}
                Tạo bộ câu hỏi mới
              </Button>
            </CardHeader>
            <CardContent>
              {quizList.length > 0 ? (
                <div className="space-y-4">
                  {quizList.map((quiz, i) => (
                    <div
                      key={quiz.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${quiz.score !== null ? "bg-green-100 text-green-600" : "bg-blue-100 text-blue-600"}`}
                        >
                          {quiz.score !== null ? (
                            <CheckCircle2 className="w-5 h-5" />
                          ) : (
                            <Play className="w-5 h-5 ml-1" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">
                            Bài Quiz #{quizList.length - i}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(quiz.created_at).toLocaleString("vi-VN")}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        {quiz.score !== null && (
                          <div className="font-bold text-primary">
                            Điểm: {quiz.score}/{quiz.questions.length}
                          </div>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openQuiz(quiz)}
                        >
                          {quiz.score !== null ? "Xem kết quả" : "Làm bài"}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground border border-dashed rounded-lg">
                  Chưa có bài quiz nào. Nhấn &quot;Tạo bộ câu hỏi mới&quot; để
                  bắt đầu.
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader className="flex flex-row items-center gap-4 pb-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setActiveQuiz(null)}
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <CardTitle>Làm bài kiểm tra</CardTitle>
                <CardDescription>
                  Chọn câu trả lời đúng nhất cho mỗi câu hỏi.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-8 mt-4">
                {activeQuiz.questions.map((q, i) => (
                  <div key={i} className="space-y-3">
                    <h3 className="font-semibold text-lg">
                      {i + 1}. {q.question}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {q.options.map((opt, j) => {
                        const isSelected = userAnswers[i] === opt;
                        const isCorrect =
                          showResults && opt === q.correct_answer;
                        const isWrong =
                          showResults && isSelected && opt !== q.correct_answer;

                        let btnClass =
                          "justify-start h-auto py-3 px-4 text-left whitespace-normal";
                        if (showResults) {
                          if (isCorrect)
                            btnClass +=
                              " bg-green-100 border-green-500 text-green-800 hover:bg-green-100";
                          else if (isWrong)
                            btnClass +=
                              " bg-red-100 border-red-500 text-red-800 hover:bg-red-100";
                          else btnClass += " opacity-50";
                        } else if (isSelected) {
                          btnClass += " ring-2 ring-primary bg-primary/5";
                        }

                        return (
                          <Button
                            key={j}
                            variant="outline"
                            className={btnClass}
                            onClick={() => handleSelectAnswer(i, opt)}
                          >
                            {opt}
                          </Button>
                        );
                      })}
                    </div>
                    {showResults && (
                      <div className="mt-2 p-3 bg-muted rounded-md text-sm">
                        <span className="font-semibold">Giải thích: </span>
                        {q.explanation}
                      </div>
                    )}
                  </div>
                ))}

                {!showResults && (
                  <Button
                    className="w-full mt-8"
                    size="lg"
                    onClick={submitCurrentQuiz}
                  >
                    Nộp bài kiểm tra
                  </Button>
                )}
                {showResults && (
                  <div className="p-4 bg-primary/10 rounded-lg text-center mt-8">
                    <p className="text-xl font-bold text-primary">
                      Điểm của bạn: {activeQuiz.score ?? 0} /{" "}
                      {activeQuiz.questions.length}
                    </p>
                    <Button
                      className="mt-4"
                      onClick={() => setActiveQuiz(null)}
                    >
                      Quay lại danh sách
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </TabsContent>

      {/* CHAT */}
      <TabsContent value="chat">
        <Card className="flex flex-col h-[600px]">
          <CardHeader className="border-b shrink-0">
            <CardTitle>Gia sư AI</CardTitle>
            <CardDescription>
              Hỏi bất cứ điều gì liên quan đến tài liệu này.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 min-h-0 p-0 flex flex-col">
            <div className="flex-1 min-h-0">
              <ScrollArea className="h-full">
                <div className="p-4 space-y-4">
                  {chatHistory.length === 0 ? (
                    <div className="text-center text-muted-foreground py-8">
                      Hãy đặt câu hỏi đầu tiên để bắt đầu cuộc trò chuyện.
                    </div>
                  ) : (
                    chatHistory.map((msg, idx) => (
                      <div
                        key={idx}
                        className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                            msg.role === "user"
                              ? "bg-primary text-primary-foreground rounded-br-none"
                              : "bg-muted rounded-bl-none prose prose-sm md:prose-base"
                          }`}
                        >
                          {msg.role === "user" ? (
                            msg.content
                          ) : (
                            <ReactMarkdown>{msg.content}</ReactMarkdown>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                  {isChatting && (
                    <div className="flex justify-start">
                      <div className="bg-muted rounded-2xl rounded-bl-none px-4 py-2">
                        <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                      </div>
                    </div>
                  )}
                  <div ref={scrollRef} />
                </div>
              </ScrollArea>
            </div>
            <form
              onSubmit={sendChatMessage}
              className="p-4 border-t shrink-0 flex gap-2 bg-white"
            >
              <Input
                placeholder="Nhập câu hỏi của bạn..."
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                disabled={isChatting}
              />
              <Button
                type="submit"
                disabled={isChatting || !chatMessage.trim()}
              >
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
