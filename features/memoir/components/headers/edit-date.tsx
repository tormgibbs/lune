import { View, Text, Platform, Pressable, StyleSheet } from 'react-native'
import React from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { cn } from '@/lib/utils'
import { CENTERED_TEXT_STYLE } from '@/lib/constants'

interface HeaderProps {
  onCancel: () => void
  onDone: () => void
  dark?: boolean
}

const Header = ({ onCancel, onDone, dark }: HeaderProps) => {
  const insets = useSafeAreaInsets()
  return (
    <View
      style={{
        paddingTop: Platform.select({
          ios: 25,
          android: insets.top + 10,
          default: 0,
        }),
        paddingBottom: 10,
        paddingHorizontal: 20,
        backgroundColor: dark ? '#899D78' : '#E8E6D9',
      }}
    >
      <View className="relative flex-row items-center justify-between">
        <Pressable className="active:opacity-50" onPress={onCancel}>
          <Text
            className={cn(
              dark ? 'text-[#E8E6D9]' : 'text-[#6C7A45]',
              Platform.select({
                ios: 'text-xl',
                android: 'text-lg',
                default: 'text-lg',
              }),
            )}>
            Cancel
          </Text>
        </Pressable>
        <Text
          style={CENTERED_TEXT_STYLE(dark ? '#E8E6D9' : '#2B311A')}
          className={cn(
            // 'text-[#2B311A] absolute left-1/2 transform -translate-x-1/2',
            Platform.select({
              ios: 'text-xl font-medium',
              android: 'text-lg font-medium',
              default: 'text-lg font-medium',
            }),
          )}>
          Edit Date
        </Text>
        <Pressable className="active:opacity-50" onPress={onDone}>
          <Text
            className={cn(
              dark ? 'text-[#E8E6D9]' : 'text-[#6C7A45]',
              Platform.select({
                ios: 'text-xl font-medium',
                android: 'text-lg font-medium',
                default: 'text-lg font-medium',
              }),
            )}>
            Done
          </Text>
        </Pressable>
      </View>
    </View>
  )
}

export default Header
