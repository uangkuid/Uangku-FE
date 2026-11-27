import type { Category } from '@/data/home'
import type { CategoryOption } from '@/data/newTransaction'

/** A category or one of its subcategories, as the form selects it. */
export interface CategoryChoice {
  /** `food`, or `food/Coffee` for a subcategory. */
  key: string
  category: Category
  name: string
}

export function categoryChoice(option: CategoryOption, subcategory?: string): CategoryChoice {
  return {
    key: subcategory ? `${option.category}/${subcategory}` : option.category,
    category: option.category,
    name: subcategory ?? option.name,
  }
}

/**
 * The grid's shortcuts: the first `size` categories. A selection from elsewhere in the list takes
 * the last place, so that it stays visible.
 */
export function gridChoices(options: CategoryOption[], size: number, selected?: string) {
  const choices = options.slice(0, size).map((option) => categoryChoice(option))
  if (!selected || choices.some((choice) => choice.key === selected)) return choices

  const [category, subcategory] = selected.split('/')
  const option = options.find((candidate) => candidate.category === category)
  if (option) choices[choices.length - 1] = categoryChoice(option, subcategory)
  return choices
}
