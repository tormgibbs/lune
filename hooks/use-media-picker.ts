import { useState } from 'react'
import * as ImagePicker from 'expo-image-picker'
import { MediaAsset } from '../types/media'
import { Alert } from 'react-native'
import { useMemoirStore } from '@/store/memoir'

export const useMediaPicker = (
  initialMedia: MediaAsset[] = [],
  maxSelection: number = 13,
) => {
  const [media, setMedia] = useState<MediaAsset[]>(initialMedia)

  const addMedia = (newAssets: MediaAsset[]) => {
    setMedia((prev) => {
      if (prev.length >= maxSelection) {
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
                  setMedia((current) => {
                    const updated = [...current]
                    updated[updated.length - 1] = newAssets[0]
                    return updated
                  })
                }
              },
            },
          ],
        )
        return prev
      }
      const combined = [...prev, ...newAssets]
      return combined.slice(0, maxSelection)
    })
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
    setMedia((prev) => prev.filter((item) => item.id !== id))
  }

  const clearMedia = () => {
    setMedia([])
  }

  return {
    media,
    pickMedia,
    removeMedia,
    addMedia,
    clearMedia,
    setMedia,
  }
}
