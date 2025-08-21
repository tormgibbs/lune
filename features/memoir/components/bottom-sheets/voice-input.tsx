import { View, Text, Pressable } from 'react-native'
import React, { useEffect } from 'react'
import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet'
import { Mic } from 'lucide-react-native'
import { FontAwesome } from '@expo/vector-icons'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withDelay,
} from 'react-native-reanimated'

interface VoiceInputSheetProps {
  bottomSheetRef: React.RefObject<BottomSheetModal | null>
}

const RippleRing = ({ delay = 0 }: { delay?: number }) => {
  const scale = useSharedValue(0)
  const opacity = useSharedValue(1)

  useEffect(() => {
    const animate = () => {
      scale.value = 0
      opacity.value = 1

      scale.value = withDelay(
        delay,
        withRepeat(withTiming(1.5, { duration: 2000 }), -1, false),
      )

      opacity.value = withDelay(
        delay,
        withRepeat(withTiming(0, { duration: 2000 }), -1, false),
      )
    }

    animate()
  }, [delay, scale, opacity])

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }))

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          width: 150,
          height: 150,
          borderRadius: 100,
          borderWidth: 2,
          borderColor: '#6F7F7F',
          backgroundColor: 'rgba(111, 127, 127, 0.5)'
        },
        animatedStyle,
      ]}
    />
  )
}

const VoiceInputSheet = ({ bottomSheetRef }: VoiceInputSheetProps) => {
  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      enablePanDownToClose
      keyboardBehavior="extend"
      keyboardBlurBehavior="none"
      android_keyboardInputMode="adjustResize"
      handleComponent={null}
      style={{
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        overflow: 'hidden',
      }}>
      <BottomSheetView className="px-4 py-16 items-center bg-[#E0DCCC]">
        <Pressable className="flex items-center">
          <View
            style={{
              position: 'relative',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            {/* Multiple ripple rings with different delays */}
            <RippleRing delay={0} />
            <RippleRing delay={400} />
            <RippleRing delay={800} />
            <RippleRing delay={1200} />

            {/* Microphone icon */}
            <View className='bg-[#6F7F7F] p-6 rounded-full'>
              <View className="bg-[#2F4F4F] px-6 py-4 rounded-full">
                <FontAwesome
                  name="microphone"
                  size={40}
                  color="#FFFFFF"
                  style={{ zIndex: 10 }}
                />
              </View>
            </View>
          </View>
        </Pressable>
      </BottomSheetView>
    </BottomSheetModal>
  )
}

export default VoiceInputSheet
