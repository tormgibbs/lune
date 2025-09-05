import { cn, formatDuration } from '@/lib/utils'
import { MediaAsset } from '@/types/media'
import { Image } from 'expo-image'
import { Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native'
import AudioWavePlayer from '../audio-wave-player'
import { Button } from '../ui/button'
import { X } from 'lucide-react-native'
import { useMediaGrid } from './media-grid-context'
import Animated, { JumpingTransition, LinearTransition } from 'react-native-reanimated'

interface MediaItemProps {
  media: MediaAsset
  onPress: () => void
  onDeletePress?: (id: string) => void
  aspect?: number
  radius?: number
  fill?: boolean
  children?: React.ReactNode
}

const MediaItem = ({
  media,
  onPress,
  aspect = 1,
  radius = 7,
  fill = false,
  children,
}: MediaItemProps) => {
  const { editable, onDeletePress } = useMediaGrid()

  const containerStyle = [
    fill ? { flex: 1 } : { aspectRatio: aspect },
    { borderRadius: radius, overflow: 'hidden' as 'hidden' },
  ]

  return (
    <Pressable onPress={onPress} style={{ flex: 1, width: '100%' }}>
      <View style={containerStyle} className="relative">
        {media.type === 'image' && (
          <Image
            source={{ uri: media.uri }}
            style={StyleSheet.absoluteFill}
            contentFit="cover"
          />
        )}

        {media.type === 'video' && (
          <>
            <Image
              source={{ uri: media.uri }}
              style={StyleSheet.absoluteFill}
              contentFit="cover"
            />
            {media.duration && (
              <Text className="absolute bottom-2 right-2 font-medium text-white drop-shadow-[0_0_10px_#000000]">
                {formatDuration(media.duration)}
              </Text>
            )}
          </>
        )}

        {media.type === 'audio' && (
          <AudioWavePlayer audio={media} style={StyleSheet.absoluteFill} />
        )}

        {children}

        {editable && (
          <Button
            hitSlop={10}
            onPress={(e) => {
              e.stopPropagation?.()
              onDeletePress?.(media.id!)
            }}
            variant="secondary"
            size="icon"
            className={cn(
              'absolute top-2 right-2 h-6 w-6 bg-gray-500 opacity-80 rounded-full',
              media.type === 'audio' ? 'h-4 w-4' : 'h-6 w-6',
            )}>
            <X color="white" size={media.type === 'audio' ? 10 : 15} />
          </Button>
        )}
      </View>
    </Pressable>
  )
}

export default MediaItem

export const AnimatedItem: React.FC<{
  children: React.ReactNode
  className?: string
}> = ({ children, className }) => {
  return (
    <Animated.View  layout={LinearTransition} className={cn('flex-1', className)}>
      {children}
    </Animated.View>
  )
}
