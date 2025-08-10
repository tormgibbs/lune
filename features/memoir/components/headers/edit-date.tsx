import { View, Text, Platform, Pressable, StyleSheet } from 'react-native'
import React from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { cn } from '@/lib/utils'

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
          ios: 25,
          android: insets.top + 10,
          default: 0,
        }),
        paddingBottom: 10,
        paddingHorizontal: 20,
        backgroundColor: '#E8E6D9',
      }}
    >
      <View className="relative flex-row items-center justify-between">
        <Pressable className="active:opacity-50" onPress={onCancel}>
          <Text
            className={cn(
              'text-[#6C7A45]',
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
          className={cn(
            'text-[#2B311A] absolute left-1/2 transform -translate-x-1/2',
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
              'text-[#6C7A45]',
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

const styles = StyleSheet.create({
  header: {
    position: 'absolute',
    left: '50%',
    transform: [{ translateX: -50 }],
  }
})
