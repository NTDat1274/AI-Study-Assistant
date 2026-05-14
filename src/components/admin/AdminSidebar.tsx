'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Users, FileText, BarChart3, HelpCircle, ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function AdminSidebar() {
  const pathname = usePathname()

  const links = [
    { name: 'Tổng quan', href: '/admin', icon: LayoutDashboard },
    { name: 'Người dùng', href: '/admin/users', icon: Users },
    { name: 'Tài liệu', href: '/admin/documents', icon: FileText },
    { name: 'Quản lý Quiz', href: '/admin/quizzes', icon: HelpCircle },
    { name: 'Thống kê AI Usage', href: '/admin/ai-usage', icon: BarChart3 },
  ]

  return (
    <aside className="w-64 border-r bg-white min-h-screen p-4 flex flex-col">
      <div className="flex items-center gap-2 mb-8 px-2">
        <div className="w-8 h-8 rounded bg-primary flex items-center justify-center text-white font-bold">A</div>
        <span className="text-xl font-bold text-slate-800">Admin Panel</span>
      </div>
      
      <nav className="space-y-2 flex-1">
        {links.map((link) => {
          const isActive = pathname === link.href || (pathname.startsWith(link.href) && link.href !== '/admin')
          return (
            <Link 
              key={link.href} 
              href={link.href} 
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-medium",
                isActive 
                  ? "bg-primary/10 text-primary" 
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              )}
            >
              <link.icon className={cn("w-5 h-5", isActive ? "text-primary" : "text-slate-400")} />
              {link.name}
            </Link>
          )
        })}
      </nav>

      <div className="pt-4 border-t mt-4">
        <Link 
          href="/dashboard" 
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900"
        >
          <ArrowLeft className="w-5 h-5 text-slate-400" />
          Về Dashboard User
        </Link>
      </div>
    </aside>
  )
}
