import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router'
import { loginUser } from '../store/slices/authSlice'
import { useEffect, useState } from 'react'

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
    dispatch(loginUser(data))
  }

  return (
    <div className="min-h-screen flex bg-[#F7F5F0]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,300;0,500;0,600;1,400;1,500&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@500&display=swap');

        .em-serif { font-family: 'Fraunces', serif; }
        .em-sans { font-family: 'Inter', sans-serif; }
        .em-mono { font-family: 'JetBrains Mono', monospace; letter-spacing: 0.12em; }

        .em-grid {
          background-image:
            radial-gradient(circle at 1px 1px, rgba(247,245,240,0.09) 1px, transparent 0);
          background-size: 22px 22px;
        }

        @keyframes em-sweep {
          0%, 15% { width: 0%; }
          55%, 100% { width: 100%; }
        }
        @keyframes em-bubble-in {
          0%, 60% { opacity: 0; transform: translateY(6px) scale(0.97); }
          85%, 100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes em-dot {
          0%, 100% { opacity: 0.25; }
          50% { opacity: 1; }
        }
        @keyframes em-float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }

        .em-highlight {
          animation: em-sweep 3.2s ease-in-out infinite;
        }
        .em-bubble {
          animation: em-bubble-in 3.2s ease-in-out infinite;
        }
        .em-doc-card {
          animation: em-float 5s ease-in-out infinite;
        }
        .em-dot1 { animation: em-dot 1.1s ease-in-out infinite; }
        .em-dot2 { animation: em-dot 1.1s ease-in-out 0.15s infinite; }
        .em-dot3 { animation: em-dot 1.1s ease-in-out 0.3s infinite; }

        @media (prefers-reduced-motion: reduce) {
          .em-highlight, .em-bubble, .em-doc-card, .em-dot1, .em-dot2, .em-dot3 {
            animation: none !important;
          }
          .em-highlight { width: 100%; }
          .em-bubble { opacity: 1; transform: none; }
        }
      `}</style>

      {/* Brand panel */}
      <div className="hidden md:flex md:w-[44%] lg:w-[40%] relative flex-col justify-between bg-[#10131C] em-grid px-12 py-12 overflow-hidden">
        <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-[#5B6EF5] opacity-[0.15] blur-3xl" />
        <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full bg-[#F2A93B] opacity-[0.10] blur-3xl" />

        <div className="relative z-10">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#F2A93B]" />
            <span className="em-mono text-[11px] text-[#8A93A6] uppercase">EduMind AI</span>
          </div>
          <h1 className="em-serif italic text-[#F7F5F0] text-4xl mt-6 leading-tight">
            Ask your notes<br />anything.
          </h1>
        </div>

        {/* Signature: document highlight -> chat answer */}
        <div className="relative z-10 flex items-center gap-4 my-10">
          <div className="em-doc-card w-40 shrink-0 rounded-lg bg-[#F7F5F0] p-4 shadow-2xl">
            <div className="h-1.5 w-3/4 rounded bg-[#1B1F2B]/10 mb-2" />
            <div className="relative h-1.5 w-full rounded bg-[#1B1F2B]/10 mb-2 overflow-hidden">
              <span className="em-highlight absolute inset-y-0 left-0 bg-[#F2A93B] rounded" />
            </div>
            <div className="h-1.5 w-5/6 rounded bg-[#1B1F2B]/10 mb-2" />
            <div className="h-1.5 w-2/3 rounded bg-[#1B1F2B]/10" />
          </div>

          <svg width="28" height="12" viewBox="0 0 28 12" fill="none" className="text-[#8A93A6] shrink-0">
            <path d="M0 6h24M24 6l-5-5M24 6l-5 5" stroke="currentColor" strokeWidth="1.2" strokeDasharray="2 3" strokeLinecap="round" />
          </svg>

          <div className="em-bubble rounded-lg rounded-tl-none bg-[#1B1F2B] px-3.5 py-2.5 shadow-xl">
            <div className="flex gap-1">
              <span className="em-dot1 w-1.5 h-1.5 rounded-full bg-[#5B6EF5]" />
              <span className="em-dot2 w-1.5 h-1.5 rounded-full bg-[#5B6EF5]" />
              <span className="em-dot3 w-1.5 h-1.5 rounded-full bg-[#5B6EF5]" />
            </div>
          </div>
        </div>

        <p className="relative z-10 em-sans text-sm text-[#8A93A6] leading-relaxed">
          Upload a PDF or lecture recording, highlight what matters, and let your AI tutor answer from your own material.
        </p>
      </div>

      {/* Form panel */}
      <div className="flex-1 flex items-center justify-center px-5 py-8 sm:px-6 sm:py-12">
        <div className="w-full max-w-sm">
          <div className="flex items-center gap-2 mb-8 md:hidden">
            <span className="w-2 h-2 rounded-full bg-[#F2A93B]" />
            <span className="em-mono text-[11px] text-[#10131C] uppercase">EduMind AI</span>
          </div>
          <span className="em-mono text-[11px] text-[#8A93A6] uppercase">Sign in</span>
          <h2 className="em-serif text-[#10131C] text-[2rem] sm:text-3xl mt-2 mb-1">Welcome back</h2>
          <p className="em-sans text-sm text-[#8A93A6] mb-8">Pick up right where you left off.</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
            <div>
              <label htmlFor="emailId" className="em-sans block text-xs font-medium text-[#10131C] mb-1.5">
                Email
              </label>
              <input
                id="emailId"
                type="email"
                placeholder="you@university.edu"
                autoComplete="email"
                className={`em-sans w-full bg-white border rounded-lg px-3.5 py-2.5 text-sm text-[#10131C] placeholder:text-[#8A93A6] outline-none transition focus:ring-2 focus:ring-[#5B6EF5]/30 focus:border-[#5B6EF5] ${
                  errors.emailId ? 'border-red-400' : 'border-[#1B1F2B]/15'
                }`}
                {...register('emailId')}
              />
              {errors.emailId && (
                <p className="em-sans text-red-500 text-xs mt-1.5">{errors.emailId.message}</p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="em-sans block text-xs font-medium text-[#10131C]">
                  Password
                </label>
                <Link to="/forgot-password" className="em-sans text-xs text-[#5B6EF5] hover:text-[#4557d6]">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  className={`em-sans w-full bg-white border rounded-lg px-3.5 py-2.5 pr-16 text-sm text-[#10131C] placeholder:text-[#8A93A6] outline-none transition focus:ring-2 focus:ring-[#5B6EF5]/30 focus:border-[#5B6EF5] ${
                    errors.password ? 'border-red-400' : 'border-[#1B1F2B]/15'
                  }`}
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="em-sans absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8A93A6] hover:text-[#10131C] transition text-xs font-medium"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              {errors.password && (
                <p className="em-sans text-red-500 text-xs mt-1.5">{errors.password.message}</p>
              )}
            </div>

            {error && (
              <div className="em-sans bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-3.5 py-2.5">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="em-sans w-full bg-[#10131C] hover:bg-[#1B1F2B] disabled:opacity-50 text-[#F7F5F0] font-medium rounded-lg py-2.5 text-sm transition relative overflow-hidden group"
            >
              <span className="relative z-10">{loading ? 'Signing in…' : 'Sign in'}</span>
              <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-[#F2A93B] transition-all duration-300 group-hover:w-full" />
            </button>
          </form>

          <p className="em-sans mt-8 text-center text-sm text-[#8A93A6]">
            New to EduMind?{' '}
            <Link to="/register" className="text-[#10131C] font-medium hover:text-[#5B6EF5]">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
