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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Form,
  FormField,
  FormLabel,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Checkbox
} from '@pos-crm/ui'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Shield, 
  Users, 
  Eye,
  Settings,
  Save,
  X
} from 'lucide-react'

interface Permission {
  id: string
  name: string
  category: string
  description: string
}

interface PermissionCategory {
  category: string
  permissions: Permission[]
}

interface Role {
  id: string
  name: string
  description?: string
  isSystem: boolean
  permissions: Permission[]
  usersCount: number
  createdAt: string
  updatedAt: string
}

interface RoleFormData {
  name: string
  description: string
  permissionIds: string[]
}

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>([])
  const [permissions, setPermissions] = useState<PermissionCategory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  
  // Состояние для создания/редактирования роли
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingRole, setEditingRole] = useState<Role | null>(null)
  const [formData, setFormData] = useState<RoleFormData>({
    name: '',
    description: '',
    permissionIds: []
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Состояние для просмотра роли
  const [viewingRole, setViewingRole] = useState<Role | null>(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('accessToken')
      
      const [rolesResponse, permissionsResponse] = await Promise.all([
        fetch('http://localhost:3001/api/roles', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('http://localhost:3001/api/permissions', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ])

      if (!rolesResponse.ok || !permissionsResponse.ok) {
        throw new Error('Ошибка загрузки данных')
      }

      const rolesData = await rolesResponse.json()
      const permissionsData = await permissionsResponse.json()

      setRoles(rolesData.data || [])
      setPermissions(permissionsData.data || [])
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Произошла ошибка')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateRole = async () => {
    setIsSubmitting(true)
    try {
      const token = localStorage.getItem('accessToken')
      const response = await fetch('http://localhost:3001/api/roles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Ошибка создания роли')
      }

      await fetchData()
      setIsCreateModalOpen(false)
      resetForm()
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Произошла ошибка')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUpdateRole = async () => {
    if (!editingRole) return

    setIsSubmitting(true)
    try {
      const token = localStorage.getItem('accessToken')
      const response = await fetch(`http://localhost:3001/api/roles/${editingRole.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Ошибка обновления роли')
      }

      await fetchData()
      setIsEditModalOpen(false)
      setEditingRole(null)
      resetForm()
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Произошла ошибка')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteRole = async (roleId: string) => {
    if (!confirm('Вы уверены, что хотите удалить эту роль?')) return

    try {
      const token = localStorage.getItem('accessToken')
      const response = await fetch(`http://localhost:3001/api/roles/${roleId}`, {
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

  const openCreateModal = () => {
    resetForm()
    setIsCreateModalOpen(true)
  }

  const openEditModal = (role: Role) => {
    setEditingRole(role)
    setFormData({
      name: role.name,
      description: role.description || '',
      permissionIds: role.permissions.map(p => p.id)
    })
    setIsEditModalOpen(true)
  }

  const openViewModal = (role: Role) => {
    setViewingRole(role)
    setIsViewModalOpen(true)
  }

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      permissionIds: []
    })
  }

  const handlePermissionToggle = (permissionId: string) => {
    setFormData(prev => ({
      ...prev,
      permissionIds: prev.permissionIds.includes(permissionId)
        ? prev.permissionIds.filter(id => id !== permissionId)
        : [...prev.permissionIds, permissionId]
    }))
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
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Управление ролями</h1>
            <p className="text-gray-600 mt-2">
              Создание и настройка ролей с правами доступа
            </p>
          </div>
          
          <Button 
            onClick={openCreateModal}
            icon={<Plus className="h-4 w-4" />}
          >
            Создать роль
          </Button>
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
              <Shield className="h-5 w-5" />
              Роли системы ({roles.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Название</TableHead>
                  <TableHead>Описание</TableHead>
                  <TableHead>Тип</TableHead>
                  <TableHead>Права</TableHead>
                  <TableHead>Пользователи</TableHead>
                  <TableHead>Создана</TableHead>
                  <TableHead>Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {roles.map((role) => (
                  <TableRow key={role.id}>
                    <TableCell className="font-medium">{role.name}</TableCell>
                    <TableCell>{role.description || '—'}</TableCell>
                    <TableCell>
                      {role.isSystem ? (
                        <Badge variant="secondary">
                          <Settings className="h-3 w-3 mr-1" />
                          Системная
                        </Badge>
                      ) : (
                        <Badge variant="outline">Пользовательская</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {role.permissions.length} прав
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4 text-gray-500" />
                        {role.usersCount}
                      </div>
                    </TableCell>
                    <TableCell>{formatDate(role.createdAt)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          icon={<Eye className="h-4 w-4" />}
                          onClick={() => openViewModal(role)}
                        >
                          Просмотр
                        </Button>
                        
                        {!role.isSystem && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              icon={<Edit className="h-4 w-4" />}
                              onClick={() => openEditModal(role)}
                            >
                              Изменить
                            </Button>
                            
                            <Button
                              variant="destructive"
                              size="sm"
                              icon={<Trash2 className="h-4 w-4" />}
                              onClick={() => handleDeleteRole(role.id)}
                              disabled={role.usersCount > 0}
                            >
                              Удалить
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Модальное окно создания роли */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Создание новой роли</DialogTitle>
          </DialogHeader>
          
          <Form onSubmit={handleCreateRole}>
            <FormField>
              <FormLabel required>Название роли</FormLabel>
              <Input
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Введите название роли"
                required
              />
            </FormField>

            <FormField>
              <FormLabel>Описание</FormLabel>
              <Input
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Описание роли (опционально)"
              />
            </FormField>

            <FormField>
              <FormLabel>Права доступа</FormLabel>
              <div className="space-y-4 max-h-64 overflow-y-auto border rounded-md p-4">
                {permissions.map((category) => (
                  <div key={category.category}>
                    <h4 className="font-medium text-sm text-gray-900 mb-2">
                      {category.category}
                    </h4>
                    <div className="space-y-2 ml-4">
                      {category.permissions.map((permission) => (
                        <Checkbox
                          key={permission.id}
                          checked={formData.permissionIds.includes(permission.id)}
                          onCheckedChange={() => handlePermissionToggle(permission.id)}
                          label={permission.description}
                          description={permission.name}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </FormField>

            <div className="flex gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCreateModalOpen(false)}
                icon={<X className="h-4 w-4" />}
              >
                Отмена
              </Button>
              <Button
                type="submit"
                loading={isSubmitting}
                disabled={!formData.name || formData.permissionIds.length === 0}
                icon={<Save className="h-4 w-4" />}
                className="flex-1"
              >
                Создать роль
              </Button>
            </div>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Модальное окно редактирования роли */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Редактирование роли</DialogTitle>
          </DialogHeader>
          
          <Form onSubmit={handleUpdateRole}>
            <FormField>
              <FormLabel required>Название роли</FormLabel>
              <Input
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Введите название роли"
                required
              />
            </FormField>

            <FormField>
              <FormLabel>Описание</FormLabel>
              <Input
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Описание роли (опционально)"
              />
            </FormField>

            <FormField>
              <FormLabel>Права доступа</FormLabel>
              <div className="space-y-4 max-h-64 overflow-y-auto border rounded-md p-4">
                {permissions.map((category) => (
                  <div key={category.category}>
                    <h4 className="font-medium text-sm text-gray-900 mb-2">
                      {category.category}
                    </h4>
                    <div className="space-y-2 ml-4">
                      {category.permissions.map((permission) => (
                        <Checkbox
                          key={permission.id}
                          checked={formData.permissionIds.includes(permission.id)}
                          onCheckedChange={() => handlePermissionToggle(permission.id)}
                          label={permission.description}
                          description={permission.name}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </FormField>

            <div className="flex gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditModalOpen(false)}
                icon={<X className="h-4 w-4" />}
              >
                Отмена
              </Button>
              <Button
                type="submit"
                loading={isSubmitting}
                disabled={!formData.name || formData.permissionIds.length === 0}
                icon={<Save className="h-4 w-4" />}
                className="flex-1"
              >
                Сохранить изменения
              </Button>
            </div>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Модальное окно просмотра роли */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Детали роли</DialogTitle>
          </DialogHeader>
          
          {viewingRole && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Название</label>
                  <p className="text-lg font-semibold">{viewingRole.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Тип</label>
                  <p>
                    {viewingRole.isSystem ? (
                      <Badge variant="secondary">
                        <Settings className="h-3 w-3 mr-1" />
                        Системная
                      </Badge>
                    ) : (
                      <Badge variant="outline">Пользовательская</Badge>
                    )}
                  </p>
                </div>
              </div>

              {viewingRole.description && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Описание</label>
                  <p className="text-gray-900">{viewingRole.description}</p>
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-gray-600 mb-2 block">
                  Права доступа ({viewingRole.permissions.length})
                </label>
                <div className="space-y-3 max-h-64 overflow-y-auto border rounded-md p-4">
                  {permissions.map((category) => {
                    const categoryPermissions = viewingRole.permissions.filter(
                      p => p.category === category.category
                    )
                    
                    if (categoryPermissions.length === 0) return null

                    return (
                      <div key={category.category}>
                        <h4 className="font-medium text-sm text-gray-900 mb-2">
                          {category.category}
                        </h4>
                        <div className="space-y-1 ml-4">
                          {categoryPermissions.map((permission) => (
                            <div key={permission.id} className="flex items-center gap-2">
                              <Badge variant="outline" size="sm">
                                {permission.description}
                              </Badge>
                              <span className="text-sm text-gray-500">
                                ({permission.name})
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <label className="text-sm font-medium text-gray-600">Пользователей</label>
                  <p className="text-lg font-semibold">{viewingRole.usersCount}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Создана</label>
                  <p>{formatDate(viewingRole.createdAt)}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
} 