import { View, Text, Pressable } from 'react-native'
import { Image } from 'expo-image'
import { useVideoPlayer, VideoView } from 'expo-video'
import { Pause, Play } from 'lucide-react-native'
import { useEvent } from 'expo'

interface MediaPreviewProps {
  uri: string
  type: 'image' | 'video'
  onRetake: () => void
  onUse: (uri: string, type: 'image' | 'video') => void
}

const MediaPreview = ({ uri, type, onRetake, onUse }: MediaPreviewProps) => {
  const player = useVideoPlayer(uri, (player) => {
    player.loop = true
  })

  const { isPlaying } = useEvent(player, 'playingChange', {
    isPlaying: player.playing,
  })

  const togglePlay = () => {
    if (isPlaying) {
      player.pause()
    } else {
      player.play()
    }
  }

  return (
    <View className="flex-1 bg-black">
      {type === 'video' ? (
        <VideoView
          style={{ flex: 1 }}
          player={player}
          allowsFullscreen={false}
          nativeControls={false}
        />
      ) : (
        <Image source={{ uri }} style={{ flex: 1 }} contentFit="contain" />
      )}
      <View className="flex-row items-center justify-between p-4 bg-black/70">
        <Pressable onPress={onRetake} className="px-6 py-3">
          <Text className="text-white font-medium text-lg">Retake</Text>
        </Pressable>

        {type === 'video' && (
          <Pressable onPress={togglePlay} className="border-2">
            {isPlaying ? (
              <Pause size={40} fill="white" />
            ) : (
              <Play size={40} fill="white" />
            )}
          </Pressable>
        )}

        <Pressable onPress={() => onUse(uri, type)} className="px-6 py-3">
          <Text className="text-white font-medium text-lg">
            Use {type === 'video' ? 'Video' : 'Photo'}
          </Text>
        </Pressable>
      </View>
    </View>
  )
}

export default MediaPreview
