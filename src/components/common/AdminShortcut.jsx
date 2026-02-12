import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

/**
 * AdminShortcut - Hidden keyboard shortcut to access admin panel
 * Press Ctrl+Shift+A (or Cmd+Shift+A on Mac) to navigate to /admin
 */
const AdminShortcut = () => {
    const navigate = useNavigate()

    useEffect(() => {
        const handleKeyPress = (e) => {
            // Ctrl+Shift+A or Cmd+Shift+A
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'A') {
                e.preventDefault()
                navigate('/admin')
            }
        }

        window.addEventListener('keydown', handleKeyPress)
        return () => window.removeEventListener('keydown', handleKeyPress)
    }, [navigate])

    return null // This component renders nothing
}

export default AdminShortcut
