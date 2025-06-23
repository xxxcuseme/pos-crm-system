import * as React from "react"
import { cn } from "../lib/utils"

export interface TooltipProps {
  children: React.ReactNode
  content: React.ReactNode
  side?: "top" | "right" | "bottom" | "left"
  align?: "start" | "center" | "end"
  className?: string
  contentClassName?: string
  disabled?: boolean
}

const Tooltip = React.forwardRef<HTMLDivElement, TooltipProps>(
  ({ children, content, side = "top", align = "center", className, contentClassName, disabled }, ref) => {
    const [isVisible, setIsVisible] = React.useState(false)
    const [position, setPosition] = React.useState({ x: 0, y: 0 })
    const triggerRef = React.useRef<HTMLDivElement>(null)
    const tooltipRef = React.useRef<HTMLDivElement>(null)

    const updatePosition = React.useCallback(() => {
      if (!triggerRef.current || !tooltipRef.current) return

      const triggerRect = triggerRef.current.getBoundingClientRect()
      const tooltipRect = tooltipRef.current.getBoundingClientRect()
      
      let x = 0
      let y = 0

      switch (side) {
        case "top":
          x = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2
          y = triggerRect.top - tooltipRect.height - 8
          break
        case "bottom":
          x = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2
          y = triggerRect.bottom + 8
          break
        case "left":
          x = triggerRect.left - tooltipRect.width - 8
          y = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2
          break
        case "right":
          x = triggerRect.right + 8
          y = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2
          break
      }

      setPosition({ x, y })
    }, [side])

    React.useEffect(() => {
      if (isVisible) {
        updatePosition()
        const handleResize = () => updatePosition()
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
      }
    }, [isVisible, updatePosition])

    if (disabled) {
      return <>{children}</>
    }

    return (
      <>
        <div
          ref={triggerRef}
          className={cn("inline-block", className)}
          onMouseEnter={() => setIsVisible(true)}
          onMouseLeave={() => setIsVisible(false)}
          onFocus={() => setIsVisible(true)}
          onBlur={() => setIsVisible(false)}
        >
          {children}
        </div>
        
        {isVisible && (
          <div
            ref={tooltipRef}
            className={cn(
              "fixed z-50 px-3 py-1.5 text-sm text-white bg-gray-900 rounded-md shadow-lg pointer-events-none",
              "animate-in fade-in-0 zoom-in-95 duration-200",
              contentClassName
            )}
            style={{
              left: position.x,
              top: position.y,
            }}
          >
            {content}
            <div
              className={cn(
                "absolute w-2 h-2 bg-gray-900 rotate-45",
                side === "top" && "bottom-[-4px] left-1/2 transform -translate-x-1/2",
                side === "bottom" && "top-[-4px] left-1/2 transform -translate-x-1/2",
                side === "left" && "right-[-4px] top-1/2 transform -translate-y-1/2",
                side === "right" && "left-[-4px] top-1/2 transform -translate-y-1/2"
              )}
            />
          </div>
        )}
      </>
    )
  }
)
Tooltip.displayName = "Tooltip"

export { Tooltip } 