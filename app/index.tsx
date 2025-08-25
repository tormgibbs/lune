import 'react-native-get-random-values'
import FloatingActionButton from '@/components/floating-action-button'
import Header from '@/components/header'
import { router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRef } from 'react'
import { nanoid } from 'nanoid'
import { useMemoirStore } from '@/store/memoir'
import EmptyState from '@/components/empty-state'
import { FlashList } from '@shopify/flash-list'
import MemoirItem from '@/components/memoir-item'
import { View } from 'react-native'
import { deleteMemoir } from '@/db/memoir'
import dayjs from 'dayjs'

export default function Index() {
  const memoirs = useMemoirStore((s) => s.memoirs)
  const remove = useMemoirStore((s) => s.remove)
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

  const handleNewEntryPress = () => {
    const id = nanoid(8)
    const today = dayjs().format('YYYY-MM-DD')
    console.log('Creating new memoir entry with id:', id, 'and date:', today)
    router.push({
      pathname: '/memoirs/[id]',
      params: { id, date: today }
    })
  }

  const handleDelete = async (id: string) => {
    try {
      // memoirItemRef.current?.closePopover()
      await deleteMemoir(id)
      remove(id)
    } catch (err) {
      console.error('Failed to delete memoir:', err)
    }
  }

  const handleEdit = (id: string) => {
    // memoirItemRef.current?.closePopover()
    router.push(`/memoirs/${id}`)
  }

  // console.log('Memoirs:', JSON.stringify(memoirs, null, 2))

  return (
    <SafeAreaView className="relative bg-[#F5F4EF] flex-1 items-center">
      {/* <PortalHost name='root-secondary-host'/> */}
      {/* Header */}
      <View className="px-4 pt-4">
        <Header
          ref={headerRef}
          onBackupSyncPress={handleBackupSyncPress}
          onNotificationsPress={handleNotificationsPress}
          onPreferencesPress={handlePreferencesPress}
        />
      </View>

      {/* Center */}
      {memoirs.length === 0 ? (
        <EmptyState />
      ) : (
        <View className="flex-1 w-full">
          <FlashList
            data={memoirs}
            renderItem={({ item }) => (
              <MemoirItem
                memoir={item}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            )}
            keyExtractor={(item) => item.id}
            ItemSeparatorComponent={() => <View className="h-4" />}
            contentContainerStyle={{ zIndex: -1 }}
          />
        </View>
      )}

      {/* FAB */}
      <FloatingActionButton onPress={handleNewEntryPress} />
    </SafeAreaView>
  )
}
