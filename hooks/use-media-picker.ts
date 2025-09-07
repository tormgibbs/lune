// import { useState } from 'react'
import * as ImagePicker from 'expo-image-picker'
import { MediaAsset } from '../types/media'
import { Alert } from 'react-native'
import { useMemoirStore } from '@/store/memoir'
import { deleteMediaFiles } from '@/lib/media'

export const useMediaPicker = (memoirId: string, maxSelection: number = 13) => {
  const memoir = useMemoirStore((s) => s.memoirs.find((m) => m.id === memoirId))

  const media = memoir?.media ?? []

  const updateMediaInStore = (newMedia: MediaAsset[]) => {
    useMemoirStore.getState().update({ id: memoirId, media: newMedia })
  }

  const addMedia = (newAssets: MediaAsset[]) => {
    if (!memoir) return

    if (media.length >= maxSelection) {
      Alert.alert(
        'Attachment Limit Reached',
        'Would you like to replace the last attachment item with the new one?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Replace',
            style: 'destructive',
            onPress: () => {
              if (newAssets.length > 0) {
                const updated = [...media]
                updated[updated.length - 1] = newAssets[0]
                updateMediaInStore(updated)
              }
            },
          },
        ],
      )
      return
    }

    const combined = [...media, ...newAssets].slice(0, maxSelection)
    updateMediaInStore(combined)
  }

  const pickMedia = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images', 'videos'],
        allowsMultipleSelection: true,
        aspect: [4, 3],
        quality: 1,
      })

      if (!result.canceled) {
        const newAssets: MediaAsset[] = result.assets.map((asset, index) => ({
          uri: asset.uri,
          type: asset.type,
          duration: asset.duration ?? undefined,
          id: `${Date.now()}_${index}`,
        }))

        const total = media.length + newAssets.length

        if (total > maxSelection) {
          Alert.alert(
            'Selection Limit',
            `You picked ${total} items, but only ${maxSelection} can be added. The extra items were not included.`,
          )
        }

        addMedia(newAssets)
      }
    } catch (error) {
      console.error('Error picking media:', error)
    }
  }

  const removeMedia = (id: string) => {
    if (!memoir) return
    const mediaToRemove = media.find((m) => m.id === id)

    if (mediaToRemove?.persisted) {
      deleteMediaFiles([mediaToRemove]).catch((err) =>
        console.warn('Failed to delete media file on remove', err),
      )
    }
    
    const filtered = media.filter((m) => m.id !== id)
    updateMediaInStore(filtered)
  }

  const clearMedia = () => {
    if (!memoir) return
    updateMediaInStore([])
  }

  return {
    media,
    pickMedia,
    removeMedia,
    addMedia,
    clearMedia,
  }
}
