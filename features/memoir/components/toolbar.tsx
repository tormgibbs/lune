import { Pressable, View } from 'react-native'
import React from 'react'
import { AudioLines, Camera, CaseSensitive, Images, Speech } from 'lucide-react-native'

interface ToolbarProps {
  onAudioPress: () => void
  onCameraPress: () => void
  onTextFormatPress: () => void
  onImagesPress: () => void
  onSpeechPress: () => void
}

const Toolbar: React.FC<ToolbarProps> = ({
  onAudioPress,
  onCameraPress,
  onTextFormatPress,
  onImagesPress,
  onSpeechPress,
}) => {
  return (
    <View 
      style={{ zIndex: -1 }}
      className="p-4 flex-row items-center justify-around bg-black border-t border-[#C2C0B2]"
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
    </View>
  )
}

export default Toolbar
