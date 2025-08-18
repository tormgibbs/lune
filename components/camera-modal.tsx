import { useState, forwardRef, useImperativeHandle } from 'react'
import {
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
      <Modal visible={visible} animationType="slide">
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

                <View className="p-1 bg-white rounded-full">
                  <View className="p-1 bg-black rounded-full">
                    <View className="p-7 bg-white rounded-full" />
                  </View>
                </View>

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
