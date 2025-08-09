import { Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Stack, useRouter } from 'expo-router'
import { formatDate } from '@/lib/date'
import { Header } from '@/features/memoir/components/headers/new-entry'
import { useRef } from 'react'
import { PortalHost } from '@rn-primitives/portal'

const Entry = () => {
  const router = useRouter()
  const headerRef = useRef<{ closePopover: () => void }>(null)

  const handleDone = () => {
    headerRef.current?.closePopover()
    router.back()
  }

  const handleEditDate = () => {
    headerRef.current?.closePopover()
    router.push('/edit-date')
  }

  const handleDelete = () => {
    headerRef.current?.closePopover()
    console.log('Delete action')
  }

  return (
    <>
      <SafeAreaView className="flex-1 bg-[#E8E6D9] p-4">
        <PortalHost name="modal-host" />
        <Stack.Screen
          options={{
            headerShown: true,
            header: (props) => (
              <Header
                ref={headerRef}
                dateLabel={formatDate(new Date())}
                onEditDate={handleEditDate}
                onDelete={handleDelete}
                onDone={handleDone}
                {...props}
              />
            ),
          }}
        />

        
        <View className="flex-1 justify-center items-center">
          <Text className="text-[#2B311A] text-lg">
            Your entry content goes here...
          </Text>
        </View>
      </SafeAreaView>
    </>
  )
}

export default Entry
