import { Outlet } from 'react-router-dom'
import { useState } from 'react'
import Sidebar from './components/layout/Sidebar'
import Navbar from './components/layout/Navbar'
import UserProfilePanel from './components/layout/UserProfilePanel'

const App = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false)

  return (
    <div className="min-h-screen flex bg-slate-100 ">
      <Sidebar onProfileClick={() => setIsProfileOpen(true)} />
      <div className="flex-1 flex flex-col relative">
        <Navbar />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
      <UserProfilePanel
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />
    </div>
  )
}

export default App
