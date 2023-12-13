import * as RadixAvatar from "@radix-ui/react-avatar"

export interface Props {
  h: string
  w: string
  src: string
  alt: string
  fb?: string
}

export default function Avatar({ h = "1rem", w = "1rem", src, alt, fb }: Props) {
  return (
    <RadixAvatar.Root
      className="inline-flex select-none items-center justify-center overflow-hidden rounded-full border border-gray-700 bg-sky-600 align-middle dark:border-gray-200 dark:bg-blue-600"
      style={{ width: w, height: h }}
    >
      <RadixAvatar.Image
        className="h-full w-full rounded-[inherit] object-cover"
        src={src}
        alt={alt}
      />
      <RadixAvatar.Fallback className="flex h-full w-full items-center justify-center font-medium uppercase leading-3 text-white">
        {fb || alt[0] || ""}
      </RadixAvatar.Fallback>
    </RadixAvatar.Root>
  )
}
