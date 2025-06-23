'use client'

import { useState, useEffect } from 'react'
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Button,
  Badge,
  Avatar,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@pos-crm/ui'
import { CheckCircle, XCircle, Eye, Clock, User, Mail, Phone } from 'lucide-react'

interface UserApplication {
  id: string
  email: string
  username: string
  firstName: string
  lastName: string
  phone?: string
  avatar?: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  createdAt: string
}

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<UserApplication[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedUser, setSelectedUser] = useState<UserApplication | null>(null)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  useEffect(() => {
    fetchApplications()
  }, [])

  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem('accessToken')
      const response = await fetch('http://localhost:3001/api/users?status=PENDING', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error('Ошибка загрузки заявок')
      }

      const data = await response.json()
      setApplications(data.data || [])
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Произошла ошибка')
    } finally {
      setIsLoading(false)
    }
  }

  const handleApprove = async (userId: string) => {
    setActionLoading(userId)
    try {
      const token = localStorage.getItem('accessToken')
      const response = await fetch(`http://localhost:3001/api/auth/approve/${userId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error('Ошибка подтверждения пользователя')
      }

      // Обновляем список заявок
      setApplications(prev => prev.filter(app => app.id !== userId))
      setSelectedUser(null)
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Произошла ошибка')
    } finally {
      setActionLoading(null)
    }
  }

  const handleReject = async (userId: string) => {
    setActionLoading(userId)
    try {
      const token = localStorage.getItem('accessToken')
      const response = await fetch(`http://localhost:3001/api/auth/reject/${userId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error('Ошибка отклонения заявки')
      }

      // Обновляем список заявок
      setApplications(prev => prev.filter(app => app.id !== userId))
      setSelectedUser(null)
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Произошла ошибка')
    } finally {
      setActionLoading(null)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Заявки на регистрацию</h1>
        <p className="text-gray-600 mt-2">
          Управление заявками пользователей на регистрацию в системе
        </p>
      </div>

      {error ? (
        <Card>
          <CardContent className="text-center py-8">
            <div className="text-red-500 text-xl mb-2">⚠️</div>
            <p className="text-red-600">{error}</p>
            <Button 
              onClick={fetchApplications} 
              className="mt-4"
              variant="outline"
            >
              Попробовать снова
            </Button>
          </CardContent>
        </Card>
      ) : applications.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Clock className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Нет новых заявок
            </h3>
            <p className="text-gray-600">
              Все заявки на регистрацию обработаны
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Заявки на рассмотрении ({applications.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Пользователь</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Логин</TableHead>
                  <TableHead>Телефон</TableHead>
                  <TableHead>Дата подачи</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead>Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {applications.map((application) => (
                  <TableRow key={application.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar
                          src={application.avatar}
                          fallback={`${application.firstName.charAt(0)}${application.lastName.charAt(0)}`}
                          size="sm"
                        />
                        <div>
                          <div className="font-medium">
                            {application.firstName} {application.lastName}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{application.email}</TableCell>
                    <TableCell>{application.username}</TableCell>
                    <TableCell>{application.phone || '—'}</TableCell>
                    <TableCell>{formatDate(application.createdAt)}</TableCell>
                    <TableCell>
                      <Badge variant="warning">
                        <Clock className="h-3 w-3 mr-1" />
                        Ожидает
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              icon={<Eye className="h-4 w-4" />}
                              onClick={() => setSelectedUser(application)}
                            >
                              Просмотр
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Детали заявки</DialogTitle>
                            </DialogHeader>
                            {selectedUser && (
                              <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                  <Avatar
                                    src={selectedUser.avatar}
                                    fallback={`${selectedUser.firstName.charAt(0)}${selectedUser.lastName.charAt(0)}`}
                                    size="lg"
                                  />
                                  <div>
                                    <h3 className="text-xl font-semibold">
                                      {selectedUser.firstName} {selectedUser.lastName}
                                    </h3>
                                    <p className="text-gray-600">@{selectedUser.username}</p>
                                  </div>
                                </div>

                                <div className="grid grid-cols-1 gap-3">
                                  <div className="flex items-center gap-2">
                                    <Mail className="h-4 w-4 text-gray-500" />
                                    <span>{selectedUser.email}</span>
                                  </div>
                                  {selectedUser.phone && (
                                    <div className="flex items-center gap-2">
                                      <Phone className="h-4 w-4 text-gray-500" />
                                      <span>{selectedUser.phone}</span>
                                    </div>
                                  )}
                                  <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-gray-500" />
                                    <span>Подано: {formatDate(selectedUser.createdAt)}</span>
                                  </div>
                                </div>

                                <div className="flex gap-2 pt-4">
                                  <Button
                                    onClick={() => handleApprove(selectedUser.id)}
                                    loading={actionLoading === selectedUser.id}
                                    disabled={!!actionLoading}
                                    icon={<CheckCircle className="h-4 w-4" />}
                                    className="flex-1"
                                  >
                                    Подтвердить
                                  </Button>
                                  <Button
                                    onClick={() => handleReject(selectedUser.id)}
                                    loading={actionLoading === selectedUser.id}
                                    disabled={!!actionLoading}
                                    variant="destructive"
                                    icon={<XCircle className="h-4 w-4" />}
                                    className="flex-1"
                                  >
                                    Отклонить
                                  </Button>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>

                        <Button
                          onClick={() => handleApprove(application.id)}
                          loading={actionLoading === application.id}
                          disabled={!!actionLoading}
                          size="sm"
                          icon={<CheckCircle className="h-4 w-4" />}
                        >
                          Подтвердить
                        </Button>
                        <Button
                          onClick={() => handleReject(application.id)}
                          loading={actionLoading === application.id}
                          disabled={!!actionLoading}
                          variant="destructive"
                          size="sm"
                          icon={<XCircle className="h-4 w-4" />}
                        >
                          Отклонить
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 