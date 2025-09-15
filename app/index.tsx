import 'react-native-get-random-values'
import FloatingActionButton from '@/components/floating-action-button'
import Header from '@/components/header'
import { router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRef, useState } from 'react'
import { nanoid } from 'nanoid'
import { createBlankMemoir, useMemoirStore } from '@/store/memoir'
import EmptyState from '@/components/empty-state'
import { FlashList } from '@shopify/flash-list'
import MemoirItem from '@/components/memoir-item'
import { View } from 'react-native'
import dayjs from 'dayjs'
import { useMemoirActions } from '@/hooks/use-memoir-actions'
import { BottomSheetProvider } from '@/components/bottom-sheet-provider'
import { useTutorial } from '@/hooks/use-tutorial'
import TutorialModal from '@/components/tutorial-modal'
import * as FileSystem from 'expo-file-system'

export default function Index() {
  const memoirs = useMemoirStore((s) => s.memoirs)
  const dbLoaded = useMemoirStore((s) => s.loaded)
  const headerRef = useRef<{ closePopover: () => void }>(null)
  const { handleEdit, handleDelete } = useMemoirActions()

  // const [showTutorialModal, setShowTutorialModal] = useState(true)

  const { showTutorialModal, markTutorialSeen } = useTutorial()

  const visibleMemoirs = memoirs.filter(
    (m) =>
      (m.title && m.titleVisible) ||
      (m.content && m.content.trim() !== '') ||
      (m.media && m.media.length > 0),
  )

  const showEmptyState = dbLoaded && visibleMemoirs.length === 0

  const handleShowTutorial = async () => {
    await markTutorialSeen()
    // setShowTutorialModal(false)
    router.push('/tutorial')
  }

  const handleSkipTutorial = async () => {
    await markTutorialSeen()
    // setShowTutorialModal(false)
  }

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
    router.push('/preferences')
  }

  async function debugListMediaFiles() {
    console.log('Listing persisted media files...')
    const dir = `${FileSystem.documentDirectory}media`
    const files = await FileSystem.readDirectoryAsync(dir)
    console.log('Persisted files:', JSON.stringify(files, null, 2))
  }

  const handleNewEntryPress = () => {
    // debugListMediaFiles()
    const id = nanoid(8)
    const today = dayjs().format('YYYY-MM-DD')

    useMemoirStore.getState().add(createBlankMemoir(id, today))

    router.navigate({
      pathname: '/memoirs/[id]',
      params: { id, date: today },
    })
  }

  console.log('show empty state', showEmptyState)

  return (
    <SafeAreaView className="relative flex-1 items-center">
      <TutorialModal
        visible={showTutorialModal}
        onClose={handleSkipTutorial}
        onConfirm={handleShowTutorial}
      />

      <BottomSheetProvider>
        <View className="px-4 pt-4">
          <Header
            ref={headerRef}
            onBackupSyncPress={handleBackupSyncPress}
            onNotificationsPress={handleNotificationsPress}
            onPreferencesPress={handlePreferencesPress}
          />
        </View>

        {showEmptyState ? (
          <EmptyState />
        ) : (
          <View className="flex-1 w-full">
            <FlashList
              data={visibleMemoirs}
              renderItem={({ item }) => (
                <MemoirItem
                  memoir={item}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onMediaPress={(mediaIndex) =>
                    router.push({
                      pathname: '/memoirs/[id]/media',
                      params: { id: item.id, mediaIndex },
                    })
                  }
                />
              )}
              keyExtractor={(item) => item.id}
              ItemSeparatorComponent={() => <View className="h-4" />}
              contentContainerStyle={{ zIndex: -1, paddingBottom: 50 }}
            />
          </View>
        )}

        <FloatingActionButton onPress={handleNewEntryPress} />
      </BottomSheetProvider>
    </SafeAreaView>
  )
}

// 10, 11, 6