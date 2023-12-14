import { cn } from "$util/ui"
import type { ReactNode } from "react"

export default function FormGroup({
  className,
  children
}: {
  className?: string
  children: ReactNode
}) {
  return (
    <div className={cn("flex flex-col justify-center gap-2", className)}>
      {children}
    </div>
  )
}
