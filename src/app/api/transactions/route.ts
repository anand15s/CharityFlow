import { NextRequest, NextResponse } from 'next/server'

// GET /api/transactions — List transactions for an organization
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const orgId = searchParams.get('orgId')
  const type = searchParams.get('type') // 'in' | 'out' | null
  const fund = searchParams.get('fund')

  // TODO: Replace with Prisma query
  return NextResponse.json({
    success: true,
    data: [],
    meta: { orgId, type, fund, total: 0 }
  })
}

// POST /api/transactions — Create a new transaction
export async function POST(request: NextRequest) {
  const body = await request.json()
  const { orgId, date, description, amount, type, category, fund } = body

  if (!orgId || !description || !amount) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  // TODO: Replace with Prisma insert + audit log
  return NextResponse.json({ success: true, data: { id: 'new-txn-id', ...body } }, { status: 201 })
}
