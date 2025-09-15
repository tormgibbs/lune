import { View, Text, Pressable } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router, Stack } from 'expo-router'
import { ArrowLeft } from 'lucide-react-native'
import { ThemeToggleSwitch } from '@/components/theme-toggle-switch'
import FontSizeControl from '@/components/font-size-control'
import { useColorScheme } from '@/lib/useColorScheme'
import { cn } from '@/lib/utils'
import { FontSize, useFontSize } from '@/lib/use-font-size'

const Preferences = () => {
  const { isDarkColorScheme: dark } = useColorScheme()
  const { fontSize } = useFontSize()

  return (
    <>
      <SafeAreaView className="flex-1 px-4 gap-5">
        <Stack.Screen
          options={{
            headerShown: true,
            header: () => <Header dark={dark} fontSize={fontSize} />,
          }}
        />
        <View className="flex-row justify-between items-center">
          <Text
            className={cn(
              'text-xl font-medium',
              fontSize === 'small' && 'text-lg',
              fontSize === 'medium' && 'text-xl',
              fontSize === 'large' && 'text-2xl',
              dark ? 'text-[#E8E6D9]' : 'text-[#2C3526]',
            )}>
            Dark Mode
          </Text>
          <ThemeToggleSwitch />
        </View>

        <View className="gap-3">
          <Text
            className={cn(
              'text-xl font-medium',
              fontSize === 'small' && 'text-lg',
              fontSize === 'medium' && 'text-xl',
              fontSize === 'large' && 'text-2xl',
              dark ? 'text-[#E8E6D9]' : 'text-[#2C3526]',
            )}>
            Font Size
          </Text>
          <FontSizeControl dark={dark} />
        </View>
      </SafeAreaView>
    </>
  )
}

export default Preferences

const Header = ({
  dark = false,
  fontSize = 'medium',
}: {
  dark?: boolean
  fontSize?: FontSize
}) => {
  const iconSize = fontSize === 'small' ? 20 : fontSize === 'medium' ? 24 : 28

  return (
    <SafeAreaView className="px-4">
      <View className="py-3 relative flex-row items-center">
        <Pressable onPress={() => router.back()} hitSlop={50}>
          <ArrowLeft size={iconSize} color={dark ? '#E8E6D9' : '#2C3526'} />
        </Pressable>
        <Text
          className={cn(
            'absolute text-center inset-x-0 font-semibold',
            fontSize === 'small' && 'text-lg',
            fontSize === 'medium' && 'text-xl',
            fontSize === 'large' && 'text-2xl',
            dark ? 'text-[#E8E6D9]' : 'text-[#2C3526]',
          )}>
          Preferences
        </Text>
      </View>
    </SafeAreaView>
  )
}
