import { View, Text, Pressable } from 'react-native'
import React from 'react'
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  MessageSquareQuote,
  Strikethrough,
  Underline,
  X,
} from 'lucide-react-native'
import { Button } from '@/components/ui/button'
import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet'
import { Separator } from '@/components/ui/separator'
import { actions, RichEditor } from 'react-native-pell-rich-editor'
import ColorPickerButton from '@/components/color-picker-button'

interface TextFormattingSheetProps {
  bottomSheetRef: React.RefObject<BottomSheetModal | null>
  handleBottomSheetClose: () => void
  editorRef: React.RefObject<RichEditor | null>
  onColorPickerPress: () => void
  selectedColor: string
}

const TextFormattingSheet = ({
  bottomSheetRef,
  handleBottomSheetClose,
  onColorPickerPress,
  editorRef,
  selectedColor,
}: TextFormattingSheetProps) => {
  const handleClosePress = () => {
    bottomSheetRef.current?.close()
  }

  const sendEditorAction = (action: string) => {
    const editor = editorRef.current
    if (!editor) return
    editor.focusContentEditor?.()
    editor.sendAction(action, 'result')
  }

  const handleBoldPress = () => {
    sendEditorAction(actions.setBold)
  }

  const handleItalicPress = () => {
    sendEditorAction(actions.setItalic)
  }

  const handleUnderlinePress = () => {
    sendEditorAction(actions.setUnderline)
  }

  const handleStrikethroughPress = () => {
    sendEditorAction(actions.setStrikethrough)
  }

  const handleQuotePress = () => {
    sendEditorAction(actions.blockquote)
  }

  const handleOrderedListPress = () => {
    sendEditorAction(actions.insertOrderedList)
  }

  const handleBulletListPress = () => {
    sendEditorAction(actions.insertBulletsList)
  }

  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      enablePanDownToClose
      handleComponent={null}
      style={{
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        overflow: 'hidden',
      }}>
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
          <Pressable
            className="flex-1 items-center justify-center p-2 py-3"
            onPress={handleBoldPress}>
            <Bold color="#6C7A45" size={20} />
          </Pressable>

          <Separator orientation="vertical" className="bg-[#C9D0B1]" />

          <Pressable
            className="flex-1 items-center justify-center p-2 py-3"
            onPress={handleItalicPress}>
            <Italic color="#6C7A45" size={20} />
          </Pressable>

          <Separator orientation="vertical" className="bg-[#C9D0B1]" />

          <Pressable
            className="flex-1 items-center justify-center p-2 py-3"
            onPress={handleUnderlinePress}>
            <Underline color="#6C7A45" size={20} />
          </Pressable>

          <Separator orientation="vertical" className="bg-[#C9D0B1]" />

          <Pressable
            className="flex-1 items-center justify-center p-2 py-3"
            onPress={handleStrikethroughPress}>
            <Strikethrough color="#6C7A45" size={20} />
          </Pressable>
        </View>

        <View className="flex-row w-full items-stretch mt-4 gap-4">
          <View className="flex-1 flex-row items-center bg-[#F5F2E3] rounded-lg h-auto">
            <Pressable
              className="flex-1 items-center justify-center p-2 py-3"
              onPress={handleBulletListPress}>
              <List color="#6C7A45" size={20} />
            </Pressable>

            <Separator orientation="vertical" className="bg-[#C9D0B1]" />

            <Pressable
              className="flex-1 items-center justify-center p-2 py-3"
              onPress={handleOrderedListPress}>
              <ListOrdered color="#6C7A45" size={20} />
            </Pressable>
          </View>

          <View className="flex-row justify-between gap-5">
            <Pressable
              className="items-center justify-center bg-[#F5F2E3] rounded-lg px-6 py-3"
              onPress={handleQuotePress}>
              <MessageSquareQuote color="#6C7A45" size={20} />
            </Pressable>

            <ColorPickerButton color={selectedColor} onPress={onColorPickerPress} />
          </View>
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  )
}

export default TextFormattingSheet
