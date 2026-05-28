interface LogoProps {
  className?: string
  alt?: string
}

/** Logo horizontal completa com fundo transparente. Usa WebP com fallback PNG e srcset 1x/2x. */
export function Logo({ className = 'h-10 w-auto', alt = 'Pilar' }: LogoProps) {
  return (
    <picture>
      <source
        type="image/webp"
        srcSet="/logo/pilar-logo-transparent-800px.webp 1x, /logo/pilar-logo-transparent-1600px.webp 2x"
      />
      <img
        src="/logo/pilar-logo-transparent-800px.png"
        srcSet="/logo/pilar-logo-transparent-800px.png 1x, /logo/pilar-logo-transparent-1600px.png 2x"
        alt={alt}
        className={className}
        draggable={false}
      />
    </picture>
  )
}

/** Ícone quadrado da logo (sem texto). Ideal para sidebars e avatares compactos. */
export function LogoIcon({ className = 'h-9 w-auto', alt = 'Pilar' }: LogoProps) {
  return (
    <img
      src="/logo/pilar-icon-transparent-256px.png"
      srcSet="/logo/pilar-icon-transparent-256px.png 1x, /logo/pilar-icon-transparent-512px.png 2x"
      alt={alt}
      className={className}
      draggable={false}
    />
  )
}
