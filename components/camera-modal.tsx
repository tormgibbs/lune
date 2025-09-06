import { useState, forwardRef, useImperativeHandle, useRef } from 'react'
import { Modal, Pressable, Text, View } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated'
import {
  CameraView,
  CameraType,
  useCameraPermissions,
  FlashMode,
} from 'expo-camera'
import { Button } from './ui/button'
import { RefreshCcw } from 'lucide-react-native'
import MediaPreview from './media-preview'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { toast, Toaster } from 'sonner-native'

type CameraModalProps = {
  onClose?: () => void
  onCapture?: (uri: string) => void
  onVideoCapture?: (uri: string, duration?: number) => void
}

export type CameraModalRef = {
  open: () => void
  close: () => void
}

const CameraModal = forwardRef<CameraModalRef, CameraModalProps>(
  ({ onClose, onCapture, onVideoCapture }, ref) => {
    const [visible, setVisible] = useState(false)
    const [facing, setFacing] = useState<CameraType>('back')
    const [permission, requestPermission] = useCameraPermissions()
    const [mode, setMode] = useState<'picture' | 'video'>('picture')
    const [capturedMediaType, setCapturedMediaType] = useState<
      'image' | 'video'
    >('image')

    const [capturedMedia, setCapturedMedia] = useState<string | null>(null)

    const [flash, setFlash] = useState<FlashMode>('off')

    const cameraRef = useRef<CameraView>(null)
    const recordingRef = useRef(false)

    const scale = useSharedValue(1)
    const borderRadius = useSharedValue(50)
    const isRecording = useSharedValue(false)

    const animatedStyle = useAnimatedStyle(() => {
      return {
        transform: [{ scale: scale.value }],
        borderRadius: borderRadius.value,
        backgroundColor: isRecording.value ? 'red' : 'white',
        width: 56,
        height: 56,
      }
    })

    const takePhoto = async () => {
      if (!cameraRef.current) return
      try {
        setMode('picture')
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          skipProcessing: false,
        })
        if (photo?.uri) {
          setCapturedMedia(photo.uri)
          setCapturedMediaType('image')
        }
      } catch (err) {
        console.warn('Error taking picture:', err)
      }
    }

    const startRecording = async () => {
      if (!cameraRef.current || recordingRef.current) return
      try {
        setMode('video')
        recordingRef.current = true
        isRecording.value = true

        await new Promise((resolve) => setTimeout(resolve, 100))

        const video = await cameraRef.current.recordAsync()
        if (video?.uri) {
          setCapturedMediaType('video')
          setCapturedMedia(video.uri)
        }
      } catch (err) {
        console.warn('Error recording video:', err)
        toast.error('Failed to record video. Please try again.', {
          id: 'camera-toast',
          position: 'bottom-center',
          invert: true,
        })
      } finally {
        recordingRef.current = false
        isRecording.value = false
      }
    }

    const handlePressIn = () => {
      scale.value = withSpring(0.85)
    }

    const handlePressOut = () => {
      if (!isRecording.value) {
        scale.value = withSpring(1, { damping: 15 })
      }
    }

    const handleLongPress = () => {
      isRecording.value = true
      scale.value = withSpring(0.7)
      borderRadius.value = withTiming(8, { duration: 200 })
      startRecording()
    }

    const stopRecording = async () => {
      if (!cameraRef.current || !recordingRef.current) return
      try {
        await cameraRef.current.stopRecording()
      } catch (err) {
        console.warn('Error stopping recording:', err)
      } finally {
        isRecording.value = false
        scale.value = withSpring(1, { damping: 15 })
        borderRadius.value = withTiming(50, { duration: 200 })
        recordingRef.current = false
        setMode('picture')
      }
    }

    const handleRelease = () => {
      if (isRecording.value) {
        stopRecording()
      } else {
        handlePressOut()
      }
    }

    const toggleFlash = () => {
      setFlash((prev) => {
        if (prev === 'off') return 'on'
        if (prev === 'on') return 'auto'
        return 'off'
      })
    }

    const getFlashIcon = (flash: FlashMode) => {
      switch (flash) {
        case 'on':
          return <MaterialCommunityIcons name="flash" size={30} color="white" />
        case 'off':
          return (
            <MaterialCommunityIcons name="flash-off" size={30} color="white" />
          )
        case 'auto':
          return (
            <MaterialCommunityIcons name="flash-auto" size={30} color="white" />
          )
        default:
          return (
            <MaterialCommunityIcons name="flash-off" size={30} color="white" />
          )
      }
    }
    useImperativeHandle(ref, () => ({
      open: async () => {
        if (!permission?.granted) {
          const { granted } = await requestPermission()
          if (!granted) return
        }
        setVisible(true)
      },
      close: () => setVisible(false),
    }))

    return (
      <Modal
        visible={visible}
        animationType="slide"
        onRequestClose={() => {
          setCapturedMedia(null)
          setCapturedMediaType('image')
          setVisible(false)
          onClose?.()
        }}>
        <View className="flex-1">
          {capturedMedia ? (
            <MediaPreview
              type={capturedMediaType}
              uri={capturedMedia}
              onRetake={() => {
                setCapturedMedia(null)
                setCapturedMediaType('image')
              }}
              onUse={(uri, type, duration) => {
                if (type === 'image') {
                  onCapture?.(uri)
                } else {
                  onVideoCapture?.(uri, duration)
                }
                setCapturedMedia(null)
                setCapturedMediaType('image')
                setVisible(false)
              }}
            />
          ) : (
            <CameraView
              ref={cameraRef}
              style={{ flex: 1 }}
              facing={facing}
              mode={mode}
              flash={flash}>
              <View className="flex-1 justify-between">
                <View className="p-4">
                  <Pressable className="self-start p-2" onPress={toggleFlash}>
                    {getFlashIcon(flash)}
                  </Pressable>
                </View>
                <View className="flex-row p-4 items-center justify-between justify-self-end">
                  <Pressable
                    onPress={() => {
                      setCapturedMedia(null)
                      setCapturedMediaType('image')
                      setVisible(false)
                      onClose?.()
                    }}>
                    <Text className="text-white text-xl">Cancel</Text>
                  </Pressable>

                  <Pressable
                    className="bg-transparent items-center justify-center border-4 border-white rounded-full"
                    onPressIn={handlePressIn}
                    onPressOut={handleRelease}
                    onLongPress={handleLongPress}
                    delayLongPress={200}
                    onPress={takePhoto}>
                    <View className="p-0.5 items-center justify-center bg-transparent rounded-full">
                      <Animated.View style={animatedStyle} />
                    </View>
                  </Pressable>

                  <Button
                    variant="secondary"
                    size="icon"
                    className="p-7 rounded-full bg-white/30"
                    onPress={() =>
                      setFacing((prev) => (prev === 'back' ? 'front' : 'back'))
                    }>
                    <RefreshCcw color="white" size={28} />
                  </Button>
                </View>
              </View>
              <Toaster offset={80} swipeToDismissDirection='left'/>
            </CameraView>
          )}
        </View>
      </Modal>
    )
  },
)

CameraModal.displayName = 'CameraModal'

export default CameraModal
