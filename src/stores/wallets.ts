import { ref } from 'vue'
import { defineStore } from 'pinia'
import { walletAccounts, walletId, type WalletAccount } from '@/data/wallets'

export const WALLET_NAME_LIMIT = 24

/** The prototype's wallets, kept in memory so that changes show on every screen. */
export const useWalletsStore = defineStore('wallets', () => {
  const list = ref(walletAccounts.map((wallet) => ({ ...wallet })))
  /** Members invited to a wallet in this session, by wallet id. */
  const invites = ref<Record<string, string[]>>({})

  function find(id: string) {
    return list.value.find((wallet) => wallet.id === id)
  }

  /** Why a name can't be used; empty when it can. `ownId` is the wallet being renamed. */
  function nameError(name: string, ownId?: string) {
    const clean = name.trim()
    if (!clean) return 'Enter a wallet name.'
    if (clean.length < 2) return 'Use at least 2 characters.'
    const lower = clean.toLowerCase()
    const taken = list.value.some(
      (wallet) => wallet.id !== ownId && wallet.name.toLowerCase() === lower,
    )
    return taken ? 'You already have a wallet with this name.' : ''
  }

  function create(name: string, family: boolean): WalletAccount {
    const clean = name.trim()
    const words = clean.split(/\s+/)
    const glyph = words.length > 1 ? words[0]!.charAt(0) + words[1]!.charAt(0) : clean.slice(0, 2)
    const base = walletId(clean) || 'wallet'
    let id = base
    for (let next = 2; find(id); next++) id = `${base}-${next}`
    const wallet = {
      id,
      name: clean,
      glyph: glyph.toUpperCase(),
      kind: 'Wallet',
      balance: 0,
      family,
      sleeping: false,
    }
    list.value.push(wallet)
    return wallet
  }

  /** The id stays, so that a renamed wallet keeps its address. */
  function rename(id: string, name: string) {
    const wallet = find(id)
    if (wallet) wallet.name = name.trim()
  }

  function setSleeping(id: string, sleeping: boolean) {
    const wallet = find(id)
    if (wallet) wallet.sleeping = sleeping
  }

  function invite(id: string, emails: string[]) {
    invites.value[id] = [...(invites.value[id] ?? []), ...emails]
  }

  return { list, invites, find, nameError, create, rename, setSleeping, invite }
})
