import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router'
import { loginUser } from '../store/slices/authslice'
import { useEffect, useState } from 'react'
import RegisterPage from './RegisterPage'

const loginSchema = z.object({
  emailId: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

function LoginPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const { isAuthenticated, loading, error } = useSelector((state) => state.auth)

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema),
  })

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard')
  }, [isAuthenticated, navigate])

  const onSubmit = (data) => {
    console.log('Form Data:', data)
    dispatch(loginUser(data))
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-lg bg-gray-900 border border-gray-800 rounded-2xl p-10 shadow-xl">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Login</h1>
          <p className="text-gray-400 mt-1 text-sm">Welcome back</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Name</label>
            <input
              type="text"
              placeholder="John Doe"
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
            <input
              type="email"
              placeholder="john@example.com"
              className={`w-full bg-gray-800 border text-white rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition ${errors.emailId ? 'border-red-500' : 'border-gray-700'}`}
              {...register('emailId')}
            />
            {errors.emailId && <p className="text-red-400 text-xs mt-1">{errors.emailId.message}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
                className={`w-full bg-gray-800 border text-white rounded-xl px-4 py-3 pr-12 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition ${errors.password ? 'border-red-500' : 'border-gray-700'}`}
                {...register('password')}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition text-xs"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
          </div>

          {/* API Error */}
          {error && (
            <div className="bg-red-950 border border-red-800 text-red-300 text-sm rounded-xl px-4 py-3">
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold rounded-xl py-3 transition"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>

        </form>

        <p className="mt-6 text-center text-sm text-gray-400">
          Don't have an account?{' '}
          <a href="/register" className="text-blue-400 hover:text-blue-300 font-medium">
            Register
          </a>
        </p>

      </div>
    </div>
  )
}

export default LoginPage
