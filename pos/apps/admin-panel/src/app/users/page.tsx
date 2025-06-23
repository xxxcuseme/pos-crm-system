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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Checkbox
} from '@pos-crm/ui'
import { 
  Users, 
  Shield, 
  Mail, 
  Phone, 
  Calendar,
  Plus,
  Trash2,
  Settings
} from 'lucide-react'

interface Role {
  id: string
  name: string
  description?: string
  isSystem: boolean
}

interface User {
  id: string
  email: string
  username: string
  firstName: string
  lastName: string
  phone?: string
  avatar?: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED'
  isActive: boolean
  createdAt: string
  lastLoginAt?: string
  roles: Role[]
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [roles, setRoles] = useState<Role[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  
  // Состояние для назначения ролей
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false)
  const [availableRoles, setAvailableRoles] = useState<Role[]>([])
  const [isAssigning, setIsAssigning] = useState(false)

  // Фильтры
  const [statusFilter, setStatusFilter] = useState<string>('all')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('accessToken')
      
      const [usersResponse, rolesResponse] = await Promise.all([
        fetch('http://localhost:3001/api/users', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('http://localhost:3001/api/roles', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ])

      if (!usersResponse.ok || !rolesResponse.ok) {
        throw new Error('Ошибка загрузки данных')
      }

      const usersData = await usersResponse.json()
      const rolesData = await rolesResponse.json()

      setUsers(usersData.data || [])
      setRoles(rolesData.data || [])
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Произошла ошибка')
    } finally {
      setIsLoading(false)
    }
  }

  const openRoleModal = (user: User) => {
    setSelectedUser(user)
    // Фильтруем роли, которые еще не назначены пользователю
    const userRoleIds = user.roles.map(role => role.id)
    setAvailableRoles(roles.filter(role => !userRoleIds.includes(role.id)))
    setIsRoleModalOpen(true)
  }

  const assignRole = async (roleId: string) => {
    if (!selectedUser) return

    setIsAssigning(true)
    try {
      const token = localStorage.getItem('accessToken')
      const response = await fetch(`http://localhost:3001/api/roles/${roleId}/users/${selectedUser.id}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Ошибка назначения роли')
      }

      await fetchData()
      setIsRoleModalOpen(false)
      setSelectedUser(null)
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Произошла ошибка')
    } finally {
      setIsAssigning(false)
    }
  }

  const removeRole = async (userId: string, roleId: string) => {
    if (!confirm('Удалить роль у пользователя?')) return

    try {
      const token = localStorage.getItem('accessToken')
      const response = await fetch(`http://localhost:3001/api/roles/${roleId}/users/${userId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Ошибка удаления роли')
      }

      await fetchData()
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Произошла ошибка')
    }
  }

