import { useState, forwardRef, useImperativeHandle, useRef } from 'react'
import { Modal, Pressable, Text, View } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated'
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera'
import { Button } from './ui/button'
import { RefreshCcw, Zap } from 'lucide-react-native'
import MediaPreview from './media-preview'

type CameraModalProps = {
  onClose?: () => void
  onCapture?: (uri: string) => void
  onVideoCapture?: (uri: string) => void
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

    const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null)

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
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          skipProcessing: true,
        })
        if (photo?.uri) {
          setCapturedPhoto(photo.uri)
          // onCapture?.(photo.uri)
          // setVisible(false)
        }
      } catch (err) {
        console.warn('Error taking picture:', err)
      }
    }

    const startRecording = async () => {
      if (!cameraRef.current || recordingRef.current) return
      try {
        recordingRef.current = true
        isRecording.value = true
        const video = await cameraRef.current.recordAsync()
        if (video?.uri) {
          onVideoCapture?.(video.uri)
          setVisible(false)
        }
      } catch (err) {
        console.warn('Error recording video:', err)
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
      }
    }

    const handleRelease = () => {
      if (isRecording.value) {
        stopRecording()
      } else {
        handlePressOut()
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
          setVisible(false)
          onClose?.()
        }}>
        <View className="flex-1">
          {capturedPhoto ? (
            <MediaPreview
              uri={capturedPhoto}
              onRetake={() => setCapturedPhoto(null)}
              onUse={(uri) => {
                onCapture?.(uri)
                setCapturedPhoto(null)
                setVisible(false)
              }}
            />
          ) : (
            <CameraView ref={cameraRef} style={{ flex: 1 }} facing={facing}>
              <View className="flex-1 justify-between">
                <View className="p-4">
                  <Pressable className="self-start p-2">
                    <Zap size={30} color="white" />
                  </Pressable>
                </View>
                <View className="flex-row p-4 items-center justify-between justify-self-end">
                  <Pressable
                    onPress={() => {
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
            </CameraView>
          )}
        </View>
      </Modal>
    )
  },
)

CameraModal.displayName = 'CameraModal'

export default CameraModal
