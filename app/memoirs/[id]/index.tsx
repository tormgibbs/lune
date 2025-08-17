import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import ColourPickerSheet from '@/features/memoir/components/bottom-sheets/color-picker'
import TextFormattingSheet from '@/features/memoir/components/bottom-sheets/text-format'
import { Header } from '@/features/memoir/components/headers/new-entry'
import Toolbar from '@/features/memoir/components/toolbar'
import { formatDate } from '@/lib/date'
import { normalizeColor } from '@/lib/utils'
import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet'
import { PortalHost } from '@rn-primitives/portal'
import { FlashList } from '@shopify/flash-list'
import { Image } from 'expo-image'
import * as ImagePicker from 'expo-image-picker'
import { Stack, useLocalSearchParams, useRouter } from 'expo-router'
import { useCallback, useRef, useState } from 'react'
import {
  Dimensions,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import {
  KeyboardAwareScrollView,
  KeyboardController,
} from 'react-native-keyboard-controller'
import { RichEditor } from 'react-native-pell-rich-editor'
import { SafeAreaView } from 'react-native-safe-area-context'
import { VideoView } from 'expo-video'
import ImageView from 'react-native-image-viewing'
import VideoPlayer from '@/features/memoir/components/video-player'
import { useMediaPicker } from '@/hooks/useMediaPicker'
import { useMediaViewer } from '@/hooks/useMediaViewer'
import MediaViewer from '@/components/media-viewer'
import MediaGrid from '@/components/media-grid'
import MediaPager from '@/components/media-pager'
import AudioRecorderSheet from '@/features/memoir/components/bottom-sheets/audio-recorder'

const Index = () => {
  const router = useRouter()
  const { id } = useLocalSearchParams<{ id: string }>()

  const colorPickerSheetRef = useRef<BottomSheetModal>(null)
  const formattingSheetRef = useRef<BottomSheetModal>(null)
  const richEditorRef = useRef<RichEditor>(null)
  const headerRef = useRef<{ closePopover: () => void }>(null)
  const scrollRef = useRef<ScrollView>(null)
  const audioSheetRef = useRef<BottomSheetModal>(null)

  const [selectedColor, setSelectedColor] = useState<string>('#6C7A45')
  const [activeFormats, setActiveFormats] = useState<string[]>([])

  const { media, pickMedia, removeMedia } = useMediaPicker()
  const {
    visible: viewerVisible,
    selectedIndex,
    openViewer,
    closeViewer,
  } = useMediaViewer()

  const handleAudioRecordPress = () => {
    audioSheetRef.current?.present()
  }

  const handleCameraPress = () => {
    console.log('Camera action')
  }

  const handleSpeechPress = () => {
    console.log('Speech action')
  }

  const handleTextFormatPress = async () => {
    KeyboardController.dismiss()
    formattingSheetRef.current?.present()
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

  const handleRecordingComplete = (audioPath: string) => {
    console.log('Recording saved to:', audioPath)
    // Add to your audio list or handle as needed
  }

  const handleBottomSheetClose = () => {}

  const handleColorSelect = (color: string) => {
    setSelectedColor(color)
    richEditorRef.current?.sendAction('foreColor', 'result', color)
    colorPickerSheetRef.current?.dismiss()
  }

  const editorInitializedCallback = useCallback(() => {
    richEditorRef.current?.registerToolbar((items) => {
      const formats = items.map((i) => (typeof i === 'string' ? i : i.type))
      setActiveFormats(formats)

      const foreColorItem = items.find(
        (item): item is { type: string; value: string } =>
          typeof item === 'object' && item.type === 'foreColor',
      )
      if (foreColorItem?.value) {
        const normalizedValue = normalizeColor(foreColorItem.value)
        setSelectedColor((prevColor) =>
          prevColor !== normalizedValue ? normalizedValue : prevColor,
        )
      }
    })
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
          richEditorRef.current?.blurContentEditor()
          KeyboardController.dismiss()
          colorPickerSheetRef.current?.present()
        }}
        activeFormats={activeFormats}
      />

      <AudioRecorderSheet
        audioSheetRef={audioSheetRef}
        onRecordingComplete={handleRecordingComplete}
      />

      <MediaPager
        media={media}
        visible={viewerVisible}
        selectedIndex={selectedIndex}
        onClose={closeViewer}
      />

      <KeyboardAwareScrollView ref={scrollRef} style={{ zIndex: -1 }}>
        <View className="flex-1 p-4 pt-2">
          <MediaGrid
            media={media}
            onMediaPress={openViewer}
            numColumns={3}
            onDeletePress={removeMedia}
          />

          <Input
            // ref={titleInputRef}
            className="bg-transparent border-0 px-1 text-lg font-medium text-[#55584A]"
            placeholder="Title"
            placeholderClassName="text-[#7A7A7A]"
          />
          <Separator className="bg-[#C2C0B2]" />
          <RichEditor
            useContainer={true}
            onCursorPosition={(scrollY) => {
              scrollRef.current?.scrollTo({ y: scrollY - 30, animated: true })
            }}
            ref={richEditorRef}
            editorInitializedCallback={editorInitializedCallback}
            style={{
              flex: 1,
            }}
            placeholder="Start writing..."
            initialHeight={300}
            editorStyle={{
              backgroundColor: 'transparent',
              color: '#55584A',
              contentCSSText: 'padding: 10px 4px;',
            }}
          />
        </View>
      </KeyboardAwareScrollView>
      <Toolbar
        onAudioPress={handleAudioRecordPress}
        onCameraPress={handleCameraPress}
        onTextFormatPress={handleTextFormatPress}
        onImagesPress={pickMedia}
        onSpeechPress={handleSpeechPress}
      />
    </SafeAreaView>
  )
}

export default Index
