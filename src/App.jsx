import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import FeaturedProjects from './components/FeaturedProjects'
import TechBlocks from './components/TechBlocks'
import Footer from './components/Footer'

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <FeaturedProjects />
        <TechBlocks />
      </main>
      <Footer />
    </>
  )
}
