import Link from 'next/link'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <header className="bg-gradient-to-br from-brand-mint to-brand-light">
        <nav className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-primary rounded-lg" />
            <span className="text-xl font-bold text-brand-dark">CharityFlow</span>
          </div>
          <div className="flex gap-4">
            <Link href="/login" className="px-4 py-2 text-brand-dark hover:text-brand-primary">
              Log In
            </Link>
            <Link href="/signup" className="px-6 py-2 bg-brand-primary text-white rounded-lg hover:bg-blue-600 transition">
              Start Free Trial
            </Link>
          </div>
        </nav>

        <div className="max-w-4xl mx-auto px-6 py-24 text-center">
          <h1 className="text-5xl font-bold text-brand-dark mb-6">
            The Operating System for <span className="text-brand-primary">Every Nonprofit</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Replace QuickBooks, spreadsheets, and 4 other tools with one platform built for people who don&apos;t know accounting. Zero jargon. Zero stress.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/signup" className="px-8 py-4 bg-brand-primary text-white text-lg rounded-xl hover:bg-blue-600 transition shadow-lg">
              Start Free — No Credit Card
            </Link>
            <Link href="/demo" className="px-8 py-4 border-2 border-brand-dark text-brand-dark text-lg rounded-xl hover:bg-gray-50 transition">
              Watch Demo
            </Link>
          </div>
          <p className="mt-6 text-sm text-gray-500">Trusted by 200+ nonprofits across 38 states</p>
        </div>
      </header>

      {/* Plain Language Section */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-center mb-4">We Speak Your Language, Not Accounting</h2>
        <p className="text-center text-gray-500 mb-12">Every confusing term, translated into plain English</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { old: 'Chart of Accounts', plain: 'Money Categories', icon: '📂' },
            { old: 'Reconciliation', plain: 'Match Your Bank', icon: '🏦' },
            { old: 'Restricted Funds', plain: 'Money with Rules', icon: '🔒' },
            { old: 'Accounts Receivable', plain: 'Money Coming In', icon: '💰' },
            { old: 'Accounts Payable', plain: 'Bills to Pay', icon: '📄' },
            { old: 'Form 990', plain: 'Annual Tax Report', icon: '📋' },
          ].map((item) => (
            <div key={item.old} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition">
              <span className="text-3xl">{item.icon}</span>
              <p className="mt-3 text-sm text-gray-400 line-through">{item.old}</p>
              <p className="text-lg font-semibold text-brand-primary">{item.plain}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">One Platform. Everything You Need.</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: 'Money Tracking', desc: 'Track every donation and expense with auto-categorization and bank feeds.', icon: '💳' },
              { title: 'Auto Tax Filing', desc: 'We pick the right Form 990, fill it out, and file it. You just click approve.', icon: '📋' },
              { title: 'CPA Tax Engine', desc: 'Protect your tax-exempt status with proactive alerts and optimization.', icon: '🛡️' },
              { title: 'Compliance Co-Pilot', desc: 'Local laws and deadlines personalized to your state, county, and city.', icon: '🗺️' },
              { title: 'Donor Hub', desc: 'Track donors, run campaigns, send tax receipts automatically.', icon: '❤️' },
              { title: 'Event Planner', desc: 'Find venues, get vendor discounts, track permits, and measure ROI.', icon: '🎪' },
              { title: 'Board Room', desc: 'Schedule meetings, record minutes, manage votes and documents.', icon: '📝' },
              { title: 'Smart Alerts', desc: 'Role-based notifications so everyone gets exactly what they need.', icon: '🔔' },
              { title: 'Audit Ready', desc: 'Immutable transaction logs and one-click audit packages.', icon: '🔐' },
            ].map((feat) => (
              <div key={feat.title} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition">
                <span className="text-2xl">{feat.icon}</span>
                <h3 className="text-lg font-semibold mt-3 mb-2">{feat.title}</h3>
                <p className="text-gray-600 text-sm">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="max-w-4xl mx-auto px-6 py-20 text-center">
        <h2 className="text-3xl font-bold mb-4">Simple, Transparent Pricing</h2>
        <p className="text-gray-500 mb-12">No hidden fees. No per-user charges. No accounting degree required.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { tier: 'Starter', price: '$79', desc: 'Under $500K budget', features: ['Money Tracking', 'Form 990-N/EZ', 'Compliance Basics', '3 Members'] },
            { tier: 'Growth', price: '$149', desc: '$500K-$2M budget', features: ['Everything in Starter', 'Full Form 990', 'Donor CRM', 'Event Planner', 'Unlimited Members'], popular: true },
            { tier: 'Pro', price: '$199', desc: '$2M-$5M budget', features: ['Everything in Growth', 'CPA Tax Engine', 'Board Room', 'Audit Packages', 'Priority Support'] },
          ].map((plan) => (
            <div key={plan.tier} className={`p-8 rounded-2xl border-2 ${plan.popular ? 'border-brand-primary bg-brand-light/30 scale-105' : 'border-gray-200'}`}>
              {plan.popular && <span className="text-xs font-semibold text-brand-primary uppercase tracking-wide">Most Popular</span>}
              <h3 className="text-2xl font-bold mt-2">{plan.tier}</h3>
              <p className="text-4xl font-bold my-3">{plan.price}<span className="text-sm font-normal text-gray-500">/mo</span></p>
              <p className="text-sm text-gray-500 mb-6">{plan.desc}</p>
              <ul className="text-left space-y-2">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <span className="text-green-500">✓</span> {f}
                  </li>
                ))}
              </ul>
              <Link href="/signup" className={`mt-6 block py-3 rounded-lg font-semibold ${plan.popular ? 'bg-brand-primary text-white' : 'bg-gray-100 text-brand-dark'}`}>
                Start Free Trial
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-brand-dark text-white py-12">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-xl font-bold mb-2">CharityFlow</p>
          <p className="text-gray-400">Simplifying nonprofit management and reporting</p>
          <p className="text-gray-500 mt-6 text-sm">© 2026 CharityFlow. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
