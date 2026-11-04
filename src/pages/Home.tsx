import { About } from '../components/home/About'
import { Contact } from '../components/home/Contact'
import { Experience } from '../components/home/Experience'
import { Hero } from '../components/home/Hero'
import { SelectedWork } from '../components/home/SelectedWork'
import { Skills } from '../components/home/Skills'
import { site } from '../content/site'
import { usePageMeta } from '../lib/seo'

export function Home() {
  usePageMeta(null, `${site.intro} ${site.supporting}`)
  return (
    <>
      <Hero />
      <SelectedWork />
      <About />
      <Experience />
      <Skills />
      <Contact />
    </>
  )
}
