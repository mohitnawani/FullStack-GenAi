import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router'
import { registerUser } from '../store/slices/authSlice'
import { useEffect, useState } from 'react'

const registerSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().optional(),
  emailId: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

function RegisterPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const { isAuthenticated, loading, error } = useSelector((state) => state.auth)

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(registerSchema),
  })

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard')
  }, [isAuthenticated, navigate])

  const onSubmit = (data) => {
    dispatch(registerUser(data))
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-lg bg-gray-900 border border-gray-800 rounded-2xl p-10 shadow-xl">

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Register</h1>
          <p className="text-gray-400 mt-1 text-sm">Create a new account</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

          {/* First Name & Last Name */}
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-300 mb-1">First Name</label>
              <input
                type="text"
                placeholder="John"
                className={`w-full bg-gray-800 border text-white rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition ${errors.firstName ? 'border-red-500' : 'border-gray-700'}`}
                {...register('firstName')}
              />
              {errors.firstName && <p className="text-red-400 text-xs mt-1">{errors.firstName.message}</p>}
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-300 mb-1">Last Name <span className="text-gray-500">(optional)</span></label>
              <input
                type="text"
                placeholder="Doe"
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                {...register('lastName')}
              />
            </div>
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
                placeholder="••••••••"
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
            {loading ? 'Registering...' : 'Register'}
          </button>

        </form>

        <p className="mt-6 text-center text-sm text-gray-400">
          Already have an account?{' '}
          <a href="/login" className="text-blue-400 hover:text-blue-300 font-medium">
            Log in
          </a>
        </p>

      </div>
    </div>
  )
}

export default RegisterPage