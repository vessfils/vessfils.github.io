import { Menu, Moon, Sun, X } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { site } from '../../content/site'
import { useTheme } from '../../lib/theme'

const links = [
	{ to: '/work', label: 'Work' },
	{ to: '/#about', label: 'About' },
	{ to: '/#experience', label: 'Experience' },
	{ to: '/#contact', label: 'Contact' },
]

/** Sticky top bar. Becomes opaque once the page scrolls; collapses into a sheet on small screens. */
export function Nav() {
	const { theme, toggle } = useTheme()
	const [scrolled, setScrolled] = useState(false)
	const [menuOpen, setMenuOpen] = useState(false)
	const location = useLocation()

	useEffect(() => {
		const onScroll = () => setScrolled(window.scrollY > 8)
		onScroll()
		window.addEventListener('scroll', onScroll, { passive: true })
		return () => window.removeEventListener('scroll', onScroll)
	}, [])

	// Close the mobile menu whenever the route or hash changes.
	useEffect(() => setMenuOpen(false), [location.pathname, location.hash])

	return (
		<header
			className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color] duration-300 ${scrolled || menuOpen ? 'border-b border-line bg-bg/80 backdrop-blur-md' : 'border-b border-transparent'
				}`}
		>
			<nav className="container-page flex h-16 items-center justify-between" aria-label="Main">
				<Link to="/" className="group flex items-center gap-2.5 text-sm font-medium tracking-tight">
					<Monogram />
					<span className="hidden sm:inline">{site.name}</span>
				</Link>

				<div className="flex items-center gap-1">
					<ul className="hidden items-center gap-1 md:flex">
						{links.map((link) => (
							<li key={link.to}>
								<NavItem to={link.to} label={link.label} />
							</li>
						))}
					</ul>

					{site.resume && (
						<a
							href={site.resume}
							download
							className="ml-2 hidden rounded-full border border-line-strong px-3.5 py-1.5 text-xs font-medium hover:border-fg/40 md:inline-flex"
						>
							CV
						</a>
					)}

					<button
						onClick={toggle}
						className="ml-1 grid size-10 place-items-center rounded-full text-muted transition-colors hover:bg-fg/[0.06] hover:text-fg"
						aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
					>
						{theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
					</button>

					<button
						onClick={() => setMenuOpen((open) => !open)}
						className="grid size-10 place-items-center rounded-full text-muted hover:text-fg md:hidden"
						aria-expanded={menuOpen}
						aria-controls="mobile-menu"
						aria-label={menuOpen ? 'Close menu' : 'Open menu'}
					>
						{menuOpen ? <X size={19} /> : <Menu size={19} />}
					</button>
				</div>
			</nav>

			<AnimatePresence>
				{menuOpen && (
					<motion.div
						id="mobile-menu"
						initial={{ height: 0, opacity: 0 }}
						animate={{ height: 'auto', opacity: 1 }}
						exit={{ height: 0, opacity: 0 }}
						transition={{ duration: 0.25 }}
						className="overflow-hidden md:hidden"
					>
						<ul className="container-page flex flex-col pb-6 pt-2">
							{links.map((link) => (
								<li key={link.to}>
									<Link to={link.to} className="block border-b border-line py-4 text-2xl tracking-tight">
										{link.label}
									</Link>
								</li>
							))}
						</ul>
					</motion.div>
				)}
			</AnimatePresence>
		</header>
	)
}

function NavItem({ to, label }: { to: string; label: string }) {
	const className = 'rounded-full px-3 py-1.5 text-sm text-muted transition-colors hover:text-fg'
	// Section anchors are plain links; /work gets an active state.
	if (to.includes('#')) {
		return (
			<Link to={to} className={className}>
				{label}
			</Link>
		)
	}
	return (
		<NavLink to={to} className={({ isActive }) => `${className} ${isActive ? 'text-fg' : ''}`}>
			{label}
		</NavLink>
	)
}

/** Initials mark — two letters in a rounded square, drawn in SVG so it stays sharp. */
function Monogram() {
	return (
		<svg width="28" height="28" viewBox="0 0 28 28" aria-hidden className="shrink-0">
			<rect x="0.5" y="0.5" width="27" height="27" rx="7" fill="none" stroke="currentColor" strokeOpacity="0.25" />
			<text x="14" y="18.5" textAnchor="middle" fontSize="11" fontWeight="600" fill="currentColor" fontFamily="var(--font-mono)">
				JF
			</text>
			<circle cx="22" cy="6" r="1.6" fill="var(--accent)" className="transition-transform duration-500 group-hover:translate-x-[-1px]" />
		</svg>
	)
}
