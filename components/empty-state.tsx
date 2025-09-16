import { View, Text } from 'react-native'
import LuneLogo from '@/assets/lune.svg'
import { useColorScheme } from '@/lib/useColorScheme'
import { cn } from '@/lib/utils'
import { useFontSize } from '@/lib/use-font-size'

const EmptyState = () => {
  const { isDarkColorScheme: dark } = useColorScheme()
  const { fontSize } = useFontSize()

  const titleClass = cn(
    fontSize === 'small' && 'text-lg',
    fontSize === 'medium' && 'text-xl',
    fontSize === 'large' && 'text-2xl',
  )

  const subtitleClass = cn(
    fontSize === 'small' && 'text-sm',
    fontSize === 'medium' && 'text-base',
    fontSize === 'large' && 'text-lg',
  )

  const logoSize = fontSize === 'small' ? 60 : fontSize === 'medium' ? 80 : 100

  return (
    <View className="absolute inset-0 items-center justify-center">
      <LuneLogo width={logoSize} height={logoSize} />
      <View className="space-y-1 items-center mt-2">
        <Text
          className={cn(
            'text-xl',
            titleClass,
            dark ? 'text-[#F5F4EF]' : 'text-black',
          )}>
          Begin your next memory
        </Text>
        <Text
          className={cn(
            subtitleClass,
            dark ? 'text-[#A3B587]' : 'text-gray-500',
          )}>
          Capture moments, create stories.
        </Text>
        <Text
          className={cn(
            subtitleClass,
            dark ? 'text-[#A3B587]' : 'text-gray-500',
          )}>
          Tap the plus button to get started.
        </Text>
      </View>
    </View>
  )
}

export default EmptyState
