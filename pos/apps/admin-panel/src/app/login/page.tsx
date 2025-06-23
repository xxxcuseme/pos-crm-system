'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button, Input, Card, CardHeader, CardTitle, CardContent, Form, FormField, FormLabel, FormActions } from '@pos-crm/ui'
import { Eye, EyeOff, LogIn } from 'lucide-react'

interface LoginForm {
  username: string
  password: string
}

export default function LoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState<LoginForm>({
    username: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Ошибка входа')
      }

      // Сохраняем токен
      localStorage.setItem('accessToken', data.accessToken)
      localStorage.setItem('user', JSON.stringify(data.user))

      // Перенаправляем на главную страницу
      router.push('/')
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Произошла ошибка')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (field: keyof LoginForm) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }))
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-900">
              Вход в панель администратора
            </CardTitle>
            <p className="text-gray-600 mt-2">
              Введите ваши учетные данные для входа
            </p>
          </CardHeader>
          <CardContent>
            <Form onSubmit={handleSubmit}>
              <FormField error={error}>
                <FormLabel required>Email или логин</FormLabel>
                <Input
                  type="text"
                  placeholder="Введите email или логин"
                  value={formData.username}
                  onChange={handleChange('username')}
                  disabled={isLoading}
                  required
                />
              </FormField>

              <FormField>
                <FormLabel required>Пароль</FormLabel>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Введите пароль"
                  value={formData.password}
                  onChange={handleChange('password')}
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

              <FormActions className="flex-col space-y-4">
                <Button
                  type="submit"
                  loading={isLoading}
                  disabled={!formData.username || !formData.password}
                  className="w-full"
                  icon={<LogIn size={18} />}
                >
                  Войти
                </Button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => router.push('/register')}
                    className="text-blue-600 hover:text-blue-800 text-sm underline"
                  >
                    Нет аккаунта? Подать заявку на регистрацию
                  </button>
                </div>
              </FormActions>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 