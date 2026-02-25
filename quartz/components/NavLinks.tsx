import { QuartzComponent, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"

interface ExternalLink {
  readonly label: string
  readonly url: string
}

const SITE_LINKS: readonly ExternalLink[] = [
  { label: "About", url: "/about" },
  { label: "CV", url: "/static/cv.pdf" },
  { label: "GitHub", url: "https://github.com/plyb" },
  { label: "LinkedIn", url: "https://linkedin.com/in/kobylewis" },
]

export const NavLinks: QuartzComponent = ({ displayClass }: QuartzComponentProps) => {
  return (
    <div className={classNames(displayClass, "nav-links")}>
      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        {SITE_LINKS.map((link) => (
          <li key={link.label}>
            <a href={link.url}>{link.label}</a>
          </li>
        ))}
      </ul>
    </div>
  )
}

NavLinks.css = `
.nav-links ul {
  font-family: var(--headerFont);
  font-weight: 600;
}
`

export default (() => NavLinks) satisfies QuartzComponent