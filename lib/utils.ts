import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function normalizeColor(rgb: string) {
  if (!rgb.startsWith('rgb(')) return rgb
  const nums = rgb.slice(4, -1).split(',').map(s => parseInt(s.trim()))
  const [r, g, b] = nums
  return `#${(r < 16 ? '0' : '') + r.toString(16)}${(g < 16 ? '0' : '') + g.toString(16)}${(b < 16 ? '0' : '') + b.toString(16)}`
}
