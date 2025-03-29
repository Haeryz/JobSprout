import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Link } from 'react-router-dom'
import NeonGlow from '@/components/custom/NeonGlow'
import { FaGoogle } from 'react-icons/fa'

const SignUp = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement actual sign up
    if (password !== confirmPassword) {
      alert('Passwords do not match')
      return
    }
    console.log('Sign up with:', email, password)
  }

  const handleGoogleSignUp = () => {
    // TODO: Implement Google sign up
    console.log('Google sign up')
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Product Name */}
        <div className="text-center mb-8">
          <h1 className="font-bold text-3xl bg-clip-text text-transparent bg-gradient-to-b from-[#4ADE80] to-[#22C55E]">
            JobSprout
          </h1>
        </div>

        {/* Auth Card */}
        <NeonGlow 
          color="green" 
          className="w-full rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800"
        >
          <div className="p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Create an account
            </h2>
            
            {/* Google Sign Up Button */}
            <Button 
              variant="outline"
              className="w-full mb-4 flex items-center justify-center gap-2"
              onClick={handleGoogleSignUp}
            >
              <FaGoogle className="h-4 w-4" />
              Sign up with Google
            </Button>
            
            {/* Divider */}
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                  or continue with email
                </span>
              </div>
            </div>
            
            {/* Sign Up Form */}
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    placeholder="your@email.com"
                    className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm 
                    placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 
                    dark:border-gray-600 dark:bg-gray-900 dark:placeholder:text-gray-500"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm 
                    placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 
                    dark:border-gray-600 dark:bg-gray-900 dark:placeholder:text-gray-500"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                
                <div>
                  <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                    Confirm Password
                  </label>
                  <input
                    id="confirm-password"
                    name="confirm-password"
                    type="password"
                    autoComplete="new-password"
                    required
                    className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm 
                    placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 
                    dark:border-gray-600 dark:bg-gray-900 dark:placeholder:text-gray-500"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
                
                <Button 
                  type="submit"
                  className="w-full bg-gradient-to-b from-[#4ADE80] to-[#22C55E] text-white 
                  hover:from-[#22C55E] hover:to-[#22C55E]
                  dark:shadow-[0_0_5px_1px_rgba(74,222,128,0.3)]
                  hover:dark:shadow-[0_0_15px_3px_rgba(74,222,128,0.4)]"
                >
                  Sign up
                </Button>
              </div>
            </form>
            
            {/* Sign In Link */}
            <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
              Already have an account?{' '}
              <Link 
                to="/auth/sign-in" 
                className="font-medium text-green-600 hover:text-green-500 dark:text-green-400"
              >
                Sign in
              </Link>
            </div>
          </div>
        </NeonGlow>
      </div>
    </div>
  )
}

export default SignUp