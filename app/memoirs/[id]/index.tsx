import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import ColourPickerSheet from '@/features/memoir/components/bottom-sheets/color-picker'
import TextFormattingSheet from '@/features/memoir/components/bottom-sheets/text-format'
import { Header } from '@/features/memoir/components/headers/new-entry'
import Toolbar from '@/features/memoir/components/toolbar'
import { formatDate } from '@/lib/date'
import { deriveCategories, normalizeColor } from '@/lib/utils'
import { BottomSheetModal } from '@gorhom/bottom-sheet'
import { PortalHost } from '@rn-primitives/portal'
import {
  Stack,
  useLocalSearchParams,
  useNavigation,
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
import { useMediaPicker } from '@/hooks/use-media-picker'
import AudioRecorderSheet from '@/features/memoir/components/bottom-sheets/audio-recorder'
import { MediaAsset } from '@/types/media'
import { createAudioPlayer } from 'expo-audio'
import CameraModal, { CameraModalRef } from '@/components/camera-modal'
import VoiceInputSheet from '@/features/memoir/components/bottom-sheets/voice-input'
import { useMemoirStore } from '@/store/memoir'
import { MemoirInsert } from '@/db/schema'
import { upsertMemoir } from '@/db/memoir'
import Lazy from '@/components/lazy'
import { persistMediaAsset } from '@/lib/media'
import ResponsiveMediaGrid from '@/components/responsive-media-grid'
import { useMemoirActions } from '@/hooks/use-memoir-actions'

const Index = () => {
  const router = useRouter()
  const navigation = useNavigation()

  const { id, date } = useLocalSearchParams<{ id: string; date: string }>()

  const { memoirs, update, remove } = useMemoirStore()
  const existingMemoir = memoirs.find((m) => m.id === id)

  const titleRef = useRef(existingMemoir?.title ?? '')
  const contentRef = useRef(existingMemoir?.content ?? '')
  const titleVisibleRef = useRef(existingMemoir?.titleVisible ?? true)
  const mediaRef = useRef<MediaAsset[]>([])

  // const initialContent = existingMemoir?.content ?? ''

  const [title, setTitle] = useState(titleRef.current)
  const [titleVisible, setTitleVisible] = useState(titleVisibleRef.current)
  const { media, pickMedia, removeMedia, addMedia } = useMediaPicker(id)

  // const titleRef = useRef(title)
  // const contentRef = useRef(initialContent)
  const doneRef = useRef(false)

  const colorPickerSheetRef = useRef<BottomSheetModal>(null)
  const formattingSheetRef = useRef<BottomSheetModal>(null)
  const richEditorRef = useRef<RichEditor>(null)
  const scrollRef = useRef<ScrollView>(null)
  const audioSheetRef = useRef<BottomSheetModal>(null)
  const cameraRef = useRef<CameraModalRef>(null)
  const voiceInputSheetRef = useRef<BottomSheetModal>(null)

  const [selectedColor, setSelectedColor] = useState<string>('#6C7A45')
  const [activeFormats, setActiveFormats] = useState<string[]>([])
  // const [titleVisible, setTitleVisible] = useState(
  //   existingMemoir?.titleVisible ?? true,
  // )
  const today = useMemo(() => new Date().toISOString().split('T')[0], [])

  const selectedDate = useMemo(() => {
    if (typeof date === 'string' && date.length > 0) return date
    if (existingMemoir?.date) return existingMemoir.date
    return today
  }, [date, existingMemoir?.date, today])

  // const { media, pickMedia, removeMedia, addMedia } = useMediaPicker(id)

  const { handleDelete: deleteMemoir } = useMemoirActions()

  const saveMemoir = async () => {
    const title = titleRef.current.trim()
    const content = contentRef.current.trim()
    const currentMedia = mediaRef.current

    const isEmpty =
      (!titleVisible || title.length === 0) &&
      content.length === 0 &&
      currentMedia.length === 0

    if (isEmpty) {
      try {
        await deleteMemoir(id)
        remove(id)
        console.log('Memoir deleted:', id)
      } catch (error) {
        console.error('Failed to delete memoir:', error)
      }
      return
    }

    const { newMedia, persistedMedia } = currentMedia.reduce(
      (acc, m) => {
        if (m.persisted) acc.persistedMedia.push(m)
        else acc.newMedia.push(m)
        return acc
      },
      { newMedia: [] as MediaAsset[], persistedMedia: [] as MediaAsset[] },
    )

    const savedNewMedia = await Promise.all(newMedia.map(persistMediaAsset))

    const finalMedia = [
      ...persistedMedia,
      ...savedNewMedia.map((m) => ({ ...m, persisted: true })),
    ]

    const categories = deriveCategories(title, content, finalMedia)

    const memoir: MemoirInsert = {
      id,
      title,
      content,
      date: selectedDate,
      createdAt: existingMemoir?.createdAt ?? new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      media: finalMedia,
      titleVisible,
      categories,
    }

    try {
      await upsertMemoir(memoir)
      update(memoir)

      // console.log('Memoir saved:', JSON.stringify(memoir, null, 2))
    } catch (error) {
      console.error('Failed to save memoir:', error)
    }
  }

  const saveMemoirRef = useRef(saveMemoir)

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
    console.log('Text format pressed')
    // await KeyboardController.dismiss()
    formattingSheetRef.current?.present()
  }

  const titleInputRef = useRef<TextInput>(null)

  const handleMediaPress = (index: number) => {
    router.push({
      pathname: '/memoirs/[id]/media',
      params: { id, mediaIndex: index.toString() },
    })
  }

  const handleDone = () => {
    doneRef.current = true
    saveMemoir()
    router.back()
  }

  const handleEditDate = async () => {
    router.push({
      pathname: '/memoirs/[id]/edit-date',
      params: { id, date: selectedDate },
    })
    await KeyboardController.dismiss()
  }

  const handleDelete = async () => {
    try {
      if (existingMemoir) {
        await deleteMemoir(id)
      }
      router.back()
    } catch (err) {
      console.error('Failed to delete memoir:', err)
    }
  }

  function normalizeUri(path: string): string {
    return path.startsWith('file://') ? path : `file://${path}`
  }

  const handleRecordingComplete = async (audioPath: string) => {
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
      uri: normalizeUri(audioPath),
      type: 'audio',
      id: `${Date.now()}_audio`,
      duration,
      persisted: false,
    }

    // console.log('New audio added:', newAudio)

    addMedia([newAudio])
    // setMedia((prev) => [...prev, newAudio])
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
    titleRef.current = title
  }, [title])

  useEffect(() => {
    titleVisibleRef.current = titleVisible
  }, [titleVisible])

  useEffect(() => {
    mediaRef.current = media
  }, [media])

  useEffect(() => {
    const interval = setInterval(() => {
      if (titleRef.current !== existingMemoir?.title) {
        update({ id, title: titleRef.current })
      }
      if (contentRef.current !== existingMemoir?.content) {
        update({ id, content: contentRef.current })
      }
    }, 300)

    return () => clearInterval(interval)
  }, [id, update, existingMemoir?.title, existingMemoir?.content])

  saveMemoirRef.current = saveMemoir

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', () => {
      saveMemoirRef.current()
    })

    return unsubscribe
  }, [navigation])

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
              dateLabel={formatDate(new Date(selectedDate))}
              onEditDate={handleEditDate}
              onDelete={handleDelete}
              onDone={handleDone}
              onHideTitle={() => {
                setTitleVisible((prev) => !prev)
              }}
              titleVisible={titleVisible}
              {...props}
            />
          ),
        }}
      />

      <Lazy>
        <CameraModal
          ref={cameraRef}
          onCapture={(uri) => {
            console.log('Photo captured:', uri)
            const newPhoto: MediaAsset = {
              uri,
              type: 'image',
              id: `${Date.now()}_photo`,
            }
            addMedia([newPhoto])
            // setMedia((prev) => [...prev, newPhoto])
          }}
          onVideoCapture={(uri, duration) => {
            console.log('Video captured:', uri)
            const newVideo: MediaAsset = {
              uri,
              type: 'video',
              id: `${Date.now()}_video`,
              duration,
            }
            addMedia([newVideo])
            // setMedia((prev) => [...prev, newVideo])
          }}
          onClose={() => console.log('Camera closed')}
        />
      </Lazy>

      <Lazy>
        <ColourPickerSheet
          bottomSheetRef={colorPickerSheetRef}
          onColorSelect={handleColorSelect}
          selectedColor={selectedColor}
        />
      </Lazy>

      <Lazy>
        <VoiceInputSheet
          bottomSheetRef={voiceInputSheetRef}
          onTranscript={(transcript) => {
            console.log('Transcript received:', transcript)
            richEditorRef.current?.insertText(transcript + ' ')
          }}
        />
      </Lazy>

      <Lazy>
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
      </Lazy>

      <Lazy>
        <AudioRecorderSheet
          audioSheetRef={audioSheetRef}
          onRecordingComplete={handleRecordingComplete}
        />
      </Lazy>

      <KeyboardAwareScrollView ref={scrollRef} style={{ zIndex: -1 }}>
        <View className="flex-1 p-4 pt-2">
          <Lazy>
            <ResponsiveMediaGrid
              media={media}
              onMediaPress={handleMediaPress}
              onDeletePress={removeMedia}
            />
          </Lazy>

          {titleVisible && (
            <>
              <Input
                ref={titleInputRef}
                value={title}
                onChangeText={(text) => {
                  setTitle(text)
                  titleRef.current = text
                }}
                // autoFocus
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
            initialContentHTML={contentRef.current}
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
