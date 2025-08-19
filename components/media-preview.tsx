import { View, Text, Pressable } from 'react-native'
import React from 'react'
import { Image } from 'expo-image'

interface MediaPreviewProps {
  uri: string
  onRetake: () => void
  onUse: (uri: string) => void
}

const MediaPreview = ({ uri, onRetake, onUse }: MediaPreviewProps) => {
  return (
    <View className="flex-1 bg-black">
      <Image source={{ uri }} style={{ flex: 1 }} contentFit='contain' />
      <View className="flex-row items-center justify-between p-4 bg-black/70">
        <Pressable
          onPress={onRetake}
          className="px-6 py-3">
          <Text className="text-white font-medium text-lg">Retake</Text>
        </Pressable>
        <Pressable
          onPress={() => onUse(uri)}
          className="px-6 py-3">
          <Text className="text-white font-medium text-lg">Use Photo</Text>
        </Pressable>
      </View>
    </View>
  )
}

export default MediaPreview
