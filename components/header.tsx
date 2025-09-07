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
    const triggerRef = useRef<ComponentRef<typeof PopoverTrigger>>(null)

    useImperativeHandle(ref, () => ({
      closePopover: () => {
        console.log('Closing popover')
        triggerRef.current?.close?.()
      },
    }))

    return (
      <View className="justify-between items-center flex-row w-full mb-4">
        <Text className="text-3xl font-bold">Lune</Text>
        <View className="flex-row gap-x-3">
          <Button
            hitSlop={25}
            size="icon"
            className="rounded-full bg-[#EDE9D5]"
            onPress={() => router.push('/search')}>
            <Search size={20} />
          </Button>

          {/* <Popover>
            <PopoverTrigger ref={triggerRef} asChild>
              <Button
                hitSlop={20}
                variant="secondary"
                size="icon"
                className="rounded-full bg-[#EDE9D5]">
                <Ellipsis size={20} />
              </Button>
            </PopoverTrigger>

            <PopoverContent
              portalHost="root-host"
              side="bottom"
              align="end"
              className="w-auto py-0 px-0 bg-[#EDE9D5] border border-[#6C7A45]/20 rounded-2xl overflow-hidden">
              <MenuItem
                label="Preferences"
                icon={<Settings size={20} />}
                onPress={onPreferencesPress}
                rounded="top"
              />

              <Separator className="h-[1px] bg-[#D4CDB3]" />

              <MenuItem
                label="Notifications"
                icon={<Bell size={20} />}
                onPress={onNotificationsPress}
              />

              <Separator className="h-[1px] bg-[#D4CDB3]" />

              <MenuItem
                label="Backup & Sync"
                icon={<Cloud size={20} />}
                onPress={onBackupSyncPress}
                rounded="bottom"
              />
            </PopoverContent>
          </Popover> */}
        </View>
      </View>
    )
  },
)

export default Header

Header.displayName = 'Header'
