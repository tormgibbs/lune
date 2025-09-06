import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from '@gorhom/bottom-sheet'
import { forwardRef } from 'react'
import { View, Text, Pressable } from 'react-native'
import { Separator } from './ui/separator'
import { MediaType } from '@/types/media'


interface DeleteBottomSheetProps {
  onDeletePress: () => void
  onCancelPress: () => void
  mediaType: MediaType
  isLastItem?: boolean
}

const MediaTypeLabels: Record<Exclude<MediaType, undefined>, string> = {
  image: 'photo',
  video: 'video',
  audio: 'audio recording',
  livePhoto: 'live photo',
  pairedVideo: 'paired video',
}

const DeleteBottomSheet = forwardRef<BottomSheetModal, DeleteBottomSheetProps>(
  ({ onDeletePress, onCancelPress, mediaType, isLastItem }, ref) => {

    const label = mediaType ? MediaTypeLabels[mediaType] : 'item'

    const message = isLastItem
      ? `This ${label} is the only content in your entry. Removing it will delete this entry.`
      : `This ${label} will be removed from your entry.`

    const buttonText = isLastItem
      ? 'Delete Entry'
      : `Remove ${label[0].toUpperCase() + label.slice(1)}`

    const renderBackdrop = (props: any) => (
      <BottomSheetBackdrop
        {...props}
        pressBehavior="close"
        disappearsOnIndex={-1}
        appearsOnIndex={0}
      />
    )

    return (
      <BottomSheetModal
        ref={ref}
        backgroundStyle={{ backgroundColor: 'transparent' }}
        backdropComponent={renderBackdrop}
        handleComponent={null}
        enableContentPanningGesture={false}>
        <BottomSheetView className="p-4 px-2 items-center gap-3">
          <View className="w-full bg-[#A6B57D] rounded-xl overflow-hidden">
            <Text className="py-3 px-8 w-full text-center text-sm font-medium text-[#EBEBEB]">
              {message}
            </Text>
            <Separator />
            <Pressable
              className="w-full items-center py-4 active:bg-[#73824A]/80"
              onPress={onDeletePress}>
              <Text className="text-red-600 text-xl">
                {buttonText}
              </Text>
            </Pressable>
          </View>

          <Pressable
            className="py-4 w-full items-center rounded-xl bg-[#A6B57D] active:bg-[#73824A]/80"
            onPress={onCancelPress}>
            <Text className="text-lg text-white font-semibold">Cancel</Text>
          </Pressable>
        </BottomSheetView>
      </BottomSheetModal>
    )
  },
)

DeleteBottomSheet.displayName = 'DeleteBottomSheet'

export default DeleteBottomSheet
