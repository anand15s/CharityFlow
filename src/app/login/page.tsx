'use client'

import Link from 'next/link'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="card w-full max-w-md">
        <div className="flex items-center gap-2 mb-8 justify-center">
          <div className="w-10 h-10 bg-brand-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">CF</span>
          </div>
          <span className="font-bold text-2xl text-brand-800">CharityFlow</span>
        </div>
        <h1 className="text-xl font-bold text-center text-brand-800 mb-6">Welcome Back</h1>
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" className="input-field" placeholder="you@nonprofit.org" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input type="password" className="input-field" placeholder="Enter your password" />
          </div>
          <button type="submit" className="btn-primary w-full">Log In</button>
        </form>
        <p className="text-sm text-gray-500 text-center mt-4">
          Don&apos;t have an account? <Link href="/signup" className="text-brand-500 hover:underline">Start Free Trial</Link>
        </p>
      </div>
    </div>
  )
}
