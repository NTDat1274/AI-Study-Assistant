export default function PublicFooter() {
  return (
    <footer className="border-t bg-muted/40 py-8">
      <div className="container mx-auto max-w-6xl px-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-center md:text-left">
          <p className="text-sm font-semibold text-primary">AI Study Assistant</p>
          <p className="text-sm text-muted-foreground mt-1">Đồ án môn học • Sinh viên Nguyễn Tiến Đạt (2212353)</p>
        </div>
        <div className="flex items-center gap-4">
          <a href="#" className="text-sm text-muted-foreground hover:text-primary">Github</a>
          <a href="/about" className="text-sm text-muted-foreground hover:text-primary">Liên hệ</a>
        </div>
      </div>
    </footer>
  )
}
