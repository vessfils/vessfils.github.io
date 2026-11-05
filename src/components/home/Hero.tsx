import { ArrowDown } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'
import { site } from '../../content/site'
import { GitHubIcon, LinkedInIcon } from '../ui/BrandIcons'
import { ButtonLink } from '../ui/Button'
import { HeroField } from './HeroField'

export function Hero() {
	const reduce = useReducedMotion()
	const rise = (delay: number) =>
		reduce
			? {}
			: { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.8, delay, ease: [0.2, 0.7, 0.2, 1] as const } }

	return (
		<section className="relative flex min-h-[100svh] items-end overflow-hidden pb-16 pt-32 sm:items-center sm:pb-24">
			<div className="absolute inset-0 grid-backdrop [mask-image:radial-gradient(ellipse_at_70%_40%,black,transparent_70%)]" aria-hidden />
			<HeroField />

			<div className="container-page relative">
				<motion.p {...rise(0)} className="eyebrow">
					{site.eyebrow}
				</motion.p>

				<motion.h1 {...rise(0.08)} className="mt-6 max-w-4xl text-[clamp(2.6rem,7.5vw,6rem)] font-medium leading-[0.98] tracking-[-0.045em]">
					{site.name}
				</motion.h1>

				<motion.p {...rise(0.16)} className="mt-5 text-xl tracking-tight text-muted sm:text-2xl">
					{site.role}
				</motion.p>

				<motion.div {...rise(0.24)} className="mt-8 max-w-xl space-y-3 text-base leading-relaxed text-muted">
					<p className="text-fg">{site.intro}</p>
					<p>{site.supporting}</p>
				</motion.div>

				<motion.div {...rise(0.32)} className="mt-10 flex flex-wrap items-center gap-3">
					<ButtonLink to="/#work">
						Explore my work <ArrowDown size={15} className="transition-transform group-hover:translate-y-0.5" />
					</ButtonLink>
					{site.resume && (
						<ButtonLink to={site.resume} variant="ghost" download>
							Download CV
						</ButtonLink>
					)}
					<div className="ml-1 flex items-center gap-4 text-sm">
						<a href={site.github} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-muted hover:text-fg">
							<GitHubIcon size={16} /> GitHub
						</a>
						<a href={site.linkedin} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-muted hover:text-fg">
							<LinkedInIcon size={16} /> LinkedIn
						</a>
					</div>
				</motion.div>
			</div>
		</section>
	)
}
