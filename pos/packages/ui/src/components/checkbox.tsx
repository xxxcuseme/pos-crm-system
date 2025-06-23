import * as React from "react"
import { Check } from "lucide-react"
import { cn } from "../lib/utils"

export interface CheckboxProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  description?: string
  error?: string
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, description, error, ...props }, ref) => {
    const [checked, setChecked] = React.useState(props.checked || false)
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setChecked(e.target.checked)
      props.onChange?.(e)
    }

    return (
      <div className="space-y-2">
        <div className="flex items-start space-x-2">
          <div className="relative">
            <input
              type="checkbox"
              ref={ref}
              className="sr-only"
              {...props}
              checked={checked}
              onChange={handleChange}
            />
            <div
              className={cn(
                "peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                checked
                  ? "bg-primary text-primary-foreground"
                  : "bg-background",
                error && "border-destructive",
                className
              )}
              onClick={() => {
                if (!props.disabled) {
                  const newChecked = !checked
                  setChecked(newChecked)
                  const event = {
                    target: { checked: newChecked }
                  } as React.ChangeEvent<HTMLInputElement>
                  props.onChange?.(event)
                }
              }}
            >
              {checked && (
                <Check className="h-4 w-4 text-current" />
              )}
            </div>
          </div>
          {(label || description) && (
            <div className="grid gap-1.5 leading-none">
              {label && (
                <label
                  className={cn(
                    "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
                    error && "text-destructive"
                  )}
                >
                  {label}
                </label>
              )}
              {description && (
                <p className="text-sm text-muted-foreground">
                  {description}
                </p>
              )}
            </div>
          )}
        </div>
        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}
      </div>
    )
  }
)
Checkbox.displayName = "Checkbox"

export { Checkbox } 