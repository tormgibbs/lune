import MediaHeader from '@/components/headers/media-header'
import AudioPlayer from '@/components/media/audio-player'
import DeleteBottomSheet from '@/components/modals/delete-bottom-sheet'
import VideoPlayer from '@/components/media/video-player'
import { deleteMemoir, updateMemoir } from '@/db/memoir'
import { deleteMediaFiles } from '@/lib/media'
import { useMemoirStore } from '@/store/memoir'
import { BottomSheetModal } from '@gorhom/bottom-sheet'
import { Image } from 'expo-image'
import { router, Stack, useLocalSearchParams } from 'expo-router'
import React, { useRef, useState } from 'react'
import { Dimensions, StyleSheet, View } from 'react-native'
import PagerView, {
  PagerViewOnPageSelectedEvent,
} from 'react-native-pager-view'
import { SafeAreaView } from 'react-native-safe-area-context'

const MediaViewer = () => {
  const { id, mediaIndex } = useLocalSearchParams<{
    id: string
    mediaIndex?: string
  }>()

  const memoir = useMemoirStore((s) => s.memoirs.find((m) => m.id === id))

  const media = memoir?.media ?? []
  const initialIndex = mediaIndex ? parseInt(mediaIndex as string, 10) : 0

  const { width, height } = Dimensions.get('window')

  const [currentIndex, setCurrentIndex] = useState(initialIndex)

  const handlePageSelected = (e: PagerViewOnPageSelectedEvent) => {
    setCurrentIndex(e.nativeEvent.position)
  }

  const bottomSheetRef = useRef<BottomSheetModal>(null)

  const openDeleteSheet = () => bottomSheetRef.current?.present()

  if (!memoir) return null

  const isOnlyContent =
    (memoir.media?.length ?? 0) === 1 &&
    !memoir.title?.trim() &&
    !memoir.content?.trim()

  const handleDeletePress = async () => {
    const removedItem = media[currentIndex]
    if (!removedItem) return

    const newMedia = [...media]
    newMedia.splice(currentIndex, 1)

    const wasLastItem = newMedia.length === 0

    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : 0))
    useMemoirStore.getState().update({ id: memoir.id, media: newMedia })
    bottomSheetRef.current?.close()

    if (isOnlyContent) {
      deleteMediaFiles([removedItem]).catch((err) =>
        console.warn('Failed to delete media file:', err),
      )

      try {
        useMemoirStore.getState().remove(memoir.id)
        await deleteMemoir(memoir.id)
        console.log('Deleted entire memoir:', memoir.id)
      } catch (err) {
        console.error('Failed to delete memoir from DB:', err)
      }

      router.back()
      return
    }

    if (wasLastItem) {
      router.back()
    }

    ;(async () => {
      try {
        await deleteMediaFiles([removedItem])
      } catch (err) {
        console.warn('Failed to delete media file:', err)
      }

      try {
        await updateMemoir(memoir.id, { media: newMedia })
      } catch (err) {
        console.error('Failed to update memoir media in DB:', err)
      }
    })()
  }

  const handleCancelPress = () => {
    bottomSheetRef.current?.close()
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          header: () => <MediaHeader onDeletePress={openDeleteSheet} />,
          animation: 'fade',
        }}
      />
      <SafeAreaView className="flex-1" edges={['bottom', 'left', 'right']}>
        <View className="flex-1">
          <PagerView
            style={styles.pager}
            initialPage={initialIndex}
            onPageSelected={handlePageSelected}>
            {media.map((item, index) => (
              <View className="bg-black" key={index}>
                {item.type === 'image' && (
                  <Image
                    source={{ uri: item.uri }}
                    style={styles.image}
                    contentFit="contain"
                  />
                )}

                {item.type === 'video' && (
                  <VideoPlayer
                    uri={item.uri}
                    isActive={currentIndex === index}
                    width={width}
                    height={height}
                  />
                )}

                {item.type === 'audio' && (
                  <AudioPlayer
                    key={index}
                    audio={item}
                    isActive={currentIndex === index}
                    width={width}
                    height={height}
                  />
                )}
              </View>
            ))}
          </PagerView>
          <DeleteBottomSheet
            ref={bottomSheetRef}
            isLastItem={isOnlyContent}
            mediaType={media[currentIndex]?.type}
            onDeletePress={handleDeletePress}
            onCancelPress={handleCancelPress}
          />
        </View>
      </SafeAreaView>
    </>
  )
}

export default MediaViewer

const styles = StyleSheet.create({
  pager: {
    flex: 1,
  },
  image: {
    width: '100%',
    height: '100%',
  },
})
