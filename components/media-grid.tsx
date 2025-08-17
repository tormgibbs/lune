import React from 'react'
import { Dimensions, Pressable, StyleSheet, Text, View } from 'react-native'
import { FlashList } from '@shopify/flash-list'
import { Image } from 'expo-image'
import { MediaAsset } from '../types/media'
import { Button } from './ui/button'
import { Play, X } from 'lucide-react-native'
import { formatDuration } from '@/lib/utils'

interface MediaGridProps {
  media: MediaAsset[]
  onMediaPress: (index: number) => void
  numColumns?: number
  onDeletePress?: (id: string) => void
}

const MediaGrid: React.FC<MediaGridProps> = ({
  media,
  onMediaPress,
  numColumns = 3,
  onDeletePress,
}) => {
  if (!media.length) return null

  const screenWidth = Dimensions.get('window').width
  const imageSize = screenWidth / numColumns - 16

  const styles = StyleSheet.create({
    image: {
      width: imageSize,
      height: imageSize,
      margin: 4,
      borderRadius: 8,
    },
    videoContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
    playIcon: {
      color: '#fff',
      fontSize: 20,
    },
  })

  const renderMediaItem = ({
    item,
    index,
  }: {
    item: MediaAsset
    index: number
  }) => (
    <Pressable onPress={() => onMediaPress(index)}>
      <View className="relative">
        <Image source={{ uri: item.uri }} style={styles.image} />
        <Button
          onPress={(e) => {
            e.stopPropagation?.()
            onDeletePress?.(item.id!)
          }}
          variant="secondary"
          size="icon"
          className="absolute top-2 right-2 h-6 w-6 bg-gray-500 opacity-80 rounded-full">
          <X color="white" size={15} />
        </Button>
        {item.type === 'video' && (
          <Text className="absolute bottom-2 right-2 font-medium text-white drop-shadow-[0_0_10px_#ffffff]">
            {formatDuration(item.duration)}
          </Text>
        )}
      </View>
    </Pressable>
  )

  return (
    <FlashList
      data={media}
      masonry
      numColumns={numColumns}
      estimatedItemSize={imageSize}
      optimizeItemArrangement
      renderItem={renderMediaItem}
      style={{ marginBottom: 12 }}
    />
  )
}

export default MediaGrid
