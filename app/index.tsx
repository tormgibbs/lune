import FloatingActionButton from '@/components/floating-action-button'
import Header from '@/components/header'
import { router } from 'expo-router'
import { Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import LuneLogo from '@/assets/lune.svg'
import { useRef } from 'react'

export default function Index() {
  const headerRef = useRef<{ closePopover: () => void }>(null)

  const handleBackupSyncPress = () => {
    headerRef.current?.closePopover()
    console.log('Backup/Sync action')
  }

  const handleNotificationsPress = () => {
    headerRef.current?.closePopover()
    console.log('Notifications action')
  }

  const handlePreferencesPress = () => {
    headerRef.current?.closePopover()
    console.log('Preferences action')
  }

  return (
    <SafeAreaView className="relative bg-[#F5F4EF] p-4 flex-1 items-center">
      {/* Header */}
      <Header 
        ref={headerRef}
        onBackupSyncPress={handleBackupSyncPress}
        onNotificationsPress={handleNotificationsPress}
        onPreferencesPress={handlePreferencesPress}
      />

      {/* Center */}
      <View className="absolute inset-0 items-center justify-center">
        <LuneLogo width={80} height={80} />
        <View className="space-y-1 items-center mt-2">
          <Text className="text-xl font-bold">Begin your next memory</Text>
          <Text className="text-gray-500">
            Capture moments, create stories.
          </Text>
          <Text className="text-gray-500">
            Tap the plus button to get started.
          </Text>
        </View>
      </View>

      {/* FAB */}
      <FloatingActionButton onPress={() => router.push('/entry')}/>
    </SafeAreaView>
  )
}
