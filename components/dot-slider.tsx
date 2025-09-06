import React from 'react'
import { View } from 'react-native'

interface DotSlider {
  totalItems: number
  currentIndex: number
  maxDots?: number
}

const DotSlider = ({
  totalItems,
  currentIndex,
  maxDots = 8,
}: DotSlider) => {
  if (totalItems <= 1) return null

  const dots = []

  let start = 0
  let end = totalItems

  if (totalItems > maxDots) {
    const half = Math.floor(maxDots / 2)
    if (currentIndex <= half) {
      start = 0
      end = maxDots
    } else if (currentIndex >= totalItems - half) {
      start = totalItems - maxDots
      end = totalItems
    } else {
      start = currentIndex - half + 1
      end = start + maxDots
    }
  }

  for (let i = start; i < end; i++) {
    let size = 8
    let opacity = 0.5

    if (i === currentIndex) {
      size = 12
      opacity = 1
    } else if (i === start || i === end - 1) {
      size = 4 // smaller edge dots
    }

    dots.push(
      <View
        key={i}
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: `rgba(255,255,255,${opacity})`,
          marginHorizontal: 4,
        }}
      />
    )
  }

  return (
    <View
      style={{ paddingVertical: 16 }}
      className='flex-row items-center justify-center'>{dots}</View>
  )
}

export default DotSlider
