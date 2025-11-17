import HeroSection from '../components/landing/HeroSection'
import LandingFooter from '../components/landing/LandingFooter'
import LandingNavbar from '../components/landing/LandingNavbar'

const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#050312] text-white">
      <LandingNavbar />
      <main className="flex-1">
        <div className="bg-gradient-to-br from-[#120d3c] via-[#1c1460] to-[#35238d]">
          <HeroSection />
        </div>
       
        <section className="py-20 bg-gradient-to-r from-brand-600 to-brand-500 text-white" id="productivity">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-6">
            <p className="text-sm uppercase tracking-[0.4em] text-white/80">Boost Productivity</p>
            <h2 className="text-3xl sm:text-4xl font-semibold">Bring every task, teams, and timelines together</h2>
            <p className="text-lg text-white/85">
              Organize messy tasks and keep every team member accountable.TaskManager provides the fexibility and task tracking ensuring seemless productivity and efficiency on delivery.
            </p>
          </div>
        </section>
      </main>
      <LandingFooter />
    </div>
  )
}

export default LandingPage
