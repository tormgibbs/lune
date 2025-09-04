import { Category } from '@/db/schema'
import { MediaAsset } from '@/types/media'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function normalizeColor(rgb: string) {
  if (!rgb.startsWith('rgb(')) return rgb
  const nums = rgb
    .slice(4, -1)
    .split(',')
    .map((s) => parseInt(s.trim()))
  const [r, g, b] = nums
  return `#${(r < 16 ? '0' : '') + r.toString(16)}${(g < 16 ? '0' : '') + g.toString(16)}${(b < 16 ? '0' : '') + b.toString(16)}`
}

export function formatDuration(ms?: number) {
  if (!ms) return '0:00'
  const totalSeconds = Math.floor(ms / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

export function formatDurationWithDecimals(ms?: number) {
  if (!ms) return '0:00.00'
  const totalSeconds = Math.floor(ms / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  const centiseconds = Math.floor((ms % 1000) / 10)
  return `${minutes}:${seconds.toString().padStart(2, '0')}.${centiseconds
    .toString()
    .padStart(2, '0')}`
}

export function deriveCategories(title: string, content: string, media: MediaAsset[]) {
  const categories: Category[] = []

  if (title?.trim() || content?.trim()) {
    categories.push('text')
  }

  if (media.some(m => m.type === 'image')) {
    categories.push('photo')
  }
  if (media.some(m => m.type === 'video')) {
    categories.push('video')
  }
  if (media.some(m => m.type === 'audio')) {
    categories.push('audio')
  }

  return categories
}
