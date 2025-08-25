import * as FileSystem from 'expo-file-system'
import { MediaAsset } from '@/types/media'

export async function persistMediaAsset(asset: MediaAsset): Promise<MediaAsset> {
  const filename = asset.uri.split('/').pop()
  const newPath = `${FileSystem.documentDirectory}media/${Date.now()}_${filename}`

  await FileSystem.makeDirectoryAsync(`${FileSystem.documentDirectory}media`, {
    intermediates: true,
  }).catch(() => {})

  await FileSystem.copyAsync({ from: asset.uri, to: newPath })

  return { ...asset, uri: newPath }
}

export async function deleteMediaFiles(media: MediaAsset[] | undefined | null) {
  if (!media) return

  for (const asset of media) {
    try {
      await FileSystem.deleteAsync(asset.uri, { idempotent: true })
    } catch (err) {
      console.warn(`Failed to delete media file: ${asset.uri}`, err)
    }
  }
}
