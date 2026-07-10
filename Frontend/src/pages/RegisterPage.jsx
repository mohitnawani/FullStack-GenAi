import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router'
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

        @keyframes em-node-pulse {
          0%, 100% { opacity: 0.35; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.15); }
        }
        @keyframes em-line-draw {
          0% { stroke-dashoffset: 40; opacity: 0.3; }
          50% { stroke-dashoffset: 0; opacity: 1; }
          100% { stroke-dashoffset: -40; opacity: 0.3; }
        }
        @keyframes em-float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }
        @keyframes em-card-in {
          0%, 55% { opacity: 0; transform: translateY(6px) scale(0.97); }
          80%, 100% { opacity: 1; transform: translateY(0) scale(1); }
        }

        .em-doc-card { animation: em-float 5s ease-in-out infinite; }
        .em-node1 { animation: em-node-pulse 2.4s ease-in-out infinite; }
        .em-node2 { animation: em-node-pulse 2.4s ease-in-out 0.4s infinite; }
        .em-node3 { animation: em-node-pulse 2.4s ease-in-out 0.8s infinite; }
        .em-link1 { animation: em-line-draw 2.4s ease-in-out infinite; stroke-dasharray: 4 4; }
        .em-link2 { animation: em-line-draw 2.4s ease-in-out 0.4s infinite; stroke-dasharray: 4 4; }
        .em-newcard { animation: em-card-in 3.4s ease-in-out infinite; }

        @media (prefers-reduced-motion: reduce) {
          .em-doc-card, .em-node1, .em-node2, .em-node3, .em-link1, .em-link2, .em-newcard {
            animation: none !important;
          }
          .em-newcard { opacity: 1; transform: none; }
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
            Your material,<br />turned into a tutor.
          </h1>
        </div>

        {/* Signature: material joins a growing knowledge graph */}
        <div className="relative z-10 flex items-center justify-center my-10">
          <div className="em-doc-card w-36 shrink-0 rounded-lg bg-[#F7F5F0] p-3.5 shadow-2xl mr-2">
            <div className="h-1.5 w-3/4 rounded bg-[#1B1F2B]/10 mb-2" />
            <div className="h-1.5 w-full rounded bg-[#1B1F2B]/10 mb-2" />
            <div className="h-1.5 w-5/6 rounded bg-[#1B1F2B]/10 mb-2" />
            <div className="h-1.5 w-2/3 rounded bg-[#1B1F2B]/10" />
          </div>

          <svg width="90" height="70" viewBox="0 0 90 70" fill="none" className="shrink-0">
            <line x1="4" y1="35" x2="42" y2="14" className="em-link1" stroke="#5B6EF5" strokeWidth="1.4" strokeLinecap="round" />
            <line x1="4" y1="35" x2="42" y2="56" className="em-link2" stroke="#F2A93B" strokeWidth="1.4" strokeLinecap="round" />
            <circle cx="4" cy="35" r="3.5" fill="#F7F5F0" />
            <circle className="em-node1" cx="45" cy="12" r="4.5" fill="#5B6EF5" />
            <circle className="em-node2" cx="45" cy="35" r="4.5" fill="#F2A93B" />
            <circle className="em-node3" cx="45" cy="58" r="4.5" fill="#5B6EF5" />
          </svg>

          <div className="em-newcard rounded-lg bg-[#1B1F2B] px-3.5 py-3 shadow-xl ml-1">
            <div className="em-mono text-[9px] text-[#F2A93B] uppercase mb-1.5">New profile</div>
            <div className="h-1.5 w-16 rounded bg-[#F7F5F0]/20 mb-1.5" />
            <div className="h-1.5 w-10 rounded bg-[#F7F5F0]/20" />
          </div>
        </div>

        <p className="relative z-10 em-sans text-sm text-[#8A93A6] leading-relaxed">
          Create your profile once, then upload every PDF, deck, and lecture recording you have — your tutor learns your material, not the internet's.
        </p>
      </div>

      {/* Form panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <span className="em-mono text-[11px] text-[#8A93A6] uppercase">Create account</span>
          <h2 className="em-serif text-[#10131C] text-3xl mt-2 mb-1">Get started</h2>
          <p className="em-sans text-sm text-[#8A93A6] mb-8">A few details and your tutor is ready.</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
            <div className="flex gap-4">
              <div className="flex-1">
                <label htmlFor="firstName" className="em-sans block text-xs font-medium text-[#10131C] mb-1.5">
                  First name
                </label>
                <input
                  id="firstName"
                  type="text"
                  placeholder="John"
                  autoComplete="given-name"
                  className={`em-sans w-full bg-white border rounded-lg px-3.5 py-2.5 text-sm text-[#10131C] placeholder:text-[#8A93A6] outline-none transition focus:ring-2 focus:ring-[#5B6EF5]/30 focus:border-[#5B6EF5] ${
                    errors.firstName ? 'border-red-400' : 'border-[#1B1F2B]/15'
                  }`}
                  {...register('firstName')}
                />
                {errors.firstName && (
                  <p className="em-sans text-red-500 text-xs mt-1.5">{errors.firstName.message}</p>
                )}
              </div>

              <div className="flex-1">
                <label htmlFor="lastName" className="em-sans block text-xs font-medium text-[#10131C] mb-1.5">
                  Last name <span className="text-[#8A93A6] font-normal">(optional)</span>
                </label>
                <input
                  id="lastName"
                  type="text"
                  placeholder="Doe"
                  autoComplete="family-name"
                  className="em-sans w-full bg-white border border-[#1B1F2B]/15 rounded-lg px-3.5 py-2.5 text-sm text-[#10131C] placeholder:text-[#8A93A6] outline-none transition focus:ring-2 focus:ring-[#5B6EF5]/30 focus:border-[#5B6EF5]"
                  {...register('lastName')}
                />
              </div>
            </div>

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
              <label htmlFor="password" className="em-sans block text-xs font-medium text-[#10131C] mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="At least 8 characters"
                  autoComplete="new-password"
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
              <span className="relative z-10">{loading ? 'Creating account…' : 'Create account'}</span>
              <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-[#F2A93B] transition-all duration-300 group-hover:w-full" />
            </button>
          </form>

          <p className="em-sans mt-8 text-center text-sm text-[#8A93A6]">
            Already have an account?{' '}
            <Link to="/login" className="text-[#10131C] font-medium hover:text-[#5B6EF5]">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage