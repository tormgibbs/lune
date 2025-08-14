import {
  KeyboardAvoidingView,
  Platform,
  TextInput,
  View,
  Pressable,
  Text,
  Keyboard,
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
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react-native'

const Index = () => {
  const { id } = useLocalSearchParams<{ id: string }>()
  const bottomSheetRef = useRef<BottomSheet>(null)
  const router = useRouter()
  const headerRef = useRef<{ closePopover: () => void }>(null)

  const handleAudioRecordPress = () => {
    console.log('Audio record action')
  }

  const handleImagePress = () => {
    console.log('Image action')
  }

  const handleCameraPress = () => {
    console.log('Camera action')
  }

  const handleSpeechPress = () => {
    console.log('Speech action')
  }

  const handleTextFormatPress = () => {
    Keyboard.dismiss()
    bottomSheetRef.current?.expand()
    console.log('Text format action')
  }

  const titleInputRef = useRef<TextInput>(null)

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

  const handleBottomSheetClose = () => {
  }

  useFocusEffect(
    useCallback(() => {
      const timer = setTimeout(() => {
        titleInputRef.current?.focus()
      }, 100)

      return () => clearTimeout(timer)
    }, []),
  )

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

      <BottomSheet
        ref={bottomSheetRef}
        enablePanDownToClose
        index={-1}
        handleComponent={null}
        onClose={handleBottomSheetClose}
      >
        <BottomSheetView className='p-4'>
          <View className='flex-row items-center justify-between'>
            <Text>Format</Text>
            <Button variant='secondary' size='icon' className='rounded-full'>
              <X />
            </Button>
          </View>
        </BottomSheetView>
      </BottomSheet>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View className="flex-1 p-4 pt-2 z-[-999999]">
          <Input
            ref={titleInputRef}
            className="bg-transparent border-0 px-1 text-lg font-medium text-[#55584A]"
            placeholder="Title"
            placeholderClassName="text-[#7A7A7A]"
          />
          <Separator className="bg-[#C2C0B2]" />
          <Input
            className="bg-transparent flex-1 border-0 px-1 text-lg text-[#55584A]"
            placeholder="Start writing..."
            multiline
            placeholderClassName="text-[#7A7A7A]"
            textAlignVertical="top"
          />
        </View>
        <Toolbar
          onAudioPress={handleAudioRecordPress}
          onCameraPress={handleCameraPress}
          onTextFormatPress={handleTextFormatPress}
          onImagesPress={handleImagePress}
          onSpeechPress={handleSpeechPress}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default Index
