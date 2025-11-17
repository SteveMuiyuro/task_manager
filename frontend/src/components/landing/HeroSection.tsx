import { AppButton } from "../ui/AppButton"

const HeroSection = () => {
  return (
    <section id="hello" className="relative pt-32 pb-20 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 grid gap-12 md:grid-cols-2 items-center">
        
        {/* LEFT SIDE */}
        <div className="space-y-6 text-white">
          <h1 className="text-4xl sm:text-5xl font-semibold leading-tight">
            Organize Your Work Effortlessly
          </h1>

          <p className="text-lg text-white/80">
            TaskManager is a simplified task management tool intended to assist teams in 
            organizing, monitoring, and finishing their work effectively. Generate tasks, 
            designate responsibilities, establish deadlines, and maintain productivity.
          </p>

          {/* BUTTONS */}
          <div className="flex flex-col sm:flex-row gap-4">
            <AppButton 
              to="/register" 
              className="shadow-brand-600/40"
            >
              Get Started
            </AppButton>

            <AppButton 
              to="/login" 
              variant="ghost" 
              className="text-white/90 hover:text-white hover:bg-white/10 transition"
            >
              I have an account
            </AppButton>
          </div>

          {/* STATS */}
          <dl className="grid grid-cols-3 gap-4 pt-8 text-center">
            <div className="p-4 rounded-2xl bg-white/5 backdrop-blur">
              <dt className="text-3xl font-bold">5k+</dt>
              <dd className="text-xs uppercase tracking-wider text-white/70">
                Tasks tracked
              </dd>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 backdrop-blur">
              <dt className="text-3xl font-bold">50</dt>
              <dd className="text-xs uppercase tracking-wider text-white/70">
                Teams onboarded
              </dd>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 backdrop-blur">
              <dt className="text-3xl font-bold">24/7</dt>
              <dd className="text-xs uppercase tracking-wider text-white/70">
                Support
              </dd>
            </div>
          </dl>
        </div>

        {/* RIGHT SIDE */}
        <div className="relative" aria-hidden>
          <div className="absolute -top-10 -right-10 w-60 h-60 bg-brand-500/40 blur-[120px] rounded-full" />

          <div className="relative rounded-3xl bg-gradient-to-br from-brand-500 via-brand-600 to-brand-800 text-white p-8 shadow-2xl">
            
            {/* HEADER */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="text-white/70 text-sm">Tasks progress</p>
                <p className="text-4xl font-semibold">In Progress</p>
              </div>

              <span className="px-4 py-1 text-xs rounded-full bg-white/20">
                Assigned: 3
              </span>
            </div>

            {/* TASKS */}
            <div className="space-y-4">
              {[1, 2, 3].map((item) => (
                <div key={item} className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">Task {item}</p>
                    <p className="text-sm text-white/70">Due in {item * 2} days</p>
                  </div>

                  <div className="w-20 h-2 bg-white/20 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-white" 
                      style={{ width: `${item * 25}%` }} 
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* TOTAL PROGRESS */}
            <div className="mt-10 p-4 rounded-2xl bg-white/10">
              <p className="text-sm text-white/70">Total Progress</p>

              <div className="mt-2 h-2 rounded-full bg-white/20">
                <div 
                  className="h-full rounded-full bg-white" 
                  style={{ width: "64%" }} 
                />
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
