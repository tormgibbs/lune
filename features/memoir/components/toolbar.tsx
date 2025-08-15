import { Pressable, StyleProp, Text, View, ViewStyle } from 'react-native'
import React from 'react'
import {
  AudioLines,
  Camera,
  CaseSensitive,
  Images,
  Speech,
} from 'lucide-react-native'
import { cn } from '@/lib/utils'
import { KeyboardStickyView } from 'react-native-keyboard-controller'

interface ToolbarProps {
  className?: string
  style?: StyleProp<ViewStyle>
  onAudioPress: () => void
  onCameraPress: () => void
  onTextFormatPress: () => void
  onImagesPress: () => void
  onSpeechPress: () => void
}



const Toolbar: React.FC<ToolbarProps> = ({
  className,
  style,
  onAudioPress,
  onCameraPress,
  onTextFormatPress,
  onImagesPress,
  onSpeechPress,
}) => {
  return (
    <KeyboardStickyView
      style={[{ zIndex: -1, backgroundColor: '#E0DCCC', borderTopColor: '#BFBDB0' }, style]}
      className={cn(
        'p-4 flex-row items-center justify-around bg-[#E0DCCC] border-t-[#BFBDB0]',
        className,
      )}
    >
      <Pressable onPress={onTextFormatPress}>
        <CaseSensitive size={24} />
      </Pressable>

      <Pressable onPress={onImagesPress}>
        <Images size={24} />
      </Pressable>

      <Pressable onPress={onCameraPress}>
        <Camera size={24} />
      </Pressable>

      <Pressable onPress={onAudioPress}>
        <AudioLines size={24} />
      </Pressable>

      <Pressable onPress={onSpeechPress}>
        <Speech size={24} />
      </Pressable>
    </KeyboardStickyView>
  )
}

export default Toolbar

// border-[#C2C0B2]