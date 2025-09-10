import { Modal, View, Text, Pressable, } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import * as ExpoStatusBar from 'expo-status-bar'

import { useEffect } from 'react'

interface TutorialModalProps {
  visible: boolean
  onClose: () => void
  onConfirm: () => void
}

const TutorialModal = ({ visible, onClose, onConfirm }: TutorialModalProps) => {
  useEffect(() => {
    if (!visible) {
      ExpoStatusBar.setStatusBarTranslucent(false)
      ExpoStatusBar.setStatusBarStyle('dark')
    }
  }, [visible])

  return (
    <>
      {visible && (
        <StatusBar
          translucent
          backgroundColor="rgba(0,0,0,0.5)"
          style="light"
        />
      )}

      <Modal
        className="bg-black p-3"
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() => {}}>
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white rounded-xl p-6 w-4/5">
            <Text className="text-lg font-semibold mb-1 text-center">
              Ready to Capture the Moment?
            </Text>

            <Text className="text-sm text-gray-500 mb-4 text-center">
              We’ll guide you through the basics so you can start creating
              memories right away!
            </Text>

            <View className="flex-row items-center justify-center gap-2">
              <Pressable
                onPress={onClose}
                className="flex-1 justify-center py-3 bg-transparent border-[1.5px] border-gray-500 rounded-xl">
                <Text className="text-center font-semibold">Skip</Text>
              </Pressable>

              <Pressable
                onPress={onConfirm}
                className="flex-1 justify-center py-3 bg-[#8BA84D] border-[1.5px] border-[#8BA84D] rounded-xl">
                <Text className="text-center font-semibold text-[#FFFFFF]">
                  Show Me
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </>
  )
}

export default TutorialModal
