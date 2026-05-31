import { ArrowRight } from "lucide-react"
import type { LucideIcon } from "lucide-react"

export interface AuthDiagramStep {
  description: string
  icon: LucideIcon
  title: string
}

export function AuthDiagram({ steps }: { steps: readonly AuthDiagramStep[] }) {
  return (
    <div className="grid gap-3 md:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr]">
      {steps.map((step, index) => {
        const Icon = step.icon
        return (
          <div key={step.title} className="contents">
            <div className="grouped-panel rounded-[22px] p-5">
              <span className="grid h-9 w-9 place-items-center rounded-2xl bg-[var(--soft)]">
                <Icon className="h-5 w-5 text-[color:var(--green)]" aria-hidden="true" />
              </span>
              <h3 className="mt-4 text-base font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">{step.description}</p>
            </div>
            {index < steps.length - 1 ? (
              <div className="hidden items-center justify-center text-[color:var(--muted)] md:flex">
                <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </div>
            ) : null}
          </div>
        )
      })}
    </div>
  )
}
