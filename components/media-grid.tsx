import React from 'react'
import { Dimensions, Pressable, StyleSheet, Text, View } from 'react-native'
import { FlashList } from '@shopify/flash-list'
import { Image } from 'expo-image'
import { MediaAsset } from '../types/media'
import { Button } from './ui/button'
import { Play, X } from 'lucide-react-native'
import { cn, formatDuration } from '@/lib/utils'
import { Waveform } from '@simform_solutions/react-native-audio-waveform'
import AudioWavePlayer from './audio-wave-player'

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
        {item.type === 'image' && (
          <Image source={{ uri: item.uri }} style={styles.image} />
        )}

        {item.type === 'video' && (
          <>
            <Image source={{ uri: item.uri }} style={styles.image} />
            <Text className="absolute bottom-2 right-2 font-medium text-white drop-shadow-[0_0_10px_#ffffff]">
              {formatDuration(item.duration)}
            </Text>
          </>
        )}

        {item.type === 'audio' && (
          <AudioWavePlayer audio={item} style={styles.image} />
          // <View
          //   className="relative bg-[#D1D9C8] justify-center items-center p-2"
          //   style={styles.image}>
          //   <View className="absolute flex-row items-center top-2 left-2 gap-2">
          //     <Button
          //       variant="secondary"
          //       size="icon"
          //       className="bg-[#6C7A45] h-6 w-6 items-center justify-center opacity-80 rounded-full">
          //       <Play color="white" size={12} fill="white" />
          //     </Button>
          //     <Text className="font-light text-white drop-shadow-[0_0_10px_#ffffff]">
          //       {formatDuration(item.duration)}
          //     </Text>
          //   </View>
          //   <Waveform
          //     mode="static"
          //     path={item.uri}
          //     containerStyle={{
          //       height: 60,
          //       width: '90%',
          //     }}
          //     candleSpace={2}
          //     candleWidth={2}
          //     candleHeightScale={4}
          //     waveColor="#6C7A45"
          //   />
          // </View>
        )}

        <Button
          onPress={(e) => {
            e.stopPropagation?.()
            onDeletePress?.(item.id!)
          }}
          variant="secondary"
          size="icon"
          className={cn(
            'absolute top-2 right-2 h-6 w-6 bg-gray-500 opacity-80 rounded-full',
            item.type === 'audio' ? 'h-4 w-4' : 'h-6 w-6',
          )}>
          <X color="white" size={item.type === 'audio' ? 10 : 15} />
        </Button>
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
