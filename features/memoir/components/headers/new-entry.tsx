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
import MenuItem from '@/components/menu-item'
import { cn } from '@/lib/utils'
import { CENTERED_TEXT_STYLE } from '@/lib/constants'

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
      <>
        <View
          style={{
            paddingTop: Platform.select({
              ios: 25,
              android: insets.top + 10,
              default: 0,
            }),
            paddingBottom: 10,
            paddingHorizontal: 20,
            backgroundColor: '#E8E6D9',
          }}>
          <View className="relative flex-row items-center justify-between">
            <Tag
              color="#6C7A45"
              size={Platform.select({
                ios: 28,
                android: 24,
                default: 24,
              })}
            />

            <Text
              style={CENTERED_TEXT_STYLE()}
              className={cn(
                'font-medium',
                // 'absolute text-[#2B311A] font-medium left-1/2 transform -translate-x-1/2',
                Platform.select({
                  ios: 'text-xl',
                  android: 'text-xl',
                  default: 'text-xl',
                }),
              )}>
              {dateLabel}
            </Text>

            <View className="flex-row items-center gap-3">
              <Popover onOpenChange={setIsPopoverOpen}>
                <PopoverTrigger ref={triggerRef} asChild>
                  <Pressable className={isPopoverOpen ? 'opacity-50' : ''}>
                    <CircleEllipsis
                      color="#6C7A45"
                      size={Platform.select({
                        ios: 28,
                        android: 24,
                        default: 24,
                      })}
                    />
                  </Pressable>
                </PopoverTrigger>

                <PopoverContent
                  side="top"
                  portalHost="memoirs-host"
                  align="end"
                  alignOffset={-4}
                  sideOffset={8}
                  style={{ minWidth: 160, zIndex: 9999 }}
                  className="w-auto py-0 px-0 bg-[#EDE9D5] border border-[#6C7A45]/20 rounded-2xl overflow-hidden">
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
                <Text
                  className={cn(
                    'text-[#6C7A45] font-medium',
                    Platform.select({
                      ios: 'text-xl',
                      android: 'text-lg',
                      default: 'text-lg',
                    }),
                  )}>
                  Done
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </>
    )
  },
)

Header.displayName = 'Header'
