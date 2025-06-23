import * as React from "react"
import { cn } from "../lib/utils"

export interface FormFieldProps {
  children: React.ReactNode
  error?: string
  className?: string
}

const FormField = React.forwardRef<HTMLDivElement, FormFieldProps>(
  ({ children, error, className }, ref) => (
    <div ref={ref} className={cn("space-y-2", className)}>
      {children}
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  )
)
FormField.displayName = "FormField"

export interface FormLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean
}

const FormLabel = React.forwardRef<HTMLLabelElement, FormLabelProps>(
  ({ className, children, required, ...props }, ref) => (
    <label
      ref={ref}
      className={cn(
        "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        className
      )}
      {...props}
    >
      {children}
      {required && <span className="text-destructive ml-1">*</span>}
    </label>
  )
)
FormLabel.displayName = "FormLabel"

const FormDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
FormDescription.displayName = "FormDescription"

const FormMessage = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => {
  if (!children) return null
  
  return (
    <p
      ref={ref}
      className={cn("text-sm font-medium text-destructive", className)}
      {...props}
    >
      {children}
    </p>
  )
})
FormMessage.displayName = "FormMessage"

export interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void
}

const Form = React.forwardRef<HTMLFormElement, FormProps>(
  ({ className, onSubmit, ...props }, ref) => (
    <form
      ref={ref}
      className={cn("space-y-6", className)}
      onSubmit={onSubmit}
      {...props}
    />
  )
)
Form.displayName = "Form"

const FormGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("grid gap-4", className)}
    {...props}
  />
))
FormGroup.displayName = "FormGroup"

const FormRow = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("grid grid-cols-1 gap-4 md:grid-cols-2", className)}
    {...props}
  />
))
FormRow.displayName = "FormRow"

const FormActions = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center justify-end space-x-2", className)}
    {...props}
  />
))
FormActions.displayName = "FormActions"

export {
  Form,
  FormField,
  FormLabel,
  FormDescription,
  FormMessage,
  FormGroup,
  FormRow,
  FormActions,
} 