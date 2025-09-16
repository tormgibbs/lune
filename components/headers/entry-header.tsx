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
import { FontSize } from '@/lib/use-font-size'

type EntryHeaderProps = {
  dateLabel: string
  onEditDate: () => void
  onDelete: () => void
  onDone: () => void
  onHideTitle: () => void
  onBookmarkPress: () => void
  bookmarked?: boolean
  titleVisible?: boolean
  dark?: boolean
  fontSize?: FontSize
}

export const EntryHeader = forwardRef(
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
      fontSize = 'medium',
    }: EntryHeaderProps,
    ref,
  ) => {
    const [isPopoverOpen, setIsPopoverOpen] = useState(false)
    const triggerRef = useRef<ComponentRef<typeof PopoverTrigger>>(null)
    const insets = useSafeAreaInsets()

    const iconSize = fontSize === 'small' ? 20 : fontSize === 'medium' ? 24 : 28

    const titleClass = cn(
      fontSize === 'small' && 'text-base',
      fontSize === 'medium' && 'text-xl',
      fontSize === 'large' && 'text-2xl',
    )

    const doneClass = cn(
      fontSize === 'small' && 'text-sm',
      fontSize === 'medium' && 'text-lg',
      fontSize === 'large' && 'text-xl',
    )

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
                size={iconSize}
              />
            </Pressable>

            <Text
              style={CENTERED_TEXT_STYLE(dark ? '#E8E6D9' : '#2B311A')}
              className={cn(
                'font-medium',
                titleClass,
                // dark ? 'text-[#E8E6D9]' : 'text-[#2B311A]',
                // 'absolute text-[#2B311A] font-medium left-1/2 transform -translate-x-1/2',
                // Platform.select({
                //   ios: 'text-xl',
                //   android: 'text-xl',
                //   default: 'text-xl',
                // }),
              )}>
              {dateLabel}
            </Text>

            <View className={cn(
              'flex-row items-center',
              fontSize === 'large' ? 'gap-1' : 'gap-3',
            )}>
              <Popover onOpenChange={setIsPopoverOpen}>
                <PopoverTrigger ref={triggerRef} asChild>
                  <Pressable className={isPopoverOpen ? 'opacity-50' : ''}>
                    <CircleEllipsis
                      color={dark ? '#E8E6D9' : '#6C7A45'}
                      size={iconSize}
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
                        size={iconSize - 4}
                        color={dark ? '#E8E6D9' : '#2B311A'}
                      />
                    }
                    onPress={() => {
                      triggerRef.current?.close?.()
                      onEditDate()
                    }}
                    rounded="top"
                    dark={dark}
                    fontSize={fontSize}
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
                    fontSize={fontSize}
                    icon={
                      titleVisible ? (
                        <EyeOff
                          size={iconSize - 4}
                          color={dark ? '#E8E6D9' : '#2B311A'}
                        />
                      ) : (
                        <Eye
                          size={iconSize - 4}
                          color={dark ? '#E8E6D9' : '#2B311A'}
                        />
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
                    icon={<Trash2 size={iconSize - 4} color="#DC2626" />}
                    onPress={() => {
                      triggerRef.current?.close?.()
                      onDelete()
                    }}
                    danger
                    rounded="bottom"
                    dark={dark}
                    fontSize={fontSize}
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
                    doneClass,
                    dark ? 'text-[#D4E6C7]' : 'text-[#6C7A45]',
                    // Platform.select({
                    //   ios: 'text-xl',
                    //   android: 'text-lg',
                    //   default: 'text-lg',
                    // }),
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

EntryHeader.displayName = 'EntryHeader'
