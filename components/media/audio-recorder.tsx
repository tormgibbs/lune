import {
  View,
  Text,
  Pressable,
  Animated,
  Alert,
  Linking,
  BackHandler,
} from 'react-native'
import { RefObject, useEffect, useRef, useState } from 'react'
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from '@gorhom/bottom-sheet'
import {
  IWaveformRef,
  PermissionStatus,
  RecorderState,
  UpdateFrequency,
  Waveform,
  useAudioPermission,
} from '@simform_solutions/react-native-audio-waveform'
import { cn } from '@/lib/utils'

interface AudioRecorderSheetProps {
  audioSheetRef: RefObject<BottomSheetModal | null>
  onRecordingComplete?: (path: string) => void
  dark?: boolean
}

const AudioRecorderSheet = ({
  audioSheetRef,
  onRecordingComplete,
  dark = false,
}: AudioRecorderSheetProps) => {
  const waveformRef = useRef<IWaveformRef>(null)
  const [recorderState, setRecorderState] = useState(RecorderState.stopped)
  const animatedValue = useRef(new Animated.Value(0)).current
  const { checkHasAudioRecorderPermission, getAudioRecorderPermission } =
    useAudioPermission()

  const isRecording = recorderState === RecorderState.recording

  const startRecording = () => {
    setTimeout(() => {
      waveformRef.current
        ?.startRecord({
          updateFrequency: UpdateFrequency.high,
        })
        .catch((error) => {
          console.error('Recording start error:', error)
        })
    }, 0)
  }

  const handleRecorderAction = async () => {
    if (recorderState === RecorderState.stopped) {
      const hasPermission = await checkHasAudioRecorderPermission()

      if (hasPermission === PermissionStatus.granted) {
        startRecording()
      } else if (hasPermission === PermissionStatus.undetermined) {
        const permissionStatus = await getAudioRecorderPermission()
        if (permissionStatus === PermissionStatus.granted) {
          startRecording()
        }
      } else {
        Alert.alert(
          'Permission Required',
          'Microphone access is needed to record audio.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => Linking.openSettings() },
          ],
        )
        return
      }
    } else {
      waveformRef.current?.stopRecord().then((path) => {
        if (path && onRecordingComplete) {
          onRecordingComplete(path)
        }
      })
    }

    const toValue = isRecording ? 0 : 1
    Animated.spring(animatedValue, {
      toValue,
      useNativeDriver: false,
      tension: 100,
      friction: 8,
    }).start()
  }

  const borderRadius = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [50, 8],
  })

  const scale = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.6],
  })

  const renderBackdrop = (props: any) => (
    <BottomSheetBackdrop
      {...props}
      disappearsOnIndex={-1}
      appearsOnIndex={0}
      pressBehavior="close"
    />
  )

  useEffect(() => {
    const backAction = () => {
      if (audioSheetRef.current) {
        audioSheetRef.current.dismiss() // closes the sheet
        return true // prevents default back behavior
      }
      return false // let system handle it if sheet not open
    }

    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    )

    return () => subscription.remove()
  }, [audioSheetRef])

  return (
    <BottomSheetModal
      // backgroundStyle={{
      //   backgroundColor: '#E0DCCC',
      // }}
      ref={audioSheetRef}
      enablePanDownToClose
      keyboardBehavior="extend"
      backdropComponent={renderBackdrop}
      keyboardBlurBehavior="none"
      enableOverDrag={false}
      android_keyboardInputMode="adjustResize"
      handleComponent={null}
      onDismiss={() => {
        if (recorderState === RecorderState.recording) {
          waveformRef.current?.stopRecord().then((path) => {
            if (path && onRecordingComplete) {
              onRecordingComplete(path)
            }
            setRecorderState(RecorderState.stopped)
            Animated.spring(animatedValue, {
              toValue: 0,
              useNativeDriver: false,
              tension: 100,
              friction: 8,
            }).start()
          })
        } else {
          setRecorderState(RecorderState.stopped)
          Animated.spring(animatedValue, {
            toValue: 0,
            useNativeDriver: false,
            tension: 100,
            friction: 8,
          }).start()
        }
      }}
      style={{
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        overflow: 'hidden',
      }}>
      <BottomSheetView
        className={cn(
          'px-4 pb-6 pt-8',
          dark ? 'bg-[#3A4332]' : 'bg-[#E0DCCC]',
        )}>
        <View className="relative mb-2">
          {!isRecording && (
            <View className="absolute w-full h-[100px] items-center justify-center">
              <Text
                className={cn(
                  'text-lg',
                  dark ? 'text-[#B5C2A3]' : 'text-[#6C7A45]',
                )}>
                Start Audio Recording
              </Text>
            </View>
          )}

          <Waveform
            mode="live"
            ref={waveformRef}
            candleSpace={2}
            candleWidth={4}
            candleHeightScale={10}
            maxCandlesToRender={500}
            waveColor={dark ? '#B5C2A3' : '#6C7A45'}
            onRecorderStateChange={setRecorderState}
            containerStyle={{
              backgroundColor: 'transparent',
              height: 100,
              opacity: isRecording ? 1 : 0,
            }}
          />
        </View>

        <View className="items-center p-4">
          <Pressable
            className={cn(
              'p-1 rounded-full',
              dark ? 'bg-[#B5C2A3]' : 'bg-[#6C7A45]',
            )}
            onPress={handleRecorderAction}>
            <View
              className={cn(
                'p-1 rounded-full',
                dark ? 'bg-[#3A4332]' : 'bg-[#E0DCCC]',
              )}>
              <Animated.View
                className="p-8 bg-red-500"
                style={{
                  borderRadius,
                  transform: [{ scale }],
                }}
              />
            </View>
          </Pressable>
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  )
}

export default AudioRecorderSheet
