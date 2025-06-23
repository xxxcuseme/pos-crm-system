'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent,
  Button,
  Badge,
  Avatar
} from '@pos-crm/ui'
import { 
  Users, 
  ShoppingCart, 
  DollarSign, 
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  Settings
} from 'lucide-react'

interface DashboardStats {
  totalUsers: number
  pendingApplications: number
  totalSales: number
  totalRevenue: number
}

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  avatar?: string
  status: string
}

export default function HomePage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    pendingApplications: 0,
    totalSales: 0,
    totalRevenue: 0
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('accessToken')
      const userData = localStorage.getItem('user')

      if (!token || !userData) {
        router.push('/login')
        return
      }

      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)

      // Загружаем статистику
      await fetchStats(token)
    } catch (error) {
      router.push('/login')
    } finally {
      setIsLoading(false)
    }
  }

  const fetchStats = async (token: string) => {
    try {
      // Здесь будут реальные API вызовы для получения статистики
      // Пока используем моковые данные
      setStats({
        totalUsers: 156,
        pendingApplications: 12,
        totalSales: 1248,
        totalRevenue: 125670
      })
    } catch (error) {
      console.error('Ошибка загрузки статистики:', error)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('user')
    router.push('/login')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-semibold text-gray-900">
                POS CRM Admin Panel
              </h1>
            </div>
            
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={() => router.push('/applications')}
                icon={<Clock className="h-4 w-4" />}
              >
                Заявки ({stats.pendingApplications})
              </Button>
              
              <div className="flex items-center gap-2">
                <Avatar
                  src={user.avatar}
                  fallback={`${user.firstName.charAt(0)}${user.lastName.charAt(0)}`}
                  size="sm"
                />
                <span className="text-sm font-medium">
                  {user.firstName} {user.lastName}
                </span>
              </div>

              <Button
                variant="outline"
                onClick={handleLogout}
              >
                Выйти
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            Добро пожаловать, {user.firstName}!
          </h2>
          <p className="text-gray-600 mt-2">
            Обзор системы и последние обновления
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Всего пользователей
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {stats.totalUsers}
                  </p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Заявки на рассмотрении
                  </p>
                  <p className="text-3xl font-bold text-orange-600">
                    {stats.pendingApplications}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Общее количество продаж
                  </p>
                  <p className="text-3xl font-bold text-green-600">
                    {stats.totalSales}
                  </p>
                </div>
                <ShoppingCart className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Общий доход
                  </p>
                  <p className="text-3xl font-bold text-purple-600">
                    ₽{stats.totalRevenue.toLocaleString()}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Быстрые действия</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={() => router.push('/applications')}
                className="w-full justify-start"
                variant="outline"
                icon={<Clock className="h-4 w-4" />}
              >
                Обработать заявки на регистрацию
                {stats.pendingApplications > 0 && (
                  <Badge variant="warning" className="ml-auto">
                    {stats.pendingApplications}
                  </Badge>
                )}
              </Button>

              <Button
                onClick={() => router.push('/users')}
                className="w-full justify-start"
                variant="outline"
                icon={<Users className="h-4 w-4" />}
              >
                Управление пользователями
              </Button>

              <Button
                onClick={() => router.push('/products')}
                className="w-full justify-start"
                variant="outline"
                icon={<ShoppingCart className="h-4 w-4" />}
              >
                Управление товарами
              </Button>

              <Button
                onClick={() => router.push('/settings')}
                className="w-full justify-start"
                variant="outline"
                icon={<Settings className="h-4 w-4" />}
              >
                Настройки системы
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Последние обновления</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Система аутентификации настроена</p>
                    <p className="text-xs text-gray-600">Настроен JWT и система ролей</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">UI компоненты готовы</p>
                    <p className="text-xs text-gray-600">Библиотека компонентов создана</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-orange-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">В разработке: продажи</p>
                    <p className="text-xs text-gray-600">Модуль продаж в процессе</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
} 