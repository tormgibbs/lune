import { View, Text, Pressable, Button } from 'react-native'
import React from 'react'
import { useVideoPlayer, VideoView } from 'expo-video'
import { useEvent } from 'expo'

interface VideoPlayerProps {
  uri: string
  onClose: () => void
}

const VideoPlayer = ({ uri, onClose }: VideoPlayerProps) => {
  const player = useVideoPlayer(uri, (player) => {
    player.loop = true
    player.play()
  })

  const { isPlaying } = useEvent(player, 'playingChange', {
    isPlaying: player.playing,
  })

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'black',
      }}>
      <VideoView
        style={{ width: '100%', height: 300 }}
        player={player}
        allowsFullscreen
      />
      <View style={{ flexDirection: 'row', marginTop: 20 }}>
        <Button
          title={isPlaying ? 'Pause' : 'Play'}
          onPress={() => (isPlaying ? player.pause() : player.play())}
        />
        <Pressable onPress={onClose} style={{ marginLeft: 20 }}>
          <Text style={{ color: 'white', fontSize: 18 }}>✕ Close</Text>
        </Pressable>
      </View>
    </View>
  )
}

export default VideoPlayer
