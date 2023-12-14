import { cn } from "$util/ui"
import type { ComponentChild } from "preact"

export default function FormGroup({
  className,
  children
}: {
  className?: string
  children: ComponentChild
}) {
  return (
    <div class={cn("flex flex-col justify-center gap-2", className)}>{children}</div>
  )
}
