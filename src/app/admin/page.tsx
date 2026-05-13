import { createClient } from '@/utils/supabase/server'
import AdminOverviewClient from './AdminOverviewClient'

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  // Fetch Stats
  const { count: usersCount } = await supabase.from('users').select('*', { count: 'exact', head: true })
  const { count: docsCount } = await supabase.from('documents').select('*', { count: 'exact', head: true })
  const { count: quizCount } = await supabase.from('quizzes').select('*', { count: 'exact', head: true })
  const { count: logsCount } = await supabase.from('api_logs').select('*', { count: 'exact', head: true })

  // Fetch AI Logs for charts
  const { data: logs } = await supabase.from('api_logs').select('action_type, created_at')

  // Process data for Bar Chart (7 days)
  const last7Days = Array.from({length: 7}, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - i)
    return d.toISOString().split('T')[0]
  }).reverse()

  const chartData = last7Days.map(date => {
    // Note: this is a simple string match for demo purposes
    const count = logs?.filter(log => log.created_at.startsWith(date)).length || 0
    // Format date MM/DD
    const [y, m, d] = date.split('-')
    return { date: `${d}/${m}`, requests: count }
  })

  // Process data for Pie Chart
  const pieMap: Record<string, number> = {}
  logs?.forEach(log => {
    let name = log.action_type
    if (name === 'summarize') name = 'Tóm tắt'
    if (name === 'quiz') name = 'Tạo Quiz'
    if (name === 'chat') name = 'Gia sư Chat'
    pieMap[name] = (pieMap[name] || 0) + 1
  })
  
  const pieData = Object.keys(pieMap).map(key => ({
    name: key,
    value: pieMap[key]
  }))

  return (
    <AdminOverviewClient 
      stats={{
        users: usersCount || 0,
        documents: docsCount || 0,
        quizzes: quizCount || 0,
        apiLogs: logsCount || 0
      }}
      chartData={chartData}
      pieData={pieData.length > 0 ? pieData : [{name: 'Chưa có dữ liệu', value: 1}]}
    />
  )
}
