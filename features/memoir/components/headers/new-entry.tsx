import React, {
  ComponentRef,
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'
import { Platform, Pressable, Text, View } from 'react-native'
import {
  CalendarDays,
  Trash2,
  Eye,
  EyeOff,
  Bookmark,
} from 'lucide-react-native'
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
  onHideTitle: () => void
  onBookmarkPress: () => void
  bookmarked?: boolean
  titleVisible?: boolean
  dark?: boolean
}

export const Header = forwardRef(
  (
    {
      dateLabel,
      onEditDate,
      onDelete,
      onDone,
      onHideTitle,
      onBookmarkPress,
      bookmarked,
      titleVisible = true,
      dark = false,
    }: HeaderProps,
    ref,
  ) => {
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
            backgroundColor: dark ? '#7B8C69' : '#E8E6D9',
          }}>
          <View className="relative flex-row items-center justify-between">
            <Pressable hitSlop={10} onPress={onBookmarkPress}>
              <Bookmark
                color={dark ? (bookmarked ? '#E8E6D9' : '#E8E6D9') : '#6C7A45'}
                fill={
                  dark
                    ? bookmarked
                      ? '#E8E6D9'
                      : 'none'
                    : bookmarked
                      ? '#6C7A45'
                      : 'none'
                }
                size={Platform.select({
                  ios: 28,
                  android: 24,
                  default: 24,
                })}
              />
            </Pressable>

            <Text
              style={CENTERED_TEXT_STYLE(dark ? '#E8E6D9' : '#2B311A')}
              className={cn(
                'font-medium',
                // dark ? 'text-[#E8E6D9]' : 'text-[#2B311A]',
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
                      color={dark ? '#E8E6D9' : '#6C7A45'}
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
                  className={cn(
                    'w-auto py-0 px-0 border rounded-2xl overflow-hidden',
                    dark
                      ? 'bg-[#6F8060] border-[#5A6B4A]/30'
                      : 'bg-[#EDE9D5] border-[#6C7A45]/20',
                  )}>
                  <MenuItem
                    label="Edit Date"
                    icon={
                      <CalendarDays
                        size={20}
                        color={dark ? '#E8E6D9' : '#2B311A'}
                      />
                    }
                    onPress={() => {
                      triggerRef.current?.close?.()
                      onEditDate()
                    }}
                    rounded="top"
                    dark={dark}
                  />

                  <Separator
                    className={cn(
                      'h-[1px]',
                      dark ? 'bg-[#A3B587]' : 'bg-[#D4CDB3]',
                    )}
                  />

                  <MenuItem
                    label={titleVisible ? 'Hide Title' : 'Show Title'}
                    dark={dark}
                    icon={
                      titleVisible ? (
                        <EyeOff
                          size={20}
                          color={dark ? '#E8E6D9' : '#2B311A'}
                        />
                      ) : (
                        <Eye size={20} color={dark ? '#E8E6D9' : '#2B311A'} />
                      )
                    }
                    onPress={() => {
                      triggerRef.current?.close?.()
                      onHideTitle()
                    }}
                  />

                  <Separator
                    className={cn(
                      'h-[1px]',
                      dark ? 'bg-[#A3B587]' : 'bg-[#D4CDB3]',
                    )}
                  />

                  <MenuItem
                    label="Delete"
                    icon={<Trash2 size={20} color="#DC2626" />}
                    onPress={() => {
                      triggerRef.current?.close?.()
                      onDelete()
                    }}
                    danger
                    rounded="bottom"
                    dark={dark}
                  />
                </PopoverContent>
              </Popover>

              <Pressable
                className="active:opacity-50"
                onPress={() => {
                  triggerRef.current?.close?.()
                  onDone()
                }}>
                <Text
                  className={cn(
                    'font-medium',
                    dark ? 'text-[#D4E6C7]' : 'text-[#6C7A45]',
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
