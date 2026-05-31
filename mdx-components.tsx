import type { MDXComponents } from "mdx/types"
import { Callout, StatusBadge } from "@/components/developers/mdx-primitives"

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    Callout,
    StatusBadge,
    ...components
  }
}
