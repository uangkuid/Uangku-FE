import { ref } from 'vue'
import { defineStore } from 'pinia'

/** Whether the navigation rail is expanded. Each screen draws its own rail, so it is kept here. */
export const useNavRailStore = defineStore('navRail', () => {
  const expanded = ref(false)

  return { expanded }
})
