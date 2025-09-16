import { Header } from '@/components/headers/entry-header'
import { formatDate } from '@/lib/date'
import { PortalHost } from '@rn-primitives/portal'
import { Stack, useRouter } from 'expo-router'
import { useRef } from 'react'
import { Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

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
      <SafeAreaView 
        className="flex-1 bg-[#E8E6D9]"
        edges={['left', 'right', 'bottom']}
      >
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


        <View className="flex-1 justify-center items-center z-[-999999]">
          <Text className="text-[#2B311A] text-lg">
            Your entry content goes here...
          </Text>
        </View>
      </SafeAreaView>
    </>
  )
}

export default Entry
