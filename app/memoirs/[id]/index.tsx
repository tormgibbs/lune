import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import ColourPickerSheet from '@/features/memoir/components/bottom-sheets/color-picker'
import TextFormattingSheet from '@/features/memoir/components/bottom-sheets/text-format'
import { Header } from '@/features/memoir/components/headers/new-entry'
import Toolbar from '@/features/memoir/components/toolbar'
import { formatDate } from '@/lib/date'
import { deriveCategories, normalizeColor } from '@/lib/utils'
import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet'
import { PortalHost } from '@rn-primitives/portal'
import { Stack, useLocalSearchParams, useRouter } from 'expo-router'
import { useCallback, useMemo, useRef, useState } from 'react'
import { Text, TextInput, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import {
  KeyboardAwareScrollView,
  KeyboardController,
} from 'react-native-keyboard-controller'
import { RichEditor } from 'react-native-pell-rich-editor'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useMediaPicker } from '@/hooks/use-media-picker'
import { useMediaViewer } from '@/hooks/use-media-viewer'
import MediaPager from '@/components/media-pager'
import AudioRecorderSheet from '@/features/memoir/components/bottom-sheets/audio-recorder'
import { MediaAsset } from '@/types/media'
import { createAudioPlayer } from 'expo-audio'
import CameraModal, { CameraModalRef } from '@/components/camera-modal'
import VoiceInputSheet from '@/features/memoir/components/bottom-sheets/voice-input'
import { useMemoirStore } from '@/store/memoir'
import { Category, MemoirInsert } from '@/db/schema'
import { addMemoir, deleteMemoir, updateMemoir } from '@/db/memoir'
import Lazy from '@/components/lazy'
import { deleteMediaFiles, persistMediaAsset } from '@/lib/media'
import ResponsiveMediaGrid from '@/components/responsive-media-grid'
import { useMemoirActions } from '@/hooks/use-memoir-actions'

const Index = () => {
  const router = useRouter()
  const { id, date } = useLocalSearchParams<{ id: string; date: string }>()

  const { memoirs, add, update, remove } = useMemoirStore()
  const existingMemoir = memoirs.find((m) => m.id === id)

  // const initialTitle = existingMemoir?.title ?? ''
  const initialContent = existingMemoir?.content ?? ''

  const [title, setTitle] = useState(existingMemoir?.title ?? '')

  const titleRef = useRef(title)
  const contentRef = useRef(initialContent)

  const colorPickerSheetRef = useRef<BottomSheetModal>(null)
  const formattingSheetRef = useRef<BottomSheetModal>(null)
  const richEditorRef = useRef<RichEditor>(null)
  const scrollRef = useRef<ScrollView>(null)
  const audioSheetRef = useRef<BottomSheetModal>(null)
  const cameraRef = useRef<CameraModalRef>(null)
  const voiceInputSheetRef = useRef<BottomSheetModal>(null)

  const [selectedColor, setSelectedColor] = useState<string>('#6C7A45')
  const [activeFormats, setActiveFormats] = useState<string[]>([])
  const [titleVisible, setTitleVisible] = useState(
    existingMemoir?.titleVisible ?? true,
  )
  const today = useMemo(() => new Date().toISOString().split('T')[0], [])

  const selectedDate = useMemo(() => {
    if (typeof date === 'string' && date.length > 0) return date
    if (existingMemoir?.date) return existingMemoir.date
    return today
  }, [date, existingMemoir?.date, today])

  const { media, pickMedia, removeMedia, addMedia } = useMediaPicker(
    existingMemoir?.media ?? [],
  )

  const { handleDelete: deleteMemoir } = useMemoirActions()

  const {
    visible: viewerVisible,
    selectedIndex,
    openViewer,
    closeViewer,
  } = useMediaViewer()

  const saveMemoir = async () => {
    const title = titleRef.current.trim()
    const content = contentRef.current.trim()

    const isEmpty =
      (!titleVisible || title.length === 0) &&
      content.length === 0 &&
      media.length === 0

    if (isEmpty) {
      if (existingMemoir) {
        try {
          if (existingMemoir.media && existingMemoir.media.length > 0) {
            deleteMediaFiles(existingMemoir.media).catch((err) =>
              console.warn(
                'Failed to delete media files on memoir delete',
                err,
              ),
            )
          }

          await deleteMemoir(existingMemoir.id)
          remove(existingMemoir.id)
          console.log('Memoir deleted:', existingMemoir.id)
        } catch (error) {
          console.error('Failed to delete memoir:', error)
        }
      }
      return
    }

    const { newMedia, persistedMedia } = media.reduce(
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
      if (existingMemoir) {
        const removed = (existingMemoir.media ?? []).filter(
          (old) => !finalMedia.some((m) => m.id === old.id),
        )

        if (removed.length > 0) {
          deleteMediaFiles(removed).catch((err) =>
            console.warn('Failed to delete removed media', err),
          )
        }

        await updateMemoir(id, memoir)
        update(memoir)
      } else {
        await addMemoir(memoir)
        add(memoir)
      }
      console.log('Memoir saved:', JSON.stringify(memoir, null, 2))
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
    console.log('Text format pressed')
    // await KeyboardController.dismiss()
    formattingSheetRef.current?.present()
  }

  const titleInputRef = useRef<TextInput>(null)

  const handleDone = () => {
    // headerRef.current?.closePopover()
    saveMemoir()
    router.back()
  }

  const handleEditDate = async () => {
    // titleInputRef.current?.blur()
    // richEditorRef.current?.blurContentEditor()
    // headerRef.current?.closePopover()
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
    // console.log('Recording saved to:', audioPath)

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

      <BottomSheetModal
      // ref={formattingSheetRef}
      >
        <BottomSheetView>
          <Text>Text Formatting Options</Text>
        </BottomSheetView>
      </BottomSheetModal>

      <Lazy>
        <MediaPager
          media={media}
          visible={viewerVisible}
          selectedIndex={selectedIndex}
          onClose={closeViewer}
        />
      </Lazy>

      <KeyboardAwareScrollView ref={scrollRef} style={{ zIndex: -1 }}>
        <View className="flex-1 p-4 pt-2">
          <Lazy>
            <ResponsiveMediaGrid
              media={media}
              onMediaPress={openViewer}
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
            initialContentHTML={initialContent}
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
