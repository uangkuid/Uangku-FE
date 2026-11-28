import type { WalletAccount } from '@/data/wallets'

/* [glyph background and text, share bar] */
const tones = [
  ['bg-primary-container text-on-primary-container', 'bg-primary'],
  ['bg-tertiary-container text-on-tertiary-container', 'bg-tertiary'],
  ['bg-secondary-container text-on-secondary-container', 'bg-secondary'],
  ['bg-success-container text-on-success-container', 'bg-success'],
  ['bg-warning-container text-on-warning-container', 'bg-warning'],
  ['bg-info-container text-on-info-container', 'bg-info'],
] as const

const shapes = [
  'rounded-full',
  'rounded-corner-lg',
  'rounded-[50%_50%_50%_16px]',
  'rounded-[26px_8px]',
  'rounded-[50%_16px_50%_16px]',
]

/**
 * The colors and shape of a wallet's glyph, which its place in the list decides. Family wallets are
 * always tertiary, and sleeping ones neutral.
 */
export function walletLook(wallet: WalletAccount, index: number) {
  const [glyph, bar] = wallet.sleeping
    ? ['bg-surface-container-highest text-on-surface-variant', 'bg-outline']
    : tones[wallet.family ? 1 : index % tones.length]!
  return { glyph, bar, shape: shapes[index % shapes.length]! }
}
