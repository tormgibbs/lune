// bottom-sheet-provider.tsx
import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useMemo,
  useState,
} from 'react'
import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetView,
} from '@gorhom/bottom-sheet'
import { Pressable, Text, View } from 'react-native'
import { Separator } from './ui/separator'
import { useMemoirActions } from '@/hooks/use-memoir-actions'

interface BottomSheetContextValue {
  bottomSheetRef: React.RefObject<BottomSheetModal | null>
  openBottomSheet: (cfg: BottomSheetConfig) => void
  closeBottomSheet: () => void
}

interface BottomSheetConfig {
  id?: string
  isBookMarked?: boolean
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
  onBookmarkPress?: (id: string) => void
}

const BottomSheetContext = createContext<BottomSheetContextValue | null>(null)

export const BottomSheetProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const bottomSheetRef = useRef<BottomSheetModal | null>(null)
  const { handleEdit, handleDelete, handleToggleBookmark } = useMemoirActions()
  const [config, setConfig] = useState<BottomSheetConfig | null>(null)

  const openBottomSheet = useCallback((cfg: BottomSheetConfig) => {
    setConfig(cfg)
    bottomSheetRef.current?.present()
  }, [])

  const closeBottomSheet = useCallback(() => {
    bottomSheetRef.current?.dismiss()
    setConfig(null)
  }, [])

  const value = useMemo(
    () => ({ bottomSheetRef, openBottomSheet, closeBottomSheet }),
    [],
  )

  const renderBackdrop = (props: BottomSheetBackdropProps) => (
    <BottomSheetBackdrop
      {...props}
      // pressBehavior="close"
      disappearsOnIndex={-1}
      appearsOnIndex={0}
    />
  )

  return (
    <BottomSheetContext.Provider value={value}>
      {children}
      <BottomSheetModal
        ref={bottomSheetRef}
        handleComponent={null}
        enableContentPanningGesture={false}
        backgroundStyle={{ backgroundColor: 'transparent' }}
        backdropComponent={renderBackdrop}>
        <BottomSheetView className="p-4 px-3 gap-3">
          <View className="rounded-xl overflow-hidden bg-[#C2C9A6]">
            <Pressable
              className="w-full py-4 items-center active:bg-[#9FAA74]/90"
              onPress={() => {
                closeBottomSheet()
                handleEdit(config?.id!)
              }}>
              <Text className="text-lg text-white font-medium">Edit</Text>
            </Pressable>

            <Separator className="bg-[#A4B085]" />

            <Pressable
              className="w-full py-4 items-center active:bg-[#9FAA74]/90"
              onPress={() => {
                closeBottomSheet()
                handleToggleBookmark(config?.id!)
              }}>
              <Text className="text-lg text-white font-medium">
                {config?.isBookMarked ? 'Remove Bookmark' : 'Bookmark'}
              </Text>
            </Pressable>

            <Separator className="bg-[#A4B085]" />

            <Pressable
              className="w-full py-4 items-center active:bg-[#9FAA74]/90"
              onPress={() => {
                handleDelete(config?.id!)
                closeBottomSheet()
              }}>
              <Text className="text-lg text-red-600 font-medium">Delete</Text>
            </Pressable>
          </View>

          <Pressable
            className="py-4 w-full items-center rounded-xl bg-[#C2C9A6] active:bg-[#9FAA74]/90"
            onPress={closeBottomSheet}>
            <Text className="text-lg text-white font-semibold">Cancel</Text>
          </Pressable>
        </BottomSheetView>
      </BottomSheetModal>
    </BottomSheetContext.Provider>
  )
}

export const useBottomSheet = () => {
  const context = useContext(BottomSheetContext)
  if (!context) {
    throw new Error('useBottomSheet must be used within BottomSheetProvider')
  }
  return context
}
