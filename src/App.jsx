import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import AdminShortcut from './components/common/AdminShortcut'
import AbstractBackground from './components/common/AbstractBackground'

// Lazy load pages for better performance
const Landing = lazy(() => import('./pages/Landing'))
const About = lazy(() => import('./pages/About'))
const NCL = lazy(() => import('./pages/NCL'))
const Team = lazy(() => import('./pages/Team'))
const Achievements = lazy(() => import('./pages/Achievements'))
const Events = lazy(() => import('./pages/Events'))
const Register = lazy(() => import('./pages/Register'))
const Admin = lazy(() => import('./pages/Admin'))
const NotFound = lazy(() => import('./pages/NotFound'))

// Simple loading component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen bg-void-black">
    <div className="w-12 h-12 border-4 border-laser-blue border-t-transparent rounded-full animate-spin"></div>
  </div>
)

function App() {
  return (
    <Router>
      <AbstractBackground />
      <AdminShortcut />
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/about" element={<About />} />
          <Route path="/ncl" element={<NCL />} />
          <Route path="/team" element={<Team />} />
          <Route path="/achievements" element={<Achievements />} />
          <Route path="/events" element={<Events />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </Router>
  )
}

export default App
