/**
 * Prototype data for the family screens, taken from the design. There is no API yet: replace this
 * module with real requests once it exists.
 */
import type { Category } from '@/data/home'

export const familyData = {
  name: 'Oratakashi Family',
  members: ['Orata', 'Utami', 'Ahsan', 'Akhan', 'Ikhsan'],
  /** Cumulative totals per day of the week shown. */
  week: {
    days: ['22 Jul', '23 Jul', '24 Jul', '25 Jul', '26 Jul', '27 Jul', '28 Jul'],
    year: 2025,
    income: [100_000, 450_000, 950_000, 1_200_000, 1_200_000, 1_750_000, 1_750_000],
    spending: [100_000, 100_000, 600_000, 850_000, 1_000_000, 1_000_000, 1_500_000],
    max: 2_000_000,
    ticks: ['2.000.000', '1.500.000', '1.000.000', '500.000', '0'],
    initialDay: 4,
  },
  topTransactions: [
    transaction('salary', 'Salary', 52_500_000, 'Freelance Fee'),
    transaction('technology', 'Electronic', -10_500_000, 'iPhone'),
    transaction('salary', 'Salary', 2_500_000, 'Salary'),
    transaction('transportation', 'Transportation', -80_000, 'Go Car'),
    transaction('food', 'Food', -50_000, 'Lunch'),
  ],
  /** Invite codes handed out one after the other; each is valid for `inviteSeconds`. */
  inviteCodes: ['K7QP-2MXD', 'R4TZ-9LCW', 'B8HN-3VQE', 'M2XF-7KJA'],
  inviteSeconds: 300,
  secretKey: 'UANGKU-F3WN-P8LC-J6Y-2DA',
  /** The family that the join flow is invited to. */
  invitation: {
    family: 'Uangku Family',
    invitedBy: 'Orata',
    members: 3,
    secretKey: 'UANGKU-H2RT-Q9VB-K4M-7XS',
  },
}

function transaction(category: Category, categoryName: string, amount: number, notes: string) {
  return { category, categoryName, amount, notes, date: '1 Jan 25', wallet: 'Cash' }
}
