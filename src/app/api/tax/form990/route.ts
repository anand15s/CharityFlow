import { NextRequest, NextResponse } from 'next/server'

// GET /api/tax/form990 — Get Form 990 status
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const orgId = searchParams.get('orgId')
  const year = searchParams.get('year')

  // TODO: Auto-select form type based on org revenue
  // Under $50K: 990-N (e-Postcard)
  // $50K-$200K: 990-EZ
  // Over $200K: Full 990
  return NextResponse.json({
    success: true,
    data: { formType: '990-EZ', status: 'draft', completion: 78, year: year || 2025 }
  })
}

// POST /api/tax/form990/generate — Auto-generate Form 990 from transaction data
export async function POST(request: NextRequest) {
  const body = await request.json()
  const { orgId, year } = body

  // TODO: Pull all transactions, categorize by 990 line items,
  // calculate functional expenses, populate form fields
  return NextResponse.json({
    success: true,
    message: 'Form 990 generated from transaction data',
    data: { formType: '990-EZ', status: 'draft' }
  })
}
