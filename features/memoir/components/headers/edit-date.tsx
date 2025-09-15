import { View, Text, Platform, Pressable, StyleSheet } from 'react-native'
import React from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { cn } from '@/lib/utils'
import { CENTERED_TEXT_STYLE } from '@/lib/constants'
import { FontSize } from '@/lib/use-font-size'

interface HeaderProps {
  onCancel: () => void
  onDone: () => void
  dark?: boolean
  fontSize?: FontSize
}

const Header = ({
  onCancel,
  onDone,
  dark,
  fontSize = 'medium',
}: HeaderProps) => {
  const insets = useSafeAreaInsets()
  const actionClass = cn(
    fontSize === 'small' && 'text-sm',
    fontSize === 'medium' && 'text-lg',
    fontSize === 'large' && 'text-xl',
  )

  const titleClass = cn(
    fontSize === 'small' && 'text-base font-medium',
    fontSize === 'medium' && 'text-xl font-medium',
    fontSize === 'large' && 'text-2xl font-medium',
  )

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
      }}>
      <View className="relative flex-row items-center justify-between">
        <Pressable className="active:opacity-50" onPress={onCancel}>
          <Text
            className={cn(
              dark ? 'text-[#E8E6D9]' : 'text-[#6C7A45]',
              actionClass,
              // Platform.select({
              //   ios: 'text-xl',
              //   android: 'text-lg',
              //   default: 'text-lg',
              // }),
            )}>
            Cancel
          </Text>
        </Pressable>
        <Text
          style={CENTERED_TEXT_STYLE(dark ? '#E8E6D9' : '#2B311A')}
          className={cn(
            titleClass,
            // 'text-[#2B311A] absolute left-1/2 transform -translate-x-1/2',
            // Platform.select({
            //   ios: 'text-xl font-medium',
            //   android: 'text-lg font-medium',
            //   default: 'text-lg font-medium',
            // }),
          )}>
          Edit Date
        </Text>
        <Pressable className="active:opacity-50" onPress={onDone}>
          <Text
            className={cn(
              dark ? 'text-[#E8E6D9]' : 'text-[#6C7A45]',
              actionClass,
              // Platform.select({
              //   ios: 'text-xl font-medium',
              //   android: 'text-lg font-medium',
              //   default: 'text-lg font-medium',
              // }),
            )}>
            Done
          </Text>
        </Pressable>
      </View>
    </View>
  )
}

export default Header
