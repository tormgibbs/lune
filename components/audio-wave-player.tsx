import { View, Text, StyleProp, ViewStyle } from 'react-native'
import React, { useRef, useState } from 'react'
import { MediaAsset } from '@/types/media'
import {
  FinishMode,
  IWaveformRef,
  PlayerState,
  Waveform,
} from '@simform_solutions/react-native-audio-waveform'
import { denormalizeUri, formatDuration } from '@/lib/utils'
import { Button } from './ui/button'
import { Pause, Play } from 'lucide-react-native'

interface AudioWavePlayerProps {
  audio: MediaAsset
  style?: StyleProp<ViewStyle>
}

const AudioWavePlayer: React.FC<AudioWavePlayerProps> = ({ audio, style }) => {
  const waveformRef = useRef<IWaveformRef>(null)
  const [playerState, setPlayerState] = useState<PlayerState>(
    PlayerState.stopped,
  )

  const handlePlayPause = async () => {
    if (!waveformRef.current) return

    if (playerState === PlayerState.playing) {
      await waveformRef.current.pausePlayer()
    } else if (playerState === PlayerState.paused) {
      await waveformRef.current.resumePlayer()
    } else {
      await waveformRef.current.startPlayer({
        finishMode: FinishMode.stop,
      })
    }
  }
  return (
    <View
      className="relative bg-[#D1D9C8] justify-center items-center p-2"
      style={style}>
      <View className="absolute flex-row items-center top-2 left-2 gap-2">
        <Button
          onPress={handlePlayPause}
          variant="secondary"
          size="icon"
          className="bg-[#6C7A45] h-6 w-6 items-center justify-center opacity-80 rounded-full">
          {playerState === PlayerState.playing ? (
            <Pause color="white" size={12} fill="white" />
          ) : (
            <Play color="white" size={12} fill="white" />
          )}
        </Button>
        <Text className="font-light text-white drop-shadow-[0_0_10px_#ffffff]">
          {formatDuration(audio.duration)}
        </Text>
      </View>

      <Waveform
        mode="static"
        ref={waveformRef}
        path={denormalizeUri(audio.uri)}
        containerStyle={{ height: 60, width: '90%' }}
        candleSpace={2}
        candleWidth={2}
        candleHeightScale={4}
        waveColor="#6C7A45"
        onPlayerStateChange={setPlayerState}
      />
    </View>
  )
}

export default AudioWavePlayer