  const getStatusBadge = (status: string, isActive: boolean) => {
    if (!isActive) {
      return <Badge variant="destructive">Неактивен</Badge>
    }
    
    switch (status) {
      case 'PENDING':
        return <Badge variant="warning">Ожидает</Badge>
      case 'APPROVED':
        return <Badge variant="success">Подтвержден</Badge>
      case 'REJECTED':
        return <Badge variant="destructive">Отклонен</Badge>
      case 'SUSPENDED':
        return <Badge variant="destructive">Заблокирован</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return '—'
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const filteredUsers = users.filter(user => {
    if (statusFilter === 'all') return true
    return user.status === statusFilter
  })

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
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Управление пользователями</h1>
            <p className="text-gray-600 mt-2">
              Список пользователей и назначение ролей
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Фильтр по статусу" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все пользователи</SelectItem>
                <SelectItem value="PENDING">Ожидают подтверждения</SelectItem>
                <SelectItem value="APPROVED">Подтвержденные</SelectItem>
                <SelectItem value="REJECTED">Отклоненные</SelectItem>
                <SelectItem value="SUSPENDED">Заблокированные</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {error ? (
        <Card>
          <CardContent className="text-center py-8">
            <div className="text-red-500 text-xl mb-2">⚠️</div>
            <p className="text-red-600">{error}</p>
            <Button onClick={fetchData} className="mt-4" variant="outline">
              Попробовать снова
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Пользователи ({filteredUsers.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Пользователь</TableHead>
                  <TableHead>Контакты</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead>Роли</TableHead>
                  <TableHead>Последний вход</TableHead>
                  <TableHead>Регистрация</TableHead>
                  <TableHead>Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar
                          src={user.avatar}
                          fallback={`${user.firstName.charAt(0)}${user.lastName.charAt(0)}`}
                          size="sm"
                        />
                        <div>
                          <div className="font-medium">
                            {user.firstName} {user.lastName}
                          </div>
                          <div className="text-sm text-gray-500">
                            @{user.username}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm">
                          <Mail className="h-3 w-3 text-gray-500" />
                          {user.email}
                        </div>
                        {user.phone && (
                          <div className="flex items-center gap-1 text-sm">
                            <Phone className="h-3 w-3 text-gray-500" />
                            {user.phone}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      {getStatusBadge(user.status, user.isActive)}
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {user.roles.map((role) => (
                          <div key={role.id} className="flex items-center gap-1">
                            <Badge 
                              variant={role.isSystem ? "secondary" : "outline"}
                              size="sm"
                            >
                              {role.isSystem && <Settings className="h-3 w-3 mr-1" />}
                              {role.name}
                            </Badge>
                            {!role.isSystem && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-6 w-6 p-0"
                                onClick={() => removeRole(user.id, role.id)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            )}
                          </div>
                        ))}
                        
                        <Button
                          variant="outline"
                          size="sm"
                          icon={<Plus className="h-3 w-3" />}
                          onClick={() => openRoleModal(user)}
                        >
                          Добавить
                        </Button>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <Calendar className="h-3 w-3 text-gray-500" />
                        {formatDate(user.lastLoginAt)}
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      {formatDate(user.createdAt)}
                    </TableCell>
                    
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        icon={<Shield className="h-4 w-4" />}
                        onClick={() => openRoleModal(user)}
                      >
                        Роли
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Модальное окно назначения ролей */}
      <Dialog open={isRoleModalOpen} onOpenChange={setIsRoleModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Назначение ролей</DialogTitle>
          </DialogHeader>
          
          {selectedUser && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 pb-4 border-b">
                <Avatar
                  src={selectedUser.avatar}
                  fallback={`${selectedUser.firstName.charAt(0)}${selectedUser.lastName.charAt(0)}`}
                  size="sm"
                />
                <div>
                  <div className="font-medium">
                    {selectedUser.firstName} {selectedUser.lastName}
                  </div>
                  <div className="text-sm text-gray-500">
                    @{selectedUser.username}
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3">Текущие роли:</h4>
                {selectedUser.roles.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {selectedUser.roles.map((role) => (
                      <Badge 
                        key={role.id}
                        variant={role.isSystem ? "secondary" : "outline"}
                      >
                        {role.isSystem && <Settings className="h-3 w-3 mr-1" />}
                        {role.name}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">Роли не назначены</p>
                )}
              </div>

              {availableRoles.length > 0 && (
                <div>
                  <h4 className="font-medium mb-3">Доступные роли:</h4>
                  <div className="space-y-2">
                    {availableRoles.map((role) => (
                      <div key={role.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="font-medium">{role.name}</div>
                          {role.description && (
                            <div className="text-sm text-gray-500">{role.description}</div>
                          )}
                        </div>
                        <Button
                          onClick={() => assignRole(role.id)}
                          loading={isAssigning}
                          size="sm"
                          icon={<Plus className="h-4 w-4" />}
                        >
                          Назначить
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {availableRoles.length === 0 && selectedUser.roles.length > 0 && (
                <p className="text-gray-500 text-sm text-center py-4">
                  Все доступные роли уже назначены пользователю
                </p>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
} 