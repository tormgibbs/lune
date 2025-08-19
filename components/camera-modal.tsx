import { useState, forwardRef, useImperativeHandle, useRef } from 'react'
import {
  Animated,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera'
import { Button } from './ui/button'
import { RefreshCcw, Zap } from 'lucide-react-native'

type CameraModalProps = {
  onClose?: () => void
  onCapture?: (uri: string) => void
}

export type CameraModalRef = {
  open: () => void
  close: () => void
}

const CameraModal = forwardRef<CameraModalRef, CameraModalProps>(
  ({ onClose, onCapture }, ref) => {
    const [visible, setVisible] = useState(false)
    const [facing, setFacing] = useState<CameraType>('back')
    const [permission, requestPermission] = useCameraPermissions()

    const scaleAnim = useRef(new Animated.Value(1)).current
    const borderAnim = useRef(new Animated.Value(50)).current

    const [isRecording, setIsRecording] = useState(false)

    const handlePressIn = () => {
      Animated.spring(scaleAnim, {
        toValue: 0.85,
        useNativeDriver: false,
      }).start()
    }

    const handlePressOut = () => {
      if (!isRecording) {
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 3,
          useNativeDriver: false,
        }).start()
      }
    }

    const handleLongPress = () => {
      setIsRecording(true)

      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 0.7,
          useNativeDriver: false,
        }),
        Animated.timing(borderAnim, {
          toValue: 8,
          duration: 200,
          useNativeDriver: false,
        }),
      ]).start()
    }

    const stopRecording = () => {
      setIsRecording(false)

      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 3,
          useNativeDriver: false,
        }),
        Animated.timing(borderAnim, {
          toValue: 50,
          duration: 200,
          useNativeDriver: false,
        }),
      ]).start()
    }

    const handleRelease = () => {
      if (isRecording) {
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
          <CameraView style={{ flex: 1 }} facing={facing}>
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
                  className="p-1 bg-white rounded-full"
                  onPressIn={handlePressIn}
                  onPressOut={handleRelease}
                  onLongPress={handleLongPress}
                  delayLongPress={200}
                  onPress={() => {
                    if (!isRecording) {
                      // 📸 capture photo logic here
                    }
                  }}>
                  <View className="p-1 bg-black rounded-full">
                    {/* <View className="p-7 bg-white rounded-full" /> */}
                    <Animated.View
                      style={{
                        transform: [{ scale: scaleAnim }],
                        borderRadius: borderAnim,
                        backgroundColor: isRecording ? 'red' : 'white',
                        width: 56,
                        height: 56,
                      }}
                      // className="p-7 bg-white rounded-full"
                    />
                  </View>
                </Pressable>

                <Button
                  variant="secondary"
                  size="icon"
                  className="p-7 rounded-full"
                  onPress={() =>
                    setFacing((prev) => (prev === 'back' ? 'front' : 'back'))
                  }>
                  <RefreshCcw color="white" size={28} />
                </Button>
              </View>
            </View>
          </CameraView>
        </View>
      </Modal>
    )
  },
)

CameraModal.displayName = 'CameraModal'

const styles = StyleSheet.create({
  controls: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
  },
  text: {
    fontSize: 18,
    color: 'white',
  },
})

export default CameraModal
