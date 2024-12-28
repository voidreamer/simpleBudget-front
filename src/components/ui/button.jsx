// components/ui/button.jsx
import * as React from "react"

const Button = React.forwardRef(({ 
  className = "",
  variant = "default",
  size = "default",
  type = "button",
  ...props 
}, ref) => {
  // Variant styles
  const variants = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
    outline: "border border-input hover:bg-accent hover:text-accent-foreground",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    ghost: "hover:bg-accent hover:text-accent-foreground",
    link: "underline-offset-4 hover:underline text-primary"
  }

  // Size styles
  const sizes = {
    default: "h-10 py-2 px-4",
    sm: "h-9 px-3 rounded-md",
    lg: "h-11 px-8 rounded-md",
    icon: "h-10 w-10"
  }

  return (
    <button
      type={type}
      className={`
        inline-flex items-center justify-center rounded-md text-sm font-medium
        ring-offset-background transition-colors focus-visible:outline-none 
        focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 
        disabled:pointer-events-none disabled:opacity-50
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
      ref={ref}
      {...props}
    />
  )
})
Button.displayName = "Button"

export { Button }