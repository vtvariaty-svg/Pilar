interface SectionHeaderProps {
  eyebrow?: string
  title: string
  subtitle?: string
  light?: boolean
  centered?: boolean
}

export default function SectionHeader({ eyebrow, title, subtitle, light = false, centered = false }: SectionHeaderProps) {
  const textBase = light ? 'text-brand-offwhite' : 'text-brand-dark'
  const textMuted = light ? 'text-brand-limestone' : 'text-neutral-500'
  const goldText = 'text-brand-gold'

  return (
    <div className={centered ? 'text-center' : ''}>
      {eyebrow && (
        <p className={`mb-4 text-xs font-semibold uppercase tracking-[0.2em] ${goldText}`}>
          {eyebrow}
        </p>
      )}
      <h2 className={`font-serif text-3xl font-bold leading-tight tracking-tight ${textBase} sm:text-4xl lg:text-5xl`}>
        {title}
      </h2>
      {subtitle && (
        <p className={`mt-5 max-w-2xl text-base leading-7 ${textMuted} ${centered ? 'mx-auto' : ''}`}>
          {subtitle}
        </p>
      )}
    </div>
  )
}
