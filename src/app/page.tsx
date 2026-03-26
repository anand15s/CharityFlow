'use client'

import Link from 'next/link'
import { ArrowRight, Shield, FileText, Users, MapPin, Calendar, BarChart3 } from 'lucide-react'

const features = [
  { icon: FileText, title: 'Money Tracking', plain: 'Not "General Ledger"', desc: 'Track every dollar in plain language. Auto-categorize transactions, connect your bank, generate reports — zero accounting knowledge needed.' },
  { icon: Shield, title: 'Annual Tax Report', plain: 'Not "Form 990"', desc: 'Automated Form 990 generation and one-click filing. We pick the right form version and fill it out for you.' },
  { icon: BarChart3, title: 'Tax Benefit Optimizer', plain: 'CPA-Grade Intelligence', desc: 'Protect your tax-exempt status, track unrelated business income, optimize expense ratios, and maximize donor tax benefits.' },
  { icon: MapPin, title: 'Compliance Co-Pilot', plain: 'Location-Aware', desc: 'Auto-detects your state/county/city regulations at signup. Personalized compliance roadmap with deadline tracking.' },
  { icon: Users, title: 'Donor Hub', plain: 'Not "CRM"', desc: 'Track donors, run campaigns, enable peer-to-peer fundraising, and auto-generate tax receipts in under 60 seconds.' },
  { icon: Calendar, title: 'Event Success Engine', plain: 'Local Intelligence', desc: 'Find venues, get vendor discounts, handle permits, and analyze event ROI — all powered by your location.' },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="border-b border-gray-100 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">CF</span>
            </div>
            <span className="font-bold text-xl text-brand-800">CharityFlow</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-gray-600 hover:text-brand-500 font-medium">Log In</Link>
            <Link href="/signup" className="btn-primary">Start Free Trial</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-6 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-block bg-brand-50 text-brand-500 px-4 py-1.5 rounded-full text-sm font-semibold mb-6">
            Built for people who don&apos;t know accounting
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-brand-800 leading-tight mb-6">
            The Operating System<br />for Small Nonprofits
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Replace 6+ disconnected tools with one platform. Manage finances, file taxes, 
            track donors, run events, and stay compliant — all in plain language.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup" className="btn-primary text-lg px-8 py-3 flex items-center gap-2 justify-center">
              Start Free Trial <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/demo" className="btn-secondary text-lg px-8 py-3">
              Watch Demo
            </Link>
          </div>
          <p className="text-sm text-gray-500 mt-4">No credit card required. Free for 30 days.</p>
        </div>
      </section>

      {/* Plain Language Translator */}
      <section className="px-6 py-16 bg-brand-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-brand-800 mb-4">We Speak Your Language</h2>
          <p className="text-gray-600 mb-8">Forget confusing accounting jargon. CharityFlow translates everything.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              ['Chart of Accounts', 'Money Categories'],
              ['Reconciliation', 'Match Your Bank'],
              ['Accounts Receivable', 'Money Coming In'],
              ['Restricted Funds', 'Money with Rules'],
              ['Form 990', 'Annual Tax Report'],
              ['Net Assets', 'What We Have Left'],
            ].map(([old, plain]) => (
              <div key={old} className="bg-white rounded-lg p-4 border border-gray-200">
                <p className="text-gray-400 line-through text-sm">{old}</p>
                <p className="text-brand-500 font-semibold text-lg">{plain}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-brand-800 mb-4">Everything Your Nonprofit Needs</h2>
            <p className="text-gray-600 text-lg">Six powerful engines. One simple platform.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((f) => (
              <div key={f.title} className="card hover:shadow-md transition-shadow">
                <f.icon className="w-10 h-10 text-brand-500 mb-4" />
                <h3 className="text-xl font-bold text-brand-800 mb-1">{f.title}</h3>
                <p className="text-sm text-brand-500 font-medium mb-3">{f.plain}</p>
                <p className="text-gray-600">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="px-6 py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-brand-800 mb-4">Simple, Transparent Pricing</h2>
          <p className="text-gray-600 mb-12">No hidden fees. No per-user charges. No accounting degree required.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'Starter', price: 79, desc: 'Under $500K budget', features: ['Transaction tracking', 'Form 990-N/EZ auto-filing', 'Basic compliance alerts', 'Up to 3 team members', 'Email support'] },
              { name: 'Growth', price: 149, desc: '$500K - $2M budget', features: ['Everything in Starter', 'Full Form 990 auto-filing', 'Donor CRM & campaigns', 'Event management', 'Up to 10 team members', 'Priority support'], popular: true },
              { name: 'Professional', price: 199, desc: '$2M - $5M budget', features: ['Everything in Growth', 'CPA tax optimization engine', 'Advanced compliance engine', 'Board governance tools', 'Unlimited team members', 'Dedicated success manager'] },
            ].map((plan) => (
              <div key={plan.name} className={`card relative ${plan.popular ? 'border-brand-500 border-2 shadow-lg' : ''}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    MOST POPULAR
                  </div>
                )}
                <h3 className="text-xl font-bold text-brand-800">{plan.name}</h3>
                <p className="text-sm text-gray-500 mb-4">{plan.desc}</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-brand-800">${plan.price}</span>
                  <span className="text-gray-500">/month</span>
                </div>
                <ul className="space-y-2 text-left mb-6">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-gray-600">
                      <span className="text-green-500 mt-0.5">&#10003;</span> {f}
                    </li>
                  ))}
                </ul>
                <Link href="/signup" className={plan.popular ? 'btn-primary w-full block text-center' : 'btn-secondary w-full block text-center'}>
                  Start Free Trial
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 bg-brand-800 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-400">&copy; 2026 CharityFlow. Simplifying nonprofit management.</p>
        </div>
      </footer>
    </div>
  )
}
