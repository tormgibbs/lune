import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import ColourPickerSheet from '@/features/memoir/components/bottom-sheets/color-picker'
import TextFormattingSheet from '@/features/memoir/components/bottom-sheets/text-format'
import { Header } from '@/features/memoir/components/headers/new-entry'
import Toolbar from '@/features/memoir/components/toolbar'
import { formatDate } from '@/lib/date'
import { normalizeColor } from '@/lib/utils'
import { BottomSheetModal } from '@gorhom/bottom-sheet'
import { PortalHost } from '@rn-primitives/portal'
import {
  Stack,
  useFocusEffect,
  useLocalSearchParams,
  useRouter,
} from 'expo-router'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { TextInput, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import {
  KeyboardAwareScrollView,
  KeyboardController,
} from 'react-native-keyboard-controller'
import { RichEditor } from 'react-native-pell-rich-editor'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useMediaPicker } from '@/hooks/useMediaPicker'
import { useMediaViewer } from '@/hooks/useMediaViewer'
import MediaGrid from '@/components/media-grid'
import MediaPager from '@/components/media-pager'
import AudioRecorderSheet from '@/features/memoir/components/bottom-sheets/audio-recorder'
import { MediaAsset } from '@/types/media'
import { createAudioPlayer } from 'expo-audio'
import CameraModal, { CameraModalRef } from '@/components/camera-modal'
import VoiceInputSheet from '@/features/memoir/components/bottom-sheets/voice-input'
import { useMemoirStore } from '@/store/memoir'
import { MemoirInsert } from '@/db/schema'
import { addMemoir, updateMemoir } from '@/db/memoir'

const Index = () => {
  const router = useRouter()
  const { id, date } = useLocalSearchParams<{ id: string; date: string }>()

  const colorPickerSheetRef = useRef<BottomSheetModal>(null)
  const formattingSheetRef = useRef<BottomSheetModal>(null)
  const richEditorRef = useRef<RichEditor>(null)
  const headerRef = useRef<{ closePopover: () => void }>(null)
  const scrollRef = useRef<ScrollView>(null)
  const audioSheetRef = useRef<BottomSheetModal>(null)
  const cameraRef = useRef<CameraModalRef>(null)
  const voiceInputSheetRef = useRef<BottomSheetModal>(null)

  const [selectedColor, setSelectedColor] = useState<string>('#6C7A45')
  const [activeFormats, setActiveFormats] = useState<string[]>([])
  const [titleVisible, setTitleVisible] = useState(true)
  const today = useMemo(() => new Date().toISOString().split('T')[0], [])
  const { memoirs, add, update } = useMemoirStore()
  const existingMemoir = memoirs.find((m) => m.id === id)

  const selectedDate = date && date.length > 0 ? date : today

  const titleRef = useRef('')
  const contentRef = useRef('')

  
  const { media, pickMedia, removeMedia, setMedia } = useMediaPicker()
  const {
    visible: viewerVisible,
    selectedIndex,
    openViewer,
    closeViewer,
  } = useMediaViewer()

  

  const saveMemoir = async () => {
    const title = titleRef.current.trim()
    const content = contentRef.current.trim()

    if (!title && !content) return

    const memoir: MemoirInsert = {
      id,
      title,
      content,
      date: selectedDate,
      createdAt: existingMemoir?.createdAt ?? new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    try {
      if (existingMemoir) {
        await updateMemoir(id, memoir)
        update(memoir)
      } else {
        await addMemoir(memoir)
        add(memoir)
      }
      console.log('Memoir saved:', memoir)
    } catch (error) {
      console.error('Failed to save memoir:', error)
    }
  }

  const handleAudioRecordPress = () => {
    richEditorRef.current?.blurContentEditor()
    audioSheetRef.current?.present()
  }

  const handleCameraPress = () => {
    cameraRef.current?.open()
  }

  const handleSpeechPress = () => {
    richEditorRef.current?.blurContentEditor()
    voiceInputSheetRef.current?.present()
  }

  const handleTextFormatPress = async () => {
    await KeyboardController.dismiss()
    formattingSheetRef.current?.present()
  }

  const titleInputRef = useRef<TextInput>(null)

  const handleDone = () => {
    headerRef.current?.closePopover()
    saveMemoir()
    router.back()
  }

  const handleEditDate = () => {
    titleInputRef.current?.blur()
    richEditorRef.current?.blurContentEditor()
    KeyboardController.dismiss()
    headerRef.current?.closePopover()
    router.push({
      pathname: '/memoirs/[id]/edit-date',
      params: { id, date: selectedDate },
    })
  }

  const handleDelete = () => {
    headerRef.current?.closePopover()
    console.log('Delete action')
  }

  const handleRecordingComplete = async (audioPath: string) => {
    console.log('Recording saved to:', audioPath)

    const player = createAudioPlayer({ uri: audioPath })

    await new Promise<void>((resolve) => {
      const checkLoaded = () => {
        if (player.isLoaded) {
          resolve()
        } else {
          setTimeout(checkLoaded, 100)
        }
      }
      checkLoaded()
    })

    const duration = player.duration * 1000
    player.remove()

    const newAudio: MediaAsset = {
      uri: audioPath,
      type: 'audio',
      id: `${Date.now()}_audio`,
      duration,
    }

    console.log('New audio added:', newAudio)

    setMedia((prev) => [...prev, newAudio])
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

  useEffect(() => {
    if (existingMemoir) {
      titleRef.current = existingMemoir.title ?? ''
      contentRef.current = existingMemoir.content ?? ''
    }
  }, [existingMemoir])

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
              dateLabel={formatDate(new Date(selectedDate))}
              onEditDate={handleEditDate}
              onDelete={handleDelete}
              onDone={handleDone}
              onHideTitle={() => {
                headerRef.current?.closePopover()
                setTitleVisible((prev) => !prev)
              }}
              titleVisible={titleVisible}
              {...props}
            />
          ),
        }}
      />

      <CameraModal
        ref={cameraRef}
        onCapture={(uri) => {
          console.log('Photo captured:', uri)
          const newPhoto: MediaAsset = {
            uri,
            type: 'image',
            id: `${Date.now()}_photo`,
          }
          setMedia((prev) => [...prev, newPhoto])
        }}
        onVideoCapture={(uri, duration) => {
          console.log('Video captured:', uri)
          const newVideo: MediaAsset = {
            uri,
            type: 'video',
            id: `${Date.now()}_video`,
            duration,
          }
          setMedia((prev) => [...prev, newVideo])
        }}
        onClose={() => console.log('Camera closed')}
      />

      <ColourPickerSheet
        bottomSheetRef={colorPickerSheetRef}
        onColorSelect={handleColorSelect}
        selectedColor={selectedColor}
      />

      <VoiceInputSheet
        bottomSheetRef={voiceInputSheetRef}
        onTranscript={(transcript) => {
          console.log('Transcript received:', transcript)
          richEditorRef.current?.insertText(transcript + ' ')
        }}
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

          {titleVisible && (
            <>
              <Input
                ref={titleInputRef}
                defaultValue={existingMemoir?.title || ''}
                onChangeText={(text) => {
                  titleRef.current = text
                }}
                autoFocus
                className="bg-transparent border-0 px-1 text-lg font-medium text-[#55584A]"
                placeholder="Title"
                placeholderClassName="text-[#7A7A7A]"
              />
              <Separator className="bg-[#C2C0B2]" />
            </>
          )}

          <RichEditor
            keyboardDisplayRequiresUserAction={false}
            useContainer={true}
            initialContentHTML={existingMemoir?.content || ''}
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
            onChange={(html) => {
              contentRef.current = html
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
