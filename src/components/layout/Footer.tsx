import { site } from '../../content/site'

export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="container-page flex flex-col gap-3 py-8 text-sm text-faint sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {new Date().getFullYear()} {site.name}
        </p>
        <p className="font-mono text-xs">Built with React, TypeScript and Vite · Hosted on GitHub Pages</p>
      </div>
    </footer>
  )
}
