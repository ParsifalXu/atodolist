"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createSupabaseClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const supabase = createSupabaseClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
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
    <div className="flex w-full min-h-screen bg-background-light dark:bg-background-dark">
      {/* Left Side: Visual Illustration & Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-mesh relative items-center justify-center overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://lh3.googleusercontent.com/aida-public/AB6AXuDkOQpC_1f3amjRqu-LDpoeOrMZo1Gm6msIQAZ-SXPddHnoBpo8OZ_P6sKuBesdRBoiu8gJ4tbhxAYV_8VKnuh1hPDio5ioZe9KInxWlj2HpLTYYEuxZ_6La4vOpnQ4ZXUCI7EWiNJjpOeWibHyw0H5QL4TRqZOpuIczM-z16xjp8A7heutJuawH8EiTGUUGm06vnKZa0-wzZ1sfdd9RJ9gf2KVeCaFsv3SEITrEKdjKBXEd-epu7MYZmzViJFksTCpr2Q7kKBDCVfr')] bg-cover"></div>
        <div className="z-10 p-12 text-white max-w-lg">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-white p-2 rounded-lg">
              <svg
                className="w-8 h-8 text-primary"
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
          <h1 className="text-5xl font-bold leading-tight mb-6">
            Master your day, one task at a time.
          </h1>
          <p className="text-xl text-white/80 leading-relaxed">
            Join thousands of professionals who organize their lives with our
            minimalist, powerful todo ecosystem.
          </p>
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white dark:bg-background-dark">
        <div className="w-full max-w-md">
          {/* Mobile Branding */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <svg
              className="w-6 h-6 text-primary"
              fill="none"
              viewBox="0 0 48 48"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6 6H42L36 24L42 42H6L12 24L6 6Z"
                fill="currentColor"
              ></path>
            </svg>
            <span className="text-xl font-bold dark:text-white">TaskMaster</span>
          </div>

          <div className="mb-10">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Welcome back
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              Please enter your details to continue.
            </p>
          </div>

          {/* Form */}
          <form className="space-y-5" onSubmit={handleSubmit}>
            {error && (
              <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* Email Field */}
            <div className="flex flex-col gap-2">
              <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Email Address
              </Label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  mail
                </span>
                <Input
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="name@company.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Password
                </Label>
                <a
                  className="text-sm font-medium text-primary hover:underline"
                  href="#"
                >
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  lock
                </span>
                <Input
                  className="w-full pl-10 pr-12 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="••••••••"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Sign In Button */}
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 px-4 rounded-lg transition-all transform active:scale-[0.98] shadow-lg shadow-primary/20"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-background-dark text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>

            {/* Social Logins */}
            <div className="grid grid-cols-2 gap-4">
              <Button
                type="button"
                variant="outline"
                className="flex items-center justify-center gap-2 py-2.5 px-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    d="M12 5.04c1.64 0 3.12.56 4.28 1.67l3.21-3.21C17.54 1.74 15 1 12 1 7.37 1 3.42 3.65 1.48 7.5l3.85 3C6.3 7.8 8.94 5.04 12 5.04z"
                    fill="#EA4335"
                  ></path>
                  <path
                    d="M23.52 12.23c0-.82-.07-1.61-.21-2.38H12v4.5h6.45c-.28 1.54-1.14 2.85-2.45 3.73l3.81 2.95c2.23-2.06 3.71-5.1 3.71-8.8z"
                    fill="#4285F4"
                  ></path>
                  <path
                    d="M12 23c3.04 0 5.59-1.01 7.45-2.73l-3.81-2.95c-1.03.69-2.35 1.1-3.64 1.1-3.06 0-5.7-2.24-6.67-5.25l-3.85 3C3.42 20.35 7.37 23 12 23z"
                    fill="#34A853"
                  ></path>
                  <path
                    d="M5.33 13.17c-.25-.75-.38-1.54-.38-2.37s.13-1.62.38-2.37l-3.85-3C.54 7.12 0 9.5 0 12s.54 4.88 1.48 6.5l3.85-3.33z"
                    fill="#FBBC05"
                  ></path>
                </svg>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Google
                </span>
              </Button>
              <Button
                type="button"
                variant="outline"
                className="flex items-center justify-center gap-2 py-2.5 px-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <svg className="w-5 h-5 dark:fill-white" viewBox="0 0 24 24">
                  <path d="M17.05 20.28c-.96.95-2.05 2.02-3.39 2.02-1.31 0-1.74-.82-3.32-.82-1.59 0-2.07.82-3.32.82-1.32 0-2.39-1.02-3.39-2.02C1.56 18.2 0 14.65 0 11.23c0-3.38 2.1-5.17 4.14-5.17 1.1 0 1.94.7 2.59.7.64 0 1.63-.77 2.92-.77 1.13 0 2.22.45 2.97 1.25-2.61 1.58-2.18 5.6.51 6.81-1.01 2.51-2.34 5.01-3.08 6.23zM12.03 5.34c.03-2.3-1.89-4.22-4.14-4.34-.23 2.51 2.13 4.49 4.14 4.34z"></path>
                </svg>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Apple
                </span>
              </Button>
            </div>
          </form>

          {/* Footer */}
          <p className="mt-10 text-center text-sm text-gray-600 dark:text-gray-400">
            Don't have an account?{" "}
            <Link
              className="font-bold text-primary hover:underline"
              href="/signup"
            >
              Sign up for free
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

