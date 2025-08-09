// AnimatedPopoverContent.tsx
import React, { useEffect } from 'react'
import { View, StyleSheet } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated'

interface Props {
  visible: boolean
  children: React.ReactNode
  onDisappear?: () => void
}

const AnimatedPopoverContent: React.FC<Props> = ({ children, visible, onDisappear }) => {
  const scale = useSharedValue(visible ? 0.85 : 1)
  const opacity = useSharedValue(visible ? 0 : 1)

  const springConfig = React.useMemo(
    () => ({
      damping: 20,
      stiffness: 300,
      mass: 0.8,
      overshootClamping: false,
    }),
    [],
  )

  // // Spring config to mimic iOS popover bounce
  // const springConfig = React.useMemo(
  //   () => ({
  //     damping: 20,
  //     stiffness: 300,
  //     mass: 0.8,
  //     overshootClamping: false,
  //     restDisplacementThreshold: 0.01,
  //     restSpeedThreshold: 0.01,
  //   }),
  //   [],
  // )

  useEffect(() => {
    if (visible) {
      // Animate in
      scale.value = withSpring(1, springConfig)
      opacity.value = withTiming(1, { duration: 150 })
    } else {
      // Animate out
      scale.value = withTiming(0.85, { duration: 150 })
      opacity.value = withTiming(0, { duration: 150 }, (finished) => {
        if (finished && onDisappear) {
          runOnJS(onDisappear)()
        }
      })
    }
  }, [onDisappear, opacity, scale, springConfig, visible])

  // useEffect(() => {
  //   scale.value = withSpring(1, springConfig)
  //   opacity.value = withTiming(1, { duration: 150 })
  // }, [opacity, scale, springConfig])

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    }
  })

  return <Animated.View style={animatedStyle}>{children}</Animated.View>
}

export default AnimatedPopoverContent
