import { Pressable, StyleProp, ViewStyle } from 'react-native'
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
  isEditorFocused: boolean
  dark?: boolean
}

const Toolbar: React.FC<ToolbarProps> = ({
  className,
  style,
  onAudioPress,
  onCameraPress,
  onTextFormatPress,
  onImagesPress,
  onSpeechPress,
  isEditorFocused,
  dark = false,
}) => {
  const iconColor = dark ? '#E8E6D9' : '#333333'

  return (
    <KeyboardStickyView
      className={cn(
        'p-4 flex-row items-center justify-around border-t',
        dark
          ? 'bg-[#6B7A5C] border-t-[#5A6B4A]'
          : 'bg-[#E0DCCC] border-t-[#BFBDB0]',
      )}>
      <Pressable
        onPress={onTextFormatPress}
        hitSlop={20}
        disabled={!isEditorFocused}
        style={{ opacity: isEditorFocused ? 1 : 0.5 }}>
        <CaseSensitive size={24} color={iconColor} />
      </Pressable>

      <Pressable onPress={onImagesPress} hitSlop={20}>
        <Images size={24} color={iconColor} />
      </Pressable>

      <Pressable onPress={onCameraPress} hitSlop={20}>
        <Camera size={24} color={iconColor} />
      </Pressable>

      <Pressable onPress={onAudioPress} hitSlop={20}>
        <AudioLines size={24} color={iconColor} />
      </Pressable>

      <Pressable
        onPress={onSpeechPress}
        hitSlop={20}
        disabled={!isEditorFocused}
        style={{ opacity: isEditorFocused ? 1 : 0.5 }}>
        <Speech size={24} color={iconColor} />
      </Pressable>
    </KeyboardStickyView>
  )
}

export default Toolbar
