import { View, Text } from 'react-native'
import React from 'react'
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetBackdrop,
} from '@gorhom/bottom-sheet'
import ColorPicker, { Panel5 } from 'reanimated-color-picker'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react-native'
import { CENTERED_TEXT_STYLE } from '@/lib/constants'
import { cn } from '@/lib/utils'

interface ColourPickerSheetProps {
  bottomSheetRef: React.RefObject<BottomSheetModal | null>
  onColorSelect: (color: string) => void
  selectedColor: string
  dark?: boolean
}

const ColourPickerSheet = ({
  bottomSheetRef,
  onColorSelect,
  selectedColor,
  dark = false,
}: ColourPickerSheetProps) => {
  const handleClosePress = () => {
    bottomSheetRef.current?.dismiss()
  }

  const renderBackdrop = (props: any) => (
    <BottomSheetBackdrop
      {...props}
      pressBehavior="none"
      disappearsOnIndex={-1}
      appearsOnIndex={0}
    />
  )

  return (
    <BottomSheetModal
      stackBehavior="push"
      enablePanDownToClose
      ref={bottomSheetRef}
      handleComponent={null}
      enableOverDrag={false}
      backdropComponent={renderBackdrop}
      style={{
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        overflow: 'hidden',
      }}>
      <BottomSheetView
        className={cn(
          'flex items-center p-6',
          dark ? 'bg-[#3A4332]' : 'bg-[#E0DCCC]',
        )}>
        <View className="relative flex-row w-full items-center justify-end mb-4">
          <Text className="font-medium text-lg" style={CENTERED_TEXT_STYLE(dark ? '#E8E6D9' : 'black')}>
            Colours
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
        <ColorPicker
          style={{ width: '100%' }}
          value={selectedColor}
          onCompleteJS={(colors) => onColorSelect(colors.hex)}>
          <Panel5 style={{ borderRadius: 8 }} />
        </ColorPicker>
      </BottomSheetView>
    </BottomSheetModal>
  )
}

export default ColourPickerSheet
