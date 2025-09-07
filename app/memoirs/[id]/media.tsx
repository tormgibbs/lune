import { View, StyleSheet, Dimensions } from 'react-native'
import React, { useRef, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router, Stack, useLocalSearchParams } from 'expo-router'
import PagerView, {
  PagerViewOnPageSelectedEvent,
} from 'react-native-pager-view'
import { useMemoirStore } from '@/store/memoir'
import { Image } from 'expo-image'
import VideoPlayer from '@/features/memoir/components/video-player'
import AudioPlayer from '@/components/audio-player'
import MediaHeader from '@/components/media-header'
import { BottomSheetModal } from '@gorhom/bottom-sheet'
import DeleteBottomSheet from '@/components/delete-bottom-sheet'
import { deleteMemoir, updateMemoir } from '@/db/memoir'
import { deleteMediaFiles } from '@/lib/media'

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
