# @pos-crm/ui

Переиспользуемая библиотека UI компонентов для POS CRM системы, построенная на shadcn/ui и TailwindCSS.

## Установка

```bash
npm install @pos-crm/ui
```

## Настройка

### 1. TailwindCSS конфигурация

Добавьте в ваш `tailwind.config.js`:

```javascript
module.exports = {
  content: [
    // ... ваши пути
    "./node_modules/@pos-crm/ui/dist/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
```

### 2. CSS переменные

Добавьте в ваш CSS файл:

```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --card: 0 0% 100%;
  --card-foreground: 222.2 84% 4.9%;
  --popover: 0 0% 100%;
  --popover-foreground: 222.2 84% 4.9%;
  --primary: 222.2 47.4% 11.2%;
  --primary-foreground: 210 40% 98%;
  --secondary: 210 40% 96%;
  --secondary-foreground: 222.2 84% 4.9%;
  --muted: 210 40% 96%;
  --muted-foreground: 215.4 16.3% 46.9%;
  --accent: 210 40% 96%;
  --accent-foreground: 222.2 84% 4.9%;
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 210 40% 98%;
  --border: 214.3 31.8% 91.4%;
  --input: 214.3 31.8% 91.4%;
  --ring: 222.2 84% 4.9%;
  --radius: 0.5rem;
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  --card: 222.2 84% 4.9%;
  --card-foreground: 210 40% 98%;
  --popover: 222.2 84% 4.9%;
  --popover-foreground: 210 40% 98%;
  --primary: 210 40% 98%;
  --primary-foreground: 222.2 47.4% 11.2%;
  --secondary: 217.2 32.6% 17.5%;
  --secondary-foreground: 210 40% 98%;
  --muted: 217.2 32.6% 17.5%;
  --muted-foreground: 215 20.2% 65.1%;
  --accent: 217.2 32.6% 17.5%;
  --accent-foreground: 210 40% 98%;
  --destructive: 0 62.8% 30.6%;
  --destructive-foreground: 210 40% 98%;
  --border: 217.2 32.6% 17.5%;
  --input: 217.2 32.6% 17.5%;
  --ring: 212.7 26.8% 83.9%;
}
```

## Компоненты

### Button

```tsx
import { Button } from '@pos-crm/ui'

<Button variant="default" size="default">
  Click me
</Button>

<Button variant="destructive" loading>
  Loading...
</Button>

<Button variant="outline" icon={<Icon />}>
  With Icon
</Button>
```

**Варианты:**
- `variant`: `default` | `destructive` | `outline` | `secondary` | `ghost` | `link`
- `size`: `default` | `sm` | `lg` | `icon`

### Input

```tsx
import { Input } from '@pos-crm/ui'

<Input 
  label="Email"
  placeholder="Введите email"
  error="Поле обязательно"
/>

<Input 
  icon={<SearchIcon />}
  rightIcon={<ClearIcon />}
  variant="success"
/>
```

### Select

```tsx
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@pos-crm/ui'

<Select>
  <SelectTrigger>
    <SelectValue placeholder="Выберите опцию" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option1">Опция 1</SelectItem>
    <SelectItem value="option2">Опция 2</SelectItem>
  </SelectContent>
</Select>
```

### Card

```tsx
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent 
} from '@pos-crm/ui'

<Card>
  <CardHeader>
    <CardTitle>Заголовок</CardTitle>
  </CardHeader>
  <CardContent>
    Содержимое карточки
  </CardContent>
</Card>
```

### Table

```tsx
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@pos-crm/ui'

<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Название</TableHead>
      <TableHead>Цена</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>Товар 1</TableCell>
      <TableCell>100₽</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

### Form

```tsx
import { 
  Form, 
  FormField, 
  FormLabel, 
  FormActions 
} from '@pos-crm/ui'

<Form onSubmit={handleSubmit}>
  <FormField>
    <FormLabel required>Название</FormLabel>
    <Input />
  </FormField>
  <FormActions>
    <Button type="submit">Сохранить</Button>
  </FormActions>
</Form>
```

### Badge

```tsx
import { Badge } from '@pos-crm/ui'

<Badge variant="success">Активен</Badge>
<Badge variant="destructive" closable onClose={handleClose}>
  Ошибка
</Badge>
```

### Avatar

```tsx
import { Avatar } from '@pos-crm/ui'

<Avatar src="/avatar.jpg" alt="User" />
<Avatar fallback="ИИ" size="lg" />
```

### Checkbox

```tsx
import { Checkbox } from '@pos-crm/ui'

<Checkbox 
  label="Согласен с условиями"
  description="Обязательное поле"
/>
```

### Dialog

```tsx
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@pos-crm/ui'

<Dialog>
  <DialogTrigger asChild>
    <Button>Открыть</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Заголовок</DialogTitle>
    </DialogHeader>
    Содержимое диалога
  </DialogContent>
</Dialog>
```

### Tooltip

```tsx
import { Tooltip } from '@pos-crm/ui'

<Tooltip content="Подсказка" side="top">
  <Button>Hover me</Button>
</Tooltip>
```

## Кастомизация

Все компоненты поддерживают кастомизацию через prop `className` и CSS переменные. Используйте утилиту `cn` для правильного слияния классов:

```tsx
import { Button, cn } from '@pos-crm/ui'

<Button className={cn("custom-class", "another-class")}>
  Custom Button
</Button>
```

## Типы

Все компоненты экспортируют соответствующие TypeScript типы:

```tsx
import type { ButtonProps, InputProps, CardProps } from '@pos-crm/ui'
``` 