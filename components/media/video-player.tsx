import { View, StyleSheet } from 'react-native'
import { useEffect } from 'react'
import { useVideoPlayer, VideoView } from 'expo-video'

interface VideoPlayerProps {
  uri: string
  isActive: boolean
  width: number
  height: number
  // onClose?: () => void
}

const VideoPlayer = ({ uri, isActive, width, height }: VideoPlayerProps) => {
  const player = useVideoPlayer(uri, (player) => {
    player.loop = true
    if (isActive) {
      player.play()
    }
  })

  useEffect(() => {
    if (isActive) {
      player.play()
    } else {
      player.pause()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive])

  return (
    <View
      className="flex-1 bg-black justify-center items-center"
    >
      <VideoView
        style={styles.video}
        player={player}
        allowsFullscreen
        allowsPictureInPicture
      />
    </View>
  )
}

const styles = StyleSheet.create({
  video: {
    width: '100%',
    height: '100%',
  }
})

export default VideoPlayer
