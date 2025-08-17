import { View, Text, Pressable, Animated } from 'react-native'
import { RefObject, useRef, useState } from 'react'
import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet'

interface AudioRecorderSheetProps {
  audioSheetRef: RefObject<BottomSheetModal | null>
}

const AudioRecorderSheet = ({ audioSheetRef }: AudioRecorderSheetProps) => {
  const [isRecording, setIsRecording] = useState(false)
  const animatedValue = useRef(new Animated.Value(0)).current

  const handlePress = () => {
    const toValue = isRecording ? 0 : 1
    setIsRecording(!isRecording)

    Animated.spring(animatedValue, {
      toValue,
      useNativeDriver: false,
      tension: 100,
      friction: 8,
    }).start()
  }

  
  const borderRadius = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [50, 8]
  })

  const scale = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.6],
  })

  return (
    <BottomSheetModal
      ref={audioSheetRef}
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
      <BottomSheetView className="p-4 pb-6 bg-[#E0DCCC]">
        <View className="items-center p-10">
          <Pressable className="p-1 bg-[#6C7A45] rounded-full" onPress={handlePress}>
            <View className='p-1 rounded-full bg-[#E0DCCC]'>
              <Animated.View 
                className="p-8 bg-red-500"
                style={{
                  borderRadius,
                  transform: [{ scale }],
                }}
              />
            </View>
          </Pressable>
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  )
}

export default AudioRecorderSheet