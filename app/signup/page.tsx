"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createSupabaseClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

export default function SignUpPage() {
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const supabase = createSupabaseClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      setLoading(false)
      return
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters")
      setLoading(false)
      return
    }

    if (!termsAccepted) {
      setError("Please accept the terms and conditions")
      setLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      })

      if (error) throw error

      router.push("/dashboard")
      router.refresh()
    } catch (error: any) {
      setError(error.message || "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-background-light dark:bg-background-dark">
      {/* Left Side: Visual Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-primary items-center justify-center p-12 overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <svg height="100%" width="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern
                height="40"
                id="grid"
                patternUnits="userSpaceOnUse"
                width="40"
              >
                <path
                  d="M 40 0 L 0 0 0 40"
                  fill="none"
                  stroke="white"
                  strokeWidth="1"
                ></path>
              </pattern>
            </defs>
            <rect fill="url(#grid)" height="100%" width="100%"></rect>
          </svg>
        </div>
        <div className="relative z-10 max-w-lg text-white">
          <div className="flex items-center gap-3 mb-12">
            <div className="size-10 bg-white text-primary rounded-lg flex items-center justify-center">
              <svg
                className="size-6"
                fill="none"
                viewBox="0 0 48 48"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6 6H42L36 24L42 42H6L12 24L6 6Z"
                  fill="currentColor"
                ></path>
              </svg>
            </div>
            <span className="text-2xl font-bold tracking-tight">TaskMaster</span>
          </div>
          <h1 className="text-5xl font-black leading-tight mb-6">
            Organize your life, one task at a time.
          </h1>
          <p className="text-lg text-white/80 mb-8">
            Join over 10,000+ professionals who use TaskMaster to streamline
            their workflow and hit their goals faster.
          </p>
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20">
              <span className="material-symbols-outlined mb-2">check_circle</span>
              <p className="font-semibold">Smart Scheduling</p>
              <p className="text-sm text-white/60">
                AI-powered task prioritization
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20">
              <span className="material-symbols-outlined mb-2">group</span>
              <p className="font-semibold">Team Sync</p>
              <p className="text-sm text-white/60">Real-time collaboration tools</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side: Sign Up Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 lg:p-24 bg-background-light dark:bg-background-dark">
        <div className="w-full max-w-[480px]">
          {/* Logo for mobile */}
          <div className="flex items-center gap-3 mb-10 lg:hidden">
            <div className="size-8 bg-primary text-white rounded-lg flex items-center justify-center">
              <svg
                className="size-5"
                fill="none"
                viewBox="0 0 48 48"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6 6H42L36 24L42 42H6L12 24L6 6Z"
                  fill="currentColor"
                ></path>
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight dark:text-white">
              TaskMaster
            </span>
          </div>

          <div className="mb-8">
            <h2 className="text-[#0d121b] dark:text-white text-3xl font-bold leading-tight mb-2">
              Create your account
            </h2>
            <p className="text-[#4c669a] dark:text-gray-400 text-base">
              Start your journey towards better productivity.
            </p>
          </div>

          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            {error && (
              <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* Full Name */}
            <div className="flex flex-col gap-2">
              <Label className="text-[#0d121b] dark:text-gray-200 text-sm font-medium leading-none">
                Full Name
              </Label>
              <Input
                className="flex w-full rounded-lg text-[#0d121b] dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#cfd7e7] dark:border-gray-700 bg-white dark:bg-gray-800 h-12 placeholder:text-[#4c669a] dark:placeholder:text-gray-500 px-4 text-sm font-normal"
                placeholder="e.g. John Doe"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>

            {/* Email Address */}
            <div className="flex flex-col gap-2">
              <Label className="text-[#0d121b] dark:text-gray-200 text-sm font-medium leading-none">
                Email Address
              </Label>
              <Input
                className="flex w-full rounded-lg text-[#0d121b] dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#cfd7e7] dark:border-gray-700 bg-white dark:bg-gray-800 h-12 placeholder:text-[#4c669a] dark:placeholder:text-gray-500 px-4 text-sm font-normal"
                placeholder="name@company.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-2">
              <Label className="text-[#0d121b] dark:text-gray-200 text-sm font-medium leading-none">
                Password
              </Label>
              <Input
                className="flex w-full rounded-lg text-[#0d121b] dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#cfd7e7] dark:border-gray-700 bg-white dark:bg-gray-800 h-12 placeholder:text-[#4c669a] dark:placeholder:text-gray-500 px-4 text-sm font-normal"
                placeholder="Min. 8 characters"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col gap-2">
              <Label className="text-[#0d121b] dark:text-gray-200 text-sm font-medium leading-none">
                Confirm Password
              </Label>
              <Input
                className="flex w-full rounded-lg text-[#0d121b] dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#cfd7e7] dark:border-gray-700 bg-white dark:bg-gray-800 h-12 placeholder:text-[#4c669a] dark:placeholder:text-gray-500 px-4 text-sm font-normal"
                placeholder="Repeat your password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            {/* Terms checkbox */}
            <div className="flex items-start gap-3 mt-1">
              <Checkbox
                id="terms"
                checked={termsAccepted}
                onCheckedChange={(checked) => setTermsAccepted(checked === true)}
                className="mt-1 h-4 w-4 rounded border-gray-300 dark:border-gray-700 text-primary focus:ring-primary"
              />
              <Label
                className="text-sm text-[#4c669a] dark:text-gray-400"
                htmlFor="terms"
              >
                I agree to the{" "}
                <a className="text-primary hover:underline" href="#">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a className="text-primary hover:underline" href="#">
                  Privacy Policy
                </a>
                .
              </Label>
            </div>

            {/* Create Account Button */}
            <Button
              type="submit"
              className="mt-2 flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 bg-primary text-white text-base font-bold transition-all hover:bg-primary/90 shadow-lg shadow-primary/20"
              disabled={loading}
            >
              <span className="truncate">
                {loading ? "Creating account..." : "Create Account"}
              </span>
            </Button>
          </form>

          <div className="mt-8 flex items-center gap-4">
            <div className="h-px flex-1 bg-[#cfd7e7] dark:bg-gray-700"></div>
            <span className="text-xs font-medium text-[#4c669a] dark:text-gray-500 uppercase tracking-wider">
              Or continue with
            </span>
            <div className="h-px flex-1 bg-[#cfd7e7] dark:bg-gray-700"></div>
          </div>

          <div className="mt-6 flex gap-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1 flex items-center justify-center gap-2 h-11 border border-[#cfd7e7] dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                ></path>
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                ></path>
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                  fill="#FBBC05"
                ></path>
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                ></path>
              </svg>
              <span className="text-sm font-semibold text-[#0d121b] dark:text-white">
                Google
              </span>
            </Button>
            <Button
              type="button"
              variant="outline"
              className="flex-1 flex items-center justify-center gap-2 h-11 border border-[#cfd7e7] dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z"></path>
              </svg>
              <span className="text-sm font-semibold text-[#0d121b] dark:text-white">
                GitHub
              </span>
            </Button>
          </div>

          {/* Footer link */}
          <p className="mt-10 text-center text-sm text-[#4c669a] dark:text-gray-400">
            Already have an account?{" "}
            <Link className="text-primary font-bold hover:underline" href="/login">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

