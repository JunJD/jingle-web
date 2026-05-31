import Image from "next/image"

interface BrandMarkProps {
  className?: string
  variant?: "full" | "flat" | "mono"
  priority?: boolean
  size?: number
}

export function BrandMark({ className, priority = false, size = 36, variant = "full" }: BrandMarkProps) {
  const src =
    variant === "flat"
      ? "/brand/jingle-mark-flat.svg"
      : variant === "mono"
        ? "/brand/jingle-mark-monochrome.svg"
        : "/brand/jingle-mark.svg"

  return (
    <Image
      src={src}
      alt=""
      aria-hidden="true"
      width={size}
      height={size}
      priority={priority}
      unoptimized
      className={className}
    />
  )
}
