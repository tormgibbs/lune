import { Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Stack, useRouter } from 'expo-router'
import { formatDate } from '@/lib/date'
import { Header } from '@/features/memoir/components/headers/new-entry'
import { useRef } from 'react'

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
        
        <Stack.Screen
          options={{
            headerShown: true,
            presentation: 'formSheet',
            animation: 'slide_from_bottom',
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
        {/* Header */}
        {/* <View className="relative flex-row items-center justify-between">
        <Tag color="#6C7A45" size={24} />
        <Text className="absolute text-[#2B311A] text-xl font-medium left-1/2 transform -translate-x-1/2">
          {formatDate(new Date())}
        </Text>
        <View className="flex-row items-center gap-4">
          <Popover onOpenChange={setIsPopoverOpen}>
            <PopoverTrigger asChild>
              <Pressable
                className={isPopoverOpen ? 'opacity-50' : ''}
              >
                <CircleEllipsis color="#6C7A45" size={24} />
              </Pressable>
            </PopoverTrigger>

            <PopoverContent
              side="bottom"
              portalHost="modal-host"
              align="end"
              alignOffset={-4}
              sideOffset={8}
              className="w-48 py-0 px-0 bg-[#EDE9D5] border border-[#6C7A45]/20 rounded-2xl overflow-hidden">
              <Pressable 
                className="flex-row py-2 px-4 items-center justify-between active:bg-[#D4CDB3] rounded-t-2xl"
                onPress={() => router.push('/edit-date')}
              >
                <Text className="text-[#2B311A] text-base">Edit Date</Text>
                <CalendarDays size={20} />
              </Pressable>

              <Separator className="h-[1px] bg-[#D4CDB3]" />

              <Pressable 
                className="flex-row py-2 px-4 items-center justify-between active:bg-[#D4CDB3] rounded-b-2xl"
                onPress={handleDone}
              >
                <Text className="text-md text-[#A34B3D]">Delete</Text>
                <Trash2 size={20} color="#A34B3D" />
              </Pressable>
            </PopoverContent>
          </Popover>

          <Pressable className="active:opacity-50" onPress={handleDone}>
            <Text className="text-[#6C7A45] text-lg font-medium">Done</Text>
          </Pressable>
        </View>
      </View> */}
        {/* <Header
        dateLabel={formatDate(new Date())}
        onEditDate={() => router.push('/edit-date')}
        onDelete={() => console.log('Delete action')}
        onDone={handleDone}
      /> */}

        {/* Entry Content */}
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
