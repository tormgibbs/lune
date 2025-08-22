import { View, Text } from 'react-native'
import LuneLogo from '@/assets/lune.svg'

const EmptyState = () => {
  return (
    <View className="absolute inset-0 items-center justify-center">
      <LuneLogo width={80} height={80} />
      <View className="space-y-1 items-center mt-2">
        <Text className="text-xl font-bold">Begin your next memory</Text>
        <Text className="text-gray-500">Capture moments, create stories.</Text>
        <Text className="text-gray-500">
          Tap the plus button to get started.
        </Text>
      </View>
    </View>
  )
}

export default EmptyState
