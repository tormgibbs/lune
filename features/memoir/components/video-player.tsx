import { View } from 'react-native'
import React, { useEffect } from 'react'
import { useVideoPlayer, VideoView } from 'expo-video'

interface VideoPlayerProps {
  uri: string
  isActive: boolean
  width: number
  height: number
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
      style={{ flex: 1, backgroundColor: 'black', justifyContent: 'center' }}>
      <VideoView
        style={{ width, height }}
        player={player}
        allowsFullscreen
        allowsPictureInPicture
      />
    </View>
  )
}

export default VideoPlayer
