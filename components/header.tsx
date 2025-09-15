import { View, Text } from 'react-native'
import React, {
  ComponentRef,
  forwardRef,
  useImperativeHandle,
  useRef,
} from 'react'
import { Button } from './ui/button'
import { Bell, Cloud, Ellipsis, Search, Settings } from 'lucide-react-native'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { router } from 'expo-router'
import MenuItem from './menu-item'
import { Separator } from './ui/separator'
import { useColorScheme } from '@/lib/useColorScheme'
import { cn } from '@/lib/utils'
import { useFontSize } from '@/lib/use-font-size'

interface HeaderProps {
  onPreferencesPress: () => void
  onNotificationsPress: () => void
  onBackupSyncPress: () => void
}

const Header = forwardRef(
  (
    {
      onPreferencesPress,
      onNotificationsPress,
      onBackupSyncPress,
    }: HeaderProps,
    ref,
  ) => {
    const { isDarkColorScheme: dark } = useColorScheme()
    const { fontSize } = useFontSize()
    const triggerRef = useRef<ComponentRef<typeof PopoverTrigger>>(null)

    const titleClass = cn(
      fontSize === 'small' && 'text-xl',
      fontSize === 'medium' && 'text-2xl',
      fontSize === 'large' && 'text-3xl',
    )

    const iconSize = fontSize === 'small' ? 20 : fontSize === 'medium' ? 24 : 28

    useImperativeHandle(ref, () => ({
      closePopover: () => {
        console.log('Closing popover')
        triggerRef.current?.close?.()
      },
    }))

    return (
      <View className="justify-between items-center flex-row w-full mb-4">
        <Text
          className={cn(
            'font-bold',
            titleClass,
            dark ? 'text-[#F5F4EF]' : 'text-[#2B311A]',
          )}>
          Lune
        </Text>
        <View className="flex-row gap-x-3">
          <Button
            size="icon"
            className={cn(
              'rounded-full ',
              fontSize === 'large' && 'p-6',
              dark ? 'bg-[#94A479]' : 'bg-[#EDE9D5]',
            )}
            onPress={() => router.push('/search')}>
            <Search size={iconSize - 2} />
          </Button>

          <Popover>
            <PopoverTrigger ref={triggerRef} asChild>
              <Button
                variant="secondary"
                size="icon"
                className={cn(
                  'rounded-full',
                  fontSize === 'large' && 'p-6',
                  dark ? 'bg-[#94A479]' : 'bg-[#EDE9D5]',
                )}>
                <Ellipsis size={iconSize - 2} />
              </Button>
            </PopoverTrigger>

            <PopoverContent
              portalHost="root-host"
              side="bottom"
              align="end"
              className={cn(
                'w-auto py-0 px-0 border rounded-2xl overflow-hidden',
                dark
                  ? 'bg-[#6F8547] border-[#95A578]/30'
                  : 'bg-[#EDE9D5] border-[#6C7A45]/20',
              )}>
              <MenuItem
                label="Preferences"
                icon={
                  <Settings size={iconSize - 4} color={dark ? '#E8E6D9' : '#2B311A'} />
                }
                onPress={onPreferencesPress}
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
                label="Notifications"
                icon={<Bell size={iconSize - 4} color={dark ? '#E8E6D9' : '#2B311A'} />}
                onPress={onNotificationsPress}
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
                label="Backup & Sync"
                icon={<Cloud size={iconSize - 4} color={dark ? '#E8E6D9' : '#2B311A'} />}
                onPress={onBackupSyncPress}
                rounded="bottom"
                dark={dark}
                fontSize={fontSize}
              />
            </PopoverContent>
          </Popover>
        </View>
      </View>
    )
  },
)

export default Header

Header.displayName = 'Header'
