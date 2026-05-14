import AdminOverviewClient from './AdminOverviewClient'
import { getAdminOverviewStats } from '@/actions/admin'

export default async function AdminDashboardPage() {
  let usersCount = 0
  let docsCount = 0
  let quizCount = 0
  let logsCount = 0
  let logs: Array<{ action_type: string; created_at: string }> = []
  let errorMessage: string | null = null

  try {
    const result = await getAdminOverviewStats()
    usersCount = result.usersCount
    docsCount = result.docsCount
    quizCount = result.quizCount
    logsCount = result.logsCount
    logs = result.logs
  } catch (error: unknown) {
    errorMessage = error instanceof Error ? error.message : 'Lỗi không xác định'
  }

  if (errorMessage) {
    return <div className="p-8 text-red-500">Lỗi khi tải dữ liệu tổng quan: {errorMessage}</div>
  }

  // Process data for Bar Chart (7 days)
  const last7Days = Array.from({length: 7}, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - i)
    return d.toISOString().split('T')[0]
  }).reverse()

  const chartData = last7Days.map(date => {
    const count = logs.filter(log => log.created_at.startsWith(date)).length || 0
    const [, m, d] = date.split('-')
    return { date: `${d}/${m}`, requests: count }
  })

  // Process data for Pie Chart
  const pieMap: Record<string, number> = {}
  logs.forEach(log => {
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
        users: usersCount,
        documents: docsCount,
        quizzes: quizCount,
        apiLogs: logsCount
      }}
      chartData={chartData}
      pieData={pieData.length > 0 ? pieData : [{name: 'Chưa có dữ liệu', value: 1}]}
    />
  )
}
