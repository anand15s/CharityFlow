'use client'

import Link from 'next/link'
import { MapPin } from 'lucide-react'

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="card w-full max-w-lg">
        <div className="flex items-center gap-2 mb-6 justify-center">
          <div className="w-10 h-10 bg-brand-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">CF</span>
          </div>
          <span className="font-bold text-2xl text-brand-800">CharityFlow</span>
        </div>
        <h1 className="text-xl font-bold text-center text-brand-800 mb-2">Start Your Free Trial</h1>
        <p className="text-sm text-gray-500 text-center mb-6">30 days free. No credit card required.</p>
        <form className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label><input type="text" className="input-field" placeholder="Jane Doe" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Email</label><input type="email" className="input-field" placeholder="you@nonprofit.org" /></div>
          </div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Organization Name</label><input type="text" className="input-field" placeholder="e.g. Helping Hands Foundation" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">State</label>
              <select className="input-field"><option>California</option><option>New York</option><option>Texas</option><option>Florida</option><option>Other</option></select>
            </div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">City</label><input type="text" className="input-field" placeholder="Los Angeles" /></div>
          </div>
          <div className="bg-brand-50 rounded-lg p-3 flex items-center gap-2 text-sm text-brand-600">
            <MapPin className="w-4 h-4" />
            We&apos;ll auto-detect your local compliance requirements based on your location.
          </div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Annual Budget</label>
            <select className="input-field"><option>Under $50K</option><option>$50K - $250K</option><option>$250K - $500K</option><option>$500K - $2M</option><option>$2M - $5M</option></select>
          </div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Password</label><input type="password" className="input-field" placeholder="Create a strong password" /></div>
          <button type="submit" className="btn-primary w-full">Create Free Account</button>
        </form>
        <p className="text-sm text-gray-500 text-center mt-4">
          Already have an account? <Link href="/login" className="text-brand-500 hover:underline">Log In</Link>
        </p>
      </div>
    </div>
  )
}
