import { View, Text, Pressable } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { MediaAsset } from '@/types/media'
import {
  FinishMode,
  IWaveformRef,
  PlayerState,
  Waveform,
} from '@simform_solutions/react-native-audio-waveform'
import { formatDuration, formatDurationWithDecimals } from '@/lib/utils'
import { Pause, Play } from 'lucide-react-native'
import { Button } from './ui/button'
import { MaterialCommunityIcons } from '@expo/vector-icons'

interface AudioPlayerProps {
  isActive: boolean
  audio: MediaAsset
  width: number
  height: number
}

const AudioPlayer = ({ audio, width, height, isActive }: AudioPlayerProps) => {
  const waveformRef = useRef<IWaveformRef>(null)
  // const [progress, setProgress] = useState(0)
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
  useEffect(() => {
    const playOrStop = async () => {
      if (!waveformRef.current) return

      if (isActive) {
        // Start or resume the player automatically when active
        if (playerState === PlayerState.paused) {
          await waveformRef.current.resumePlayer()
        } else if (playerState === PlayerState.stopped) {
          await waveformRef.current.startPlayer({ finishMode: FinishMode.stop })
        }
      } else {
        // Stop when not active
        await waveformRef.current.stopPlayer().catch(() => {})
      }
    }

    playOrStop()
  }, [isActive])

  // useEffect(() => {
  //   if (!isActive && waveformRef.current) {
  //     waveformRef.current.stopPlayer().catch(() => {})
  //   }
  // }, [isActive])

  return (
    <View
      className="flex-1 relative bg-[#E8E6D9] justify-center items-center"
      style={{ width, height }}>
      <View className="absolute w-[90%] flex-row bg-transparent p-4 rounded-lg items-center justify-center">
        <Waveform
          mode="static"
          ref={waveformRef}
          path={audio.uri}
          containerStyle={{
            height: 80,
            width: '100%',
          }}
          candleSpace={2}
          candleWidth={2}
          candleHeightScale={4}
          waveColor="#6C7A45"
          onPlayerStateChange={setPlayerState}
          // onCurrentProgressChange={(ms) => setProgress(ms)}
        />
      </View>

      <View className="flex-1 items-center justify-end pb-10 gap-3">
        {/* <Text className="font-semibold text-4xl text-[#1f2937]">
          {formatDurationWithDecimals(progress)}
        </Text> */}
        <View className="flex-row items-center justify-center gap-3">
          {/* <Pressable className='flex-row bg-transparent items-center justify-center'>
            <MaterialCommunityIcons 
              className='m-2'
              name="rewind-15" 
              size={30} 
              color="#92400e" />
          </Pressable> */}

          <Button
            onPress={handlePlayPause}
            variant="secondary"
            size="icon"
            className="bg-transparent p-10">
            {playerState === PlayerState.playing ? (
              <Pause color="#92400e" size={50} fill="#92400e" />
            ) : (
              <Play color="#92400e" size={50} fill="#92400e" />
            )}
          </Button>

          {/* <Pressable className='flex-row bg-transparent items-center justify-center'>
            <MaterialCommunityIcons
              className='m-2'
              name="fast-forward-15"
              size={30}
              color="#92400e"
            />
          </Pressable> */}
        </View>
      </View>
    </View>
  )
}

export default AudioPlayer
