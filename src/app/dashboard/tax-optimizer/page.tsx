'use client'

import { Shield, AlertTriangle, TrendingUp, CheckCircle, BarChart3 } from 'lucide-react'

const optimizations = [
  { title: 'Tax-Exempt Status', score: 95, status: 'safe', detail: 'No activities threatening your 501(c)(3) status detected.', icon: Shield },
  { title: 'UBIT Exposure', score: 0, status: 'safe', detail: 'No unrelated business income detected. You are clear.', icon: CheckCircle },
  { title: 'Program Efficiency Ratio', score: 72, status: 'warning', detail: 'Your ratio is 72%. Donors prefer 65%+, but Charity Navigator wants 75%+.', icon: BarChart3 },
  { title: 'Public Support Test', score: 45, status: 'danger', detail: 'Warning: You need 33% public support to maintain public charity status. Currently at 45%.', icon: AlertTriangle },
  { title: 'Donor Tax Benefits', score: 100, status: 'safe', detail: 'All donation receipts are IRS-compliant. Quid pro quo disclosures up to date.', icon: TrendingUp },
]

const recommendations = [
  { priority: 'high', title: 'Increase Program Spending', desc: 'Shift 3% of admin expenses to program delivery to hit the 75% Charity Navigator threshold. This could unlock higher donor confidence.' },
  { priority: 'medium', title: 'Diversify Revenue Sources', desc: 'Your public support test is passing but trending down. Add 2-3 new individual donor channels to strengthen the ratio.' },
  { priority: 'low', title: 'Review Executive Compensation', desc: 'Document your compensation methodology for Form 990 Part VII. The IRS looks for reasonable compensation.' },
]

export default function TaxOptimizerPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-brand-800">Tax Benefit Optimizer</h1>
        <p className="text-gray-500">CPA-grade intelligence to protect your status and maximize benefits.</p>
      </div>

      {/* Overall Score */}
      <div className="card bg-gradient-to-r from-brand-50 to-white">
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 rounded-full border-8 border-green-500 flex items-center justify-center">
            <span className="text-2xl font-bold text-green-600">A-</span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-brand-800">Tax Health: Excellent</h2>
            <p className="text-gray-600">Your nonprofit is in good standing. 2 optimizations recommended.</p>
          </div>
        </div>
      </div>

      {/* Optimization Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {optimizations.map(opt => (
          <div key={opt.title} className={`card border-l-4 ${opt.status === 'safe' ? 'border-l-green-500' : opt.status === 'warning' ? 'border-l-amber-500' : 'border-l-red-500'}`}>
            <div className="flex items-center gap-2 mb-2">
              <opt.icon className={`w-5 h-5 ${opt.status === 'safe' ? 'text-green-500' : opt.status === 'warning' ? 'text-amber-500' : 'text-red-500'}`} />
              <h3 className="font-semibold text-gray-900">{opt.title}</h3>
            </div>
            <p className="text-sm text-gray-600">{opt.detail}</p>
          </div>
        ))}
      </div>

      {/* Recommendations */}
      <div className="card">
        <h2 className="text-lg font-bold text-brand-800 mb-4">CPA Recommendations</h2>
        <div className="space-y-4">
          {recommendations.map(rec => (
            <div key={rec.title} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
              <span className={`text-xs font-bold px-2 py-1 rounded ${rec.priority === 'high' ? 'bg-red-100 text-red-700' : rec.priority === 'medium' ? 'bg-amber-100 text-amber-700' : 'bg-gray-200 text-gray-600'}`}>
                {rec.priority.toUpperCase()}
              </span>
              <div>
                <h3 className="font-semibold text-gray-900">{rec.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{rec.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
