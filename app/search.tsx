import { Pressable, Text, TextInput, View, BackHandler } from 'react-native'
import React, { useEffect, useRef, useCallback } from 'react'
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming,
  runOnJS
} from 'react-native-reanimated'
import { Input } from '@/components/ui/input'
import { router, Stack, useFocusEffect } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Mic, Search as SearchIcon } from 'lucide-react-native'

const Search = () => {
  const inputRef = useRef<TextInput>(null)
  const translateY = useSharedValue(-60)
  const opacity = useSharedValue(0)

  const focusInput = () => {
    inputRef.current?.focus()
  }

  const navigateBack = () => {
    router.back()
  }

  const handleBack = useCallback(() => {
    translateY.value = withTiming(-60, { duration: 100 })
    opacity.value = withTiming(0, { duration: 100 }, () => {
      runOnJS(navigateBack)()
    })
    return true
  }, [translateY, opacity])

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value
  }))

  useEffect(() => {
    translateY.value = withTiming(0, { duration: 250 })
    opacity.value = withTiming(1, { duration: 250 }, () => {
      runOnJS(focusInput)()
    })
  }, [translateY, opacity])

  useFocusEffect(
    useCallback(() => {
      const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBack)
      return () => backHandler.remove()
    }, [handleBack])
  )

  return (
    <SafeAreaView className="flex-1 p-4">
      <Stack.Screen
        options={{
          animation: 'none',
          presentation: 'card',
        }}
      />
      <Animated.View style={animatedStyle} className='flex-row justify-between items-center gap-3'>
        <View className='flex-1 flex-row rounded-lg px-2 bg-[#E8E6D9] items-center gap-2'>
          <SearchIcon size={20} color="#666" />
          <Input
            ref={inputRef}
            placeholder="Search your entries..."
            className="p-0 flex-1 border-0 bg-[#E8E6D9] text-black rounded-lg text-base"
          />
          <Mic size={20} />
        </View>
        <Pressable onPress={handleBack}>
          <Text className='text-[#6C7A45] text-xl'>Cancel</Text>
        </Pressable>
      </Animated.View>
    </SafeAreaView>
  )
}

export default Search