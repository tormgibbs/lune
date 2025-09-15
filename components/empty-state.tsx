import { View, Text } from 'react-native'
import LuneLogo from '@/assets/lune.svg'
import { useColorScheme } from '@/lib/useColorScheme'
import { cn } from '@/lib/utils'

const EmptyState = () => {
  const { isDarkColorScheme: dark } = useColorScheme()
  return (
    <View className="absolute inset-0 items-center justify-center">
      <LuneLogo width={80} height={80} />
      <View className="space-y-1 items-center mt-2">
        <Text
          className={cn(
            'text-xl font-bold',
            dark ? 'text-[#F5F4EF]' : 'text-black',
          )}>
          Begin your next memory
        </Text>
        <Text className={cn(dark ? 'text-[#A3B587]' : 'text-gray-500')}>
          Capture moments, create stories.
        </Text>
        <Text className={cn(dark ? 'text-[#A3B587]' : 'text-gray-500')}>
          Tap the plus button to get started.
        </Text>
      </View>
    </View>
  )
}

export default EmptyState
