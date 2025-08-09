import React, {
  ComponentRef,
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'
import { Platform, Pressable, Text, View } from 'react-native'
import { Tag, CalendarDays, Trash2 } from 'lucide-react-native'
import { CircleEllipsis } from '@/lib/icons/CircleEllipsis'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Separator } from '@rn-primitives/context-menu'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { PortalHost } from '@rn-primitives/portal'
import MenuItem from '@/components/menu-item'

type HeaderProps = {
  dateLabel: string
  onEditDate: () => void
  onDelete: () => void
  onDone: () => void
}

export const Header = forwardRef(
  ({ dateLabel, onEditDate, onDelete, onDone }: HeaderProps, ref) => {
    const [isPopoverOpen, setIsPopoverOpen] = useState(false)
    const triggerRef = useRef<ComponentRef<typeof PopoverTrigger>>(null)
    const insets = useSafeAreaInsets()

    useImperativeHandle(ref, () => ({
      closePopover: () => {
        triggerRef.current?.close?.()
      },
    }))

    return (
      <View
        style={{
          paddingTop: Platform.select({
            ios: 20,
            android: insets.top + 10,
            default: 0,
          }),
          paddingBottom: 15,
          paddingHorizontal: 20,
          backgroundColor: '#E8E6D9',
        }}>
        <PortalHost name="modal-host" />
        <View className="relative flex-row items-center justify-between">
          <Tag color="#6C7A45" size={24} />

          <Text className="absolute text-[#2B311A] text-xl font-medium left-1/2 transform -translate-x-1/2">
            {dateLabel}
          </Text>

          <View className="flex-row items-center gap-4">
            <Popover onOpenChange={setIsPopoverOpen}>
              <PopoverTrigger ref={triggerRef} asChild>
                <Pressable className={isPopoverOpen ? 'opacity-50' : ''}>
                  <CircleEllipsis color="#6C7A45" size={24} />
                </Pressable>
              </PopoverTrigger>

              <PopoverContent
                side="bottom"
                portalHost="modal-host"
                align="end"
                alignOffset={-4}
                sideOffset={8}
                className="w-48 py-0 px-0 bg-[#EDE9D5] border border-[#6C7A45]/20 rounded-2xl overflow-hidden">
                <MenuItem
                  label="Edit Date"
                  icon={<CalendarDays size={20} />}
                  onPress={onEditDate}
                  rounded="top"
                />

                <Separator className="h-[1px] bg-[#D4CDB3]" />
                <MenuItem
                  label="Delete"
                  icon={<Trash2 size={20} color="#A34B3D" />}
                  onPress={onDelete}
                  danger
                  rounded="bottom"
                />
              </PopoverContent>
            </Popover>

            <Pressable className="active:opacity-50" onPress={onDone}>
              <Text className="text-[#6C7A45] text-lg font-medium">Done</Text>
            </Pressable>
          </View>
        </View>
      </View>
    )
  },
)

Header.displayName = 'Header'
