import { View, Text, Pressable } from 'react-native'
import React from 'react'
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Logs,
  MessageSquareQuote,
  Strikethrough,
  Underline,
  X,
} from 'lucide-react-native'
import { Button } from '@/components/ui/button'
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet'
import { Separator } from '@/components/ui/separator'

interface TextFormattingSheetProps {
  bottomSheetRef: React.RefObject<BottomSheet | null>
  handleBottomSheetClose: () => void
}

const TextFormattingSheet = ({
  bottomSheetRef,
  handleBottomSheetClose,
}: TextFormattingSheetProps) => {
  const handleClosePress = () => {
    bottomSheetRef.current?.close()
  }

  return (
    <BottomSheet
      ref={bottomSheetRef}
      enablePanDownToClose
      index={-1}
      handleComponent={null}
      onClose={handleBottomSheetClose}
    >
      <BottomSheetView className="p-4 pb-6 bg-[#E0DCCC] rounded-t-lg">
        <View className="flex-row items-center justify-between">
          <Text className="text-2xl font-medium">Format</Text>
          <Button
            onPress={handleClosePress}
            variant="secondary"
            size="icon"
            className="bg-[#F5F2E3] rounded-full">
            <X color="#6C7A45" />
          </Button>
        </View>

        <View className="flex-row items-center mt-4 bg-[#F5F2E3] rounded-lg">
          <Pressable className="flex-1 items-center justify-center p-2 py-3">
            <Bold color="#6C7A45" size={20} />
          </Pressable>

          <Separator orientation="vertical" className="bg-[#C9D0B1]" />

          <Pressable className="flex-1 items-center justify-center p-2 py-3">
            <Italic color="#6C7A45" size={20} />
          </Pressable>

          <Separator orientation="vertical" className="bg-[#C9D0B1]" />

          <Pressable className="flex-1 items-center justify-center p-2 py-3">
            <Underline color="#6C7A45" size={20} />
          </Pressable>

          <Separator orientation="vertical" className="bg-[#C9D0B1]" />

          <Pressable className="flex-1 items-center justify-center p-2 py-3">
            <Strikethrough color="#6C7A45" size={20} />
          </Pressable>
        </View>

        <View className="flex-row w-full items-stretch mt-4 gap-2">
          <View className="flex-1 flex-row items-center bg-[#F5F2E3] rounded-lg h-auto">
            <Pressable className="flex-1 items-center justify-center p-2 py-3">
              <List color="#6C7A45" size={20} />
            </Pressable>

            <Separator orientation="vertical" className="bg-[#C9D0B1]" />

            <Pressable className="flex-1 items-center justify-center p-2 py-3">
              <Logs color="#6C7A45" size={20} />
            </Pressable>

            <Separator orientation="vertical" className="bg-[#C9D0B1]" />

            <Pressable className="flex-1 items-center justify-center p-2 py-3">
              <ListOrdered color="#6C7A45" size={20} />
            </Pressable>
          </View>

          <View className="flex-row bg-[#F5F2E3] items-center justify-between rounded-lg">
            <Pressable className="items-center justify-center px-4 py-3">
              <MessageSquareQuote color="#6C7A45" size={20} />
            </Pressable>

            <Separator orientation="vertical" className="bg-[#C9D0B1]" />

            <Pressable className="items-center justify-center px-4 py-3">
              <MessageSquareQuote color="#6C7A45" size={20} />
            </Pressable>
          </View>
        </View>
      </BottomSheetView>
    </BottomSheet>
  )
}

export default TextFormattingSheet
