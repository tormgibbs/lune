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
    const triggerRef = useRef<ComponentRef<typeof PopoverTrigger>>(null)

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
            'text-3xl font-bold',
            dark ? 'text-[#F5F4EF]' : 'text-[#2B311A]',
          )}>
          Lune
        </Text>
        <View className="flex-row gap-x-3">
          <Button
            size="icon"
            className={cn(
              'rounded-full',
              dark ? 'bg-[#94A479]' : 'bg-[#EDE9D5]',
            )}
            onPress={() => router.push('/search')}>
            <Search size={20} />
          </Button>

          <Popover>
            <PopoverTrigger ref={triggerRef} asChild>
              <Button
                variant="secondary"
                size="icon"
                className={cn(
                  'rounded-full',
                  dark ? 'bg-[#94A479]' : 'bg-[#EDE9D5]',
                )}>
                <Ellipsis size={20} />
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
                icon={<Settings size={20} color={dark ? '#E8E6D9' : '#2B311A'} />}
                onPress={onPreferencesPress}
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
                label="Notifications"
                icon={<Bell size={20} color={dark ? '#E8E6D9' : '#2B311A'} />}
                onPress={onNotificationsPress}
                dark={dark}
              />

              <Separator
                className={cn(
                  'h-[1px]',
                  dark ? 'bg-[#A3B587]' : 'bg-[#D4CDB3]',
                )}
              />

              <MenuItem
                label="Backup & Sync"
                icon={<Cloud size={20} color={dark ? '#E8E6D9' : '#2B311A'} />}
                onPress={onBackupSyncPress}
                rounded="bottom"
                dark={dark}
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
