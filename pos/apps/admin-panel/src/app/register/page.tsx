'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button, Input, Card, CardHeader, CardTitle, CardContent, Form, FormField, FormLabel, FormActions, FormRow } from '@pos-crm/ui'
import { Eye, EyeOff, UserPlus, ArrowLeft } from 'lucide-react'

interface RegisterForm {
  email: string
  username: string
  password: string
  confirmPassword: string
  firstName: string
  lastName: string
  phone: string
}

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState<RegisterForm>({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Partial<RegisterForm>>({})
  const [success, setSuccess] = useState('')

  const validateForm = (): boolean => {
    const newErrors: Partial<RegisterForm> = {}

    if (!formData.email) newErrors.email = 'Email обязателен'
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Некорректный email'

    if (!formData.username) newErrors.username = 'Логин обязателен'
    else if (formData.username.length < 3) newErrors.username = 'Логин должен содержать минимум 3 символа'

    if (!formData.password) newErrors.password = 'Пароль обязателен'
    else if (formData.password.length < 8) newErrors.password = 'Пароль должен содержать минимум 8 символов'

    if (!formData.confirmPassword) newErrors.confirmPassword = 'Подтверждение пароля обязательно'
    else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Пароли не совпадают'

    if (!formData.firstName) newErrors.firstName = 'Имя обязательно'
    if (!formData.lastName) newErrors.lastName = 'Фамилия обязательна'

    if (formData.phone && !/^\+?[1-9]\d{1,14}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Некорректный номер телефона'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsLoading(true)
    setSuccess('')

    try {
      const { confirmPassword, ...registerData } = formData
      
      const response = await fetch('http://localhost:3001/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registerData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Ошибка регистрации')
      }

      setSuccess(data.message)
      
      // Перенаправляем на страницу входа через 3 секунды
      setTimeout(() => {
        router.push('/login')
      }, 3000)
    } catch (error) {
      setErrors({ email: error instanceof Error ? error.message : 'Произошла ошибка' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (field: keyof RegisterForm) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }))
    // Очищаем ошибку для конкретного поля
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md">
          <Card>
            <CardContent className="text-center py-8">
              <div className="text-green-600 text-6xl mb-4">✓</div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Заявка отправлена!
              </h2>
              <p className="text-gray-600 mb-4">{success}</p>
              <p className="text-sm text-gray-500">
                Перенаправление на страницу входа...
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
      <div className="w-full max-w-2xl">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-900">
              Заявка на регистрацию
            </CardTitle>
            <p className="text-gray-600 mt-2">
              Заполните форму для подачи заявки на регистрацию в системе
            </p>
          </CardHeader>
          <CardContent>
            <Form onSubmit={handleSubmit}>
              <FormRow>
                <FormField>
                  <FormLabel required>Имя</FormLabel>
                  <Input
                    type="text"
                    placeholder="Введите имя"
                    value={formData.firstName}
                    onChange={handleChange('firstName')}
                    error={errors.firstName}
                    disabled={isLoading}
                    required
                  />
                </FormField>

                <FormField>
                  <FormLabel required>Фамилия</FormLabel>
                  <Input
                    type="text"
                    placeholder="Введите фамилию"
                    value={formData.lastName}
                    onChange={handleChange('lastName')}
                    error={errors.lastName}
                    disabled={isLoading}
                    required
                  />
                </FormField>
              </FormRow>

              <FormRow>
                <FormField>
                  <FormLabel required>Email</FormLabel>
                  <Input
                    type="email"
                    placeholder="example@domain.com"
                    value={formData.email}
                    onChange={handleChange('email')}
                    error={errors.email}
                    disabled={isLoading}
                    required
                  />
                </FormField>

                <FormField>
                  <FormLabel required>Логин</FormLabel>
                  <Input
                    type="text"
                    placeholder="Логин для входа"
                    value={formData.username}
                    onChange={handleChange('username')}
                    error={errors.username}
                    disabled={isLoading}
                    required
                  />
                </FormField>
              </FormRow>

              <FormField>
                <FormLabel>Телефон</FormLabel>
                <Input
                  type="tel"
                  placeholder="+7 (999) 123-45-67"
                  value={formData.phone}
                  onChange={handleChange('phone')}
                  error={errors.phone}
                  disabled={isLoading}
                />
              </FormField>

              <FormRow>
                <FormField>
                  <FormLabel required>Пароль</FormLabel>
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Минимум 8 символов"
                    value={formData.password}
                    onChange={handleChange('password')}
                    error={errors.password}
                    disabled={isLoading}
                    required
                    rightIcon={
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    }
                  />
                </FormField>

                <FormField>
                  <FormLabel required>Подтверждение пароля</FormLabel>
                  <Input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Повторите пароль"
                    value={formData.confirmPassword}
                    onChange={handleChange('confirmPassword')}
                    error={errors.confirmPassword}
                    disabled={isLoading}
                    required
                    rightIcon={
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    }
                  />
                </FormField>
              </FormRow>

              <FormActions className="flex-col space-y-4">
                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push('/login')}
                    icon={<ArrowLeft size={18} />}
                    disabled={isLoading}
                  >
                    Назад к входу
                  </Button>
                  <Button
                    type="submit"
                    loading={isLoading}
                    disabled={!formData.email || !formData.username || !formData.password || !formData.firstName || !formData.lastName}
                    className="flex-1"
                    icon={<UserPlus size={18} />}
                  >
                    Подать заявку
                  </Button>
                </div>
              </FormActions>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 