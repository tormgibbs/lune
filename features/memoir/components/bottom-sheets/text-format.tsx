import { View, Text, Pressable, BackHandler } from 'react-native'
import React, { useEffect } from 'react'
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Strikethrough,
  Underline,
  X,
} from 'lucide-react-native'
import { Button } from '@/components/ui/button'
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from '@gorhom/bottom-sheet'
import { Separator } from '@/components/ui/separator'
import { actions, RichEditor } from 'react-native-pell-rich-editor'
import ColorPickerButton from '@/components/color-picker-button'
import { cn } from '@/lib/utils'
import { MessageSquareQuote } from '@/lib/icons/MessageSquareQuote'

interface TextFormattingSheetProps {
  bottomSheetRef: React.RefObject<BottomSheetModal | null>
  handleBottomSheetClose: () => void
  editorRef: React.RefObject<RichEditor | null>
  onColorPickerPress: () => void
  onChange?: (index: number) => void
  selectedColor: string
  activeFormats: string[]
  dark?: boolean
}

const TextFormattingSheet = ({
  bottomSheetRef,
  handleBottomSheetClose,
  onChange,
  onColorPickerPress,
  editorRef,
  selectedColor,
  activeFormats,
  dark = false,
}: TextFormattingSheetProps) => {
  const handleClosePress = () => {
    bottomSheetRef.current?.close()
    // editorRef.current?.focusContentEditor?.()
  }

  const renderBackdrop = (props: any) => (
    <BottomSheetBackdrop
      {...props}
      pressBehavior="close"
      disappearsOnIndex={-1}
      appearsOnIndex={0}
      opacity={0.1}
    />
  )

  const sendEditorAction = (action: string) => {
    const editor = editorRef.current
    if (!editor) return
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

  useEffect(() => {
    const backAction = () => {
      if (bottomSheetRef.current) {
        bottomSheetRef.current.dismiss()
        return true
      }
      return false
    }

    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    )

    return () => subscription.remove()
  }, [bottomSheetRef])

  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      enablePanDownToClose
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
      android_keyboardInputMode="adjustPan"
      handleComponent={null}
      backdropComponent={renderBackdrop}
      enableOverDrag={false}
      onDismiss={() => editorRef.current?.focusContentEditor?.()}
      onChange={onChange}
      backgroundStyle={{
        backgroundColor: dark ? '#3A4332' : '#E8E6D9',
      }}
      style={{
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        overflow: 'hidden',
        backgroundColor: dark ? '#3A4332' : '#E8E6D9',
      }}>
      <BottomSheetView
        className={cn(
          'p-4 pb-6 rounded-t-lg',
          dark ? 'bg-[#3A4332]' : 'bg-[#E0DCCC]',
        )}>
        <View className="flex-row items-center justify-between">
          <Text
            className={cn(
              'text-2xl font-medium',
              dark ? 'text-[#E8E6D9]' : 'text-black',
            )}>
            Format
          </Text>
          <Button
            onPress={handleClosePress}
            variant="secondary"
            size="icon"
            className={cn(
              'rounded-full',
              dark ? 'bg-[#4A5340]' : 'bg-[#F5F2E3]',
            )}>
            <X color={dark ? '#B5C2A3' : '#6C7A45'} />
          </Button>
        </View>

        <View
          className={cn(
            'flex-row items-center mt-4 rounded-lg',
            dark ? 'bg-[#4A5340]' : 'bg-[#F5F2E3]',
          )}>
          <Pressable
            className={cn(
              'flex-1 items-center justify-center p-2 py-3 rounded-l-lg',
              activeFormats.includes('bold') &&
                (dark ? 'bg-[#5A6B4D]' : 'bg-[#C9D0B1]'),
            )}
            onPress={handleBoldPress}>
            <Bold
              color={
                activeFormats.includes('bold')
                  ? dark
                    ? '#E8E6D9'
                    : '#2F2F2F'
                  : dark
                    ? '#B5C2A3'
                    : '#6C7A45'
              }
              size={20}
            />
          </Pressable>

          <Separator
            orientation="vertical"
            className={cn(dark ? 'bg-[#373E31]' : 'bg-[#A8B594]')}
          />

          <Pressable
            className={cn(
              'flex-1 items-center justify-center p-2 py-3',
              activeFormats.includes('italic') &&
                (dark ? 'bg-[#5A6B4D]' : 'bg-[#C9D0B1]'),
            )}
            onPress={handleItalicPress}>
            <Italic
              color={
                activeFormats.includes('italic')
                  ? dark
                    ? '#E8E6D9'
                    : '#2F2F2F'
                  : dark
                    ? '#B5C2A3'
                    : '#6C7A45'
              }
              size={20}
            />
          </Pressable>

          <Separator
            orientation="vertical"
            className={cn(dark ? 'bg-[#373E31]' : 'bg-[#A8B594]')}
          />

          <Pressable
            className={cn(
              'flex-1 items-center justify-center p-2 py-3',
              activeFormats.includes('underline') &&
                (dark ? 'bg-[#5A6B4D]' : 'bg-[#C9D0B1]'),
            )}
            onPress={handleUnderlinePress}>
            <Underline
              color={
                activeFormats.includes('underline')
                  ? dark
                    ? '#E8E6D9'
                    : '#2F2F2F'
                  : dark
                    ? '#B5C2A3'
                    : '#6C7A45'
              }
              size={20}
            />
          </Pressable>

          <Separator
            orientation="vertical"
            className={cn(dark ? 'bg-[#373E31]' : 'bg-[#A8B594]')}
          />

          <Pressable
            className={cn(
              'flex-1 items-center justify-center p-2 py-3 rounded-r-lg',
              activeFormats.includes('strikeThrough') &&
                (dark ? 'bg-[#5A6B4D]' : 'bg-[#C9D0B1]'),
            )}
            onPress={handleStrikethroughPress}>
            <Strikethrough
              color={
                activeFormats.includes('strikeThrough')
                  ? dark
                    ? '#E8E6D9'
                    : '#2F2F2F'
                  : dark
                    ? '#B5C2A3'
                    : '#6C7A45'
              }
              size={20}
            />
          </Pressable>
        </View>

        <View className="flex-row w-full items-stretch mt-4 gap-4">
          <View
            className={cn(
              'flex-1 flex-row rounded-lg h-auto',
              dark ? 'bg-[#4A5340]' : 'bg-[#F5F2E3]',
            )}>
            <Pressable
              className={cn(
                'flex-1 items-center justify-center p-2 py-3 rounded-l-lg',
                activeFormats.includes('unorderedList') &&
                  (dark ? 'bg-[#5A6B4D]' : 'bg-[#C9D0B1]'),
              )}
              onPress={handleBulletListPress}>
              <List
                color={
                  activeFormats.includes('unorderedList')
                    ? dark
                      ? '#E8E6D9'
                      : '#2F2F2F'
                    : dark
                      ? '#B5C2A3'
                      : '#6C7A45'
                }
                size={20}
              />
            </Pressable>

            <Separator
              orientation="vertical"
              className={cn(dark ? 'bg-[#373E31]' : 'bg-[#A8B594]')}
            />

            <Pressable
              className={cn(
                'flex-1 items-center justify-center p-2 py-3 rounded-r-lg',
                activeFormats.includes('orderedList') &&
                  (dark ? 'bg-[#5A6B4D]' : 'bg-[#C9D0B1]'),
              )}
              onPress={handleOrderedListPress}>
              <ListOrdered
                color={
                  activeFormats.includes('orderedList')
                    ? dark
                      ? '#E8E6D9'
                      : '#2F2F2F'
                    : dark
                      ? '#B5C2A3'
                      : '#6C7A45'
                }
                size={20}
              />
            </Pressable>
          </View>

          <View className="flex-row justify-between gap-5">
            <Pressable
              className={cn(
                'items-center justify-center rounded-lg px-6 py-3',
                dark
                  ? 'bg-[#4A5340] active:bg-[#5A6B4D]'
                  : 'bg-[#F5F2E3] active:bg-[#C9D0B1]',
              )}
              onPress={handleQuotePress}>
              <MessageSquareQuote
                color={dark ? '#B5C2A3' : '#6C7A45'}
                size={20}
              />
            </Pressable>

            <ColorPickerButton
              color={selectedColor}
              onPress={onColorPickerPress}
            />
          </View>
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  )
}

export default TextFormattingSheet

{
  /*
  className={cn(
                'items-center justify-center bg-[#F5F2E3] rounded-lg px-6 py-3 active:bg-[#C9D0B1]',
                dark ? 'bg-[#4A5340] active:bg-[#5A6B4D]' : 'bg-[#F5F2E3] active:bg-[#C9D0B1]'
              )}
*/
}
