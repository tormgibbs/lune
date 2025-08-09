import { View, Text, Platform, Pressable } from 'react-native'
import React from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

interface HeaderProps {
  onCancel: () => void
  onDone: () => void
}

const Header = ({ onCancel, onDone }: HeaderProps) => {
  const insets = useSafeAreaInsets()
  return (
    <View
      style={{
        paddingTop: Platform.select({
          ios: 20,
          android: insets.top + 10,
          default: 0,
        }),
        paddingBottom: 15,
        paddingHorizontal: 20,
        backgroundColor: '#E8E6D9',
      }}>
      <View className='relative flex-row items-center justify-between'>
        <Pressable className='active:opacity-50' onPress={onCancel}>
          <Text className="text-[#6C7A45] text-lg">Cancel</Text>
        </Pressable>
        <Text
          className='absolute text-[#2B311A] text-xl font-medium left-1/2 transform -translate-x-1/2'
        >
          Edit Date
        </Text>
        <Pressable className='active:opacity-50' onPress={onDone}>
          <Text className="text-[#6C7A45] text-lg font-medium">Done</Text>
        </Pressable>
      </View>
    </View>
  )
}

export default Header
