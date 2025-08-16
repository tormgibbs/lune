import {
  KeyboardAvoidingView,
  Platform,
  TextInput,
  View,
  Pressable,
  Text,
  Keyboard,
  Button,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import {
  Stack,
  useRouter,
  useLocalSearchParams,
  useFocusEffect,
} from 'expo-router'
import { formatDate } from '@/lib/date'
import { Header } from '@/features/memoir/components/headers/new-entry'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { PortalHost } from '@rn-primitives/portal'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import Toolbar from '@/features/memoir/components/toolbar'
import BottomSheet, {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView,
} from '@gorhom/bottom-sheet'
import {
  KeyboardAwareScrollView,
  KeyboardController,
} from 'react-native-keyboard-controller'
import TextFormattingSheet from '@/features/memoir/components/bottom-sheets/text-format'
import { RichEditor, RichToolbar, actions } from 'react-native-pell-rich-editor'
import ColorPicker, { Panel5 } from 'reanimated-color-picker'
import ColourPickerSheet from '@/features/memoir/components/bottom-sheets/color-picker'

const Index = () => {
  const { id } = useLocalSearchParams<{ id: string }>()
  const colorPickerSheetRef = useRef<BottomSheetModal>(null)
  const formattingSheetRef = useRef<BottomSheetModal>(null)
  const richEditorRef = useRef<RichEditor>(null)
  const router = useRouter()
  const headerRef = useRef<{ closePopover: () => void }>(null)

  const [selectedColor, setSelectedColor] = useState<string>('#6C7A45')

  const handleAudioRecordPress = () => {
    console.log(actions)
    console.log('Audio record action')
  }

  const handleImagePress = () => {
    richEditorRef.current?.command('bold')
    console.log('Image action')
  }

  const handleCameraPress = () => {
    console.log('Camera action')
  }

  const handleSpeechPress = () => {
    console.log('Speech action')
  }

  const handleTextFormatPress = async () => {
    await KeyboardController.dismiss({ keepFocus: true })
    formattingSheetRef.current?.present()
    console.log('Text format action')
  }

  // const titleInputRef = useRef<TextInput>(null)

  const handleDone = () => {
    headerRef.current?.closePopover()
    router.back()
  }

  const handleEditDate = () => {
    headerRef.current?.closePopover()
    router.push(`/memoirs/${id}/edit-date`)
  }

  const handleDelete = () => {
    headerRef.current?.closePopover()
    console.log('Delete action')
  }

  const handleBottomSheetClose = () => {}

  const handleColorSelect = (color: string) => {
    console.log('Selected color:', color)
    setSelectedColor(color)
    colorPickerSheetRef.current?.dismiss()
  }

  const editorInitializedCallback = useCallback(() => {
    console.log('Editor initialized')
    // richEditorRef.current?.command('bold')
  }, [])

  // useFocusEffect(
  //   useCallback(() => {
  //     const timer = setTimeout(() => {
  //       titleInputRef.current?.focus()
  //     }, 100)

  //     return () => clearTimeout(timer)
  //   }, []),
  // )

  return (
    <SafeAreaView
      className="flex-1 bg-[#E8E6D9]"
      edges={['left', 'right', 'bottom']}>
      <PortalHost name="memoirs-host" />
      <Stack.Screen
        options={{
          headerShown: true,
          header: (props) => (
            <Header
              ref={headerRef}
              dateLabel={formatDate(new Date())}
              onEditDate={handleEditDate}
              onDelete={handleDelete}
              onDone={handleDone}
              {...props}
            />
          ),
        }}
      />

      <ColourPickerSheet
        bottomSheetRef={colorPickerSheetRef}
        onColorSelect={handleColorSelect}
        selectedColor={selectedColor}
      />

      <TextFormattingSheet
        selectedColor={selectedColor}
        bottomSheetRef={formattingSheetRef}
        handleBottomSheetClose={handleBottomSheetClose}
        editorRef={richEditorRef}
        onColorPickerPress={() => {
          console.log('Color picker pressed')
          colorPickerSheetRef.current?.present()
        }}
      />

      <KeyboardAwareScrollView style={{ zIndex: -1 }}>
        <View className="flex-1 p-4 pt-2">
          <Input
            // ref={titleInputRef}
            className="bg-transparent border-0 px-1 text-lg font-medium text-[#55584A]"
            placeholder="Title"
            placeholderClassName="text-[#7A7A7A]"
          />
          <Separator className="bg-[#C2C0B2]" />
          <RichEditor
            ref={richEditorRef}
            editorInitializedCallback={editorInitializedCallback}
            style={{
              flex: 1,
              // backgroundColor: 'black',
              borderColor: '#C2C0B2',
              borderWidth: 1,
              borderRadius: 8,
            }}
            placeholder="Start writing..."
            initialHeight={300}
            editorStyle={{
              backgroundColor: 'transparent',
              color: '#55584A',
            }}
          />
          {/* <Input
              className="flex-1 bg-transparent border-0 px-1 text-lg text-[#55584A]"
              placeholder="Start writing..."
              multiline
              placeholderClassName="text-[#7A7A7A]"
              textAlignVertical="top"
            /> */}
        </View>
      </KeyboardAwareScrollView>
      <Toolbar
        onAudioPress={handleAudioRecordPress}
        onCameraPress={handleCameraPress}
        onTextFormatPress={handleTextFormatPress}
        onImagesPress={handleImagePress}
        onSpeechPress={handleSpeechPress}
      />
    </SafeAreaView>
  )
}

export default Index
