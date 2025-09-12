import { View, Text, Pressable, BackHandler } from 'react-native'
import React, { useEffect, useState, useRef } from 'react'
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from '@gorhom/bottom-sheet'
import { FontAwesome } from '@expo/vector-icons'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withDelay,
  cancelAnimation,
} from 'react-native-reanimated'
import {
  ExpoSpeechRecognitionModule,
  useSpeechRecognitionEvent,
} from 'expo-speech-recognition'
import { CENTERED_TEXT_STYLE } from '@/lib/constants'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react-native'
import { toast, Toaster } from 'sonner-native'
import { Host, Portal } from 'react-native-portalize'

interface VoiceInputSheetProps {
  bottomSheetRef: React.RefObject<BottomSheetModal | null>
  onTranscript?: (transcript: string) => void
  onDismiss?: () => void
}

const RippleRing = ({ delay = 0 }: { delay?: number }) => {
  const scale = useSharedValue(0)
  const opacity = useSharedValue(1)

  useEffect(() => {
    scale.value = withDelay(
      delay,
      withRepeat(withTiming(1.5, { duration: 2000 }), -1, false),
    )

    opacity.value = withDelay(
      delay,
      withRepeat(withTiming(0, { duration: 2000 }), -1, false),
    )

    return () => {
      cancelAnimation(scale)
      cancelAnimation(opacity)
    }
  }, [delay])

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }))

  return (
    <Animated.View
      className="absolute w-[150] h-[150] rounded-full border-2 border-[#6F7F7F] bg-[#6F7F7F] opacity-50"
      style={[animatedStyle]}
    />
  )
}

const VoiceInputSheet = ({
  bottomSheetRef,
  onTranscript,
  onDismiss,
}: VoiceInputSheetProps) => {
  const [isListening, setIsListening] = useState(false)

  useSpeechRecognitionEvent('start', () => setIsListening(true))
  useSpeechRecognitionEvent('end', () => setIsListening(false))

  useSpeechRecognitionEvent('result', (event) => {
    const text = event.results[0]?.transcript ?? ''

    if (event.isFinal) {
      // maybe append to a "confirmed" transcript
      onTranscript?.(text)
    } else {
      // show interim text (like greyed-out or live typing)
      // but don’t overwrite your final transcript until isFinal=true
      console.log('interim:', text)
    }
  })

  useSpeechRecognitionEvent('error', (event) => {
    console.log('Speech error:', event.error, event.message)

    let friendlyMessage = 'Something went wrong. Please try again.'

    if (event.error === 'network') {
      friendlyMessage =
        'We couldn’t connect to the speech service. Check your internet connection and try again.'
    } else if (event.error === 'not-allowed') {
      friendlyMessage =
        'Microphone access is denied. Please enable it in your device settings.'
    } else if (event.error === 'no-speech') {
      friendlyMessage =
        'We didn’t hear anything. Try speaking clearly into the microphone.'
    }

    toast.error(friendlyMessage, {
      id: 'stt-toast',
      position: 'top-center',
      invert: true,
    })
  })

  const handleToggleListening = async () => {
    if (isListening) {
      ExpoSpeechRecognitionModule.stop()
      return
    }

    const result = await ExpoSpeechRecognitionModule.requestPermissionsAsync()
    if (!result.granted) {
      console.warn('Microphone permissions not granted', result)
      return
    }

    ExpoSpeechRecognitionModule.start({
      lang: 'en-US',
      interimResults: true,
      continuous: false,
    })
  }

  const renderBackdrop = (props: any) => (
    <BottomSheetBackdrop
      {...props}
      pressBehavior="close"
      disappearsOnIndex={-1}
      appearsOnIndex={0}
    />
  )

  const handleClosePress = () => {
    bottomSheetRef.current?.dismiss()
  }

  useEffect(() => {
    const backAction = () => {
      if (bottomSheetRef.current) {
        bottomSheetRef.current.dismiss()
        return true
      }
      return false
    }

    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    )

    return () => subscription.remove()
  }, [bottomSheetRef])

  return (
    <>
      <BottomSheetModal
        ref={bottomSheetRef}
        enablePanDownToClose
        keyboardBehavior="extend"
        backdropComponent={renderBackdrop}
        keyboardBlurBehavior="none"
        android_keyboardInputMode="adjustResize"
        enableOverDrag={false}
        handleComponent={null}
        onDismiss={onDismiss}
        backgroundStyle={{
          backgroundColor: '#E0DCCC',
        }}
        style={{
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          overflow: 'hidden',
        }}>
        <BottomSheetView className="px-4 pt-5 pb-16 items-center bg-[#E0DCCC]">
          <View className="relative flex-row w-full items-center justify-end mb-12">
            <Text className="font-medium text-lg" style={CENTERED_TEXT_STYLE()}>
              {isListening ? 'Listening…' : 'Tap to Speak'}
            </Text>
            <Button
              onPress={handleClosePress}
              variant="secondary"
              size="icon"
              className="bg-[#F5F2E3] rounded-full">
              <X color="#6C7A45" />
            </Button>
          </View>
          <Pressable
            className="flex-1 items-center"
            onPress={handleToggleListening}>
            <View className="relative items-center justify-center">
              {isListening && (
                <>
                  <RippleRing delay={0} />
                  <RippleRing delay={400} />
                  <RippleRing delay={800} />
                  <RippleRing delay={1200} />
                </>
              )}

              {/* Microphone icon */}
              <View className="bg-[#6F7F7F] p-6 rounded-full">
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
      <Toaster swipeToDismissDirection="left" style={{ zIndex: 1000 }} />
    </>
  )
}

export default VoiceInputSheet

// Speech error: network Other network related errors.
