import { ref } from 'vue'
import { defineStore } from 'pinia'

/** What the sign-up steps carry from one screen to the next. */
export const useRegistrationStore = defineStore('registration', () => {
  /** The address the code goes to; a stand-in until one is typed. */
  const email = ref('users@uangku.com')

  return { email }
})
