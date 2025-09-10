import React, { useRef, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import PagerView, {
  PagerViewOnPageSelectedEvent,
} from 'react-native-pager-view'
import { Image } from 'expo-image'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { PageIndicator } from 'react-native-page-indicator'
import { router } from 'expo-router'
import { Check } from 'lucide-react-native'
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated'
import { cn } from '@/lib/utils'

const images = [
  require('../assets/tutorial/1.png'),
  require('../assets/tutorial/2.png'),
]

const Tutorial = () => {
  const [currentPage, setCurrentPage] = useState(0)
  const pagerRef = useRef<PagerView>(null)

  const onPageSelected = (e: PagerViewOnPageSelectedEvent) => {
    setCurrentPage(e.nativeEvent.position)
  }

  const navigateBack = () => {
    router.back()
  }

  const handleNext = () => {
    if (currentPage < images.length - 1) {
      pagerRef.current?.setPage(currentPage + 1)
    } else {
      router.back()
    }
  }

  const checkStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(currentPage === images.length - 1 ? 1 : 0, {
        duration: 400,
      }),
    }
  }, [currentPage])

  return (
    <SafeAreaView className="relative flex-1">
      <PagerView
        ref={pagerRef}
        initialPage={0}
        style={{ flex: 1 }}
        onPageSelected={onPageSelected}>
        {images.map((image, index) => (
          <Image key={index} source={image} style={styles.image} />
        ))}
      </PagerView>

      <View className="absolute flex-row bottom-0 py-4 left-0 px-6 right-0 bg-black/30 items-center">
        <View className="flex-1">
          {currentPage < images.length - 1 && (
            <Pressable hitSlop={20} onPress={navigateBack}>
              <Text className="text-white py-2.5 text-xl font-semibold">
                Skip
              </Text>
            </Pressable>
          )}
        </View>

        <View className="flex-1 items-center">
          <View className="bg-black/30 rounded-full px-3 py-2">
            <PageIndicator
              count={images.length}
              current={currentPage}
              color="#ccc"
              activeColor="#C2D39C"
              size={8}
            />
          </View>
        </View>

        <View className="flex-1 items-end">
          <Pressable
            hitSlop={20}
            onPress={handleNext}
            className={cn(
              currentPage === images.length - 1 &&
                'bg-gray-400 p-3 rounded-full items-center justify-center',
            )}>
            {currentPage === images.length - 1 ? (
              <Animated.View style={checkStyle}>
                <Check size={20} color="white" />
              </Animated.View>
            ) : (
              <Text className="text-white text-xl py-2.5 font-semibold">
                Next
              </Text>
            )}
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default Tutorial

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: '100%',
  },
})
