import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function SignIn() {
  const [email, setEmail] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (email.trim()) {
      // Save user to sessionStorage
      const userData = { email: email.trim() }
      sessionStorage.setItem('user', JSON.stringify(userData))
      
      // Trigger a custom event so Navigation component knows to update
      window.dispatchEvent(new Event('userChanged'))
      
      // Navigate back to home
      navigate('/')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8" style={{ backgroundColor: '#FFFEC2' }}>
      <div className="w-full max-w-md space-y-8">
        <div>
          <div className="flex justify-center">
            <img
              alt="HKL Sons"
              src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=teal&shade=700"
              className="h-12 w-auto"
            />
          </div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter any email to continue (demo)
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="relative block w-full rounded-md border-0 px-3 py-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:outline-none sm:text-sm sm:leading-6"
                style={{ backgroundColor: 'white' }}
                placeholder="Email address"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative flex w-full justify-center rounded-md px-3 py-3 text-sm font-semibold text-white transition-all duration-200 hover:shadow-lg"
              style={{ backgroundColor: '#3D8D7A' }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#2d6b5d'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#3D8D7A'}
            >
              Sign in
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="font-medium transition-colors"
                style={{ color: '#3D8D7A' }}
                onMouseEnter={(e) => e.target.style.color = '#2d6b5d'}
                onMouseLeave={(e) => e.target.style.color = '#3D8D7A'}
              >
                ← Back to home
              </button>
            </div>
            <div className="text-sm">
              <a
                href="#"
                className="font-medium transition-colors"
                style={{ color: '#3D8D7A' }}
                onMouseEnter={(e) => e.target.style.color = '#2d6b5d'}
                onMouseLeave={(e) => e.target.style.color = '#3D8D7A'}
              >
                Create account
              </a>
            </div>
          </div>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 text-gray-500" style={{ backgroundColor: '#FFFEC2' }}>
                  Demo Mode
                </span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <p className="text-xs text-gray-600">
                This is a demo. Enter any email to sign in.
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}