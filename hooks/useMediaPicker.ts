import { useState } from 'react'
import * as ImagePicker from 'expo-image-picker'
import { MediaAsset } from '../types/media'

export const useMediaPicker = (initialMedia: MediaAsset[] = []) => {
  const [media, setMedia] = useState<MediaAsset[]>(initialMedia)

  const pickMedia = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images', 'videos'],
        allowsMultipleSelection: true,
        aspect: [4, 3],
        quality: 1,
      })

      // console.log('MediaPicker result:', JSON.stringify(result, null, 2))

      if (!result.canceled) {
        const newAssets: MediaAsset[] = result.assets.map((asset, index) => ({
          uri: asset.uri,
          type: asset.type,
          duration: asset.duration ?? undefined,
          id: `${Date.now()}_${index}`,
        }))

        setMedia((prev) => [...prev, ...newAssets])
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
    clearMedia,
    setMedia,
  }
}
