import { View, Text, Pressable } from 'react-native'
import React from 'react'
import { Trash2 } from 'lucide-react-native'
import { router } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'

interface MediaHeaderProps {
  onDeletePress?: () => void
}

const MediaHeader = ({ onDeletePress }: MediaHeaderProps) => {
  const insets = useSafeAreaInsets()
  return (
    <>
      <StatusBar style="auto" backgroundColor="#AEBC8A" />
      <View style={{ paddingTop: insets.top }} />
      <View 
        style={{ backgroundColor: '#AEBC8A'}}
        className="flex-row p-4 items-center justify-between">
        <Pressable hitSlop={10} onPress={() => router.back()}>
          <Text className="text-white text-lg">Close</Text>
        </Pressable>

        <Pressable hitSlop={10} onPress={onDeletePress}>
          <Trash2 color="white" size={24} />
        </Pressable>
      </View>
    </>
  )
}

export default MediaHeader
