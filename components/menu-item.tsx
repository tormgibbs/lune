import { Text, Pressable, Platform } from 'react-native'
import React from 'react'
import { cn } from '@/lib/utils'

interface MenuItemProps {
  label: string
  icon: React.ReactNode
  onPress: () => void
  danger?: boolean
  rounded?: 'top' | 'bottom' | 'full'
}
const MenuItem: React.FC<MenuItemProps> = ({
  label,
  icon,
  onPress,
  danger,
  rounded,
}) => {
  return (
    <Pressable
      className={cn(
        'flex-row justify-between items-center py-2 px-4 gap-x-5 active:bg-[#D4CDB3]',
        rounded === 'top' && 'rounded-t-2xl',
        rounded === 'bottom' && 'rounded-b-2xl',
        rounded === 'full' && 'rounded-2xl',
      )}
      onPress={onPress}
    >
      <Text
        className={cn(
          'text-base',
          danger ? 'text-[#A34B3D]' : 'text-[#2B311A]',
          Platform.select({
            ios: 'text-xl',
            android: 'text-lg',
            default: 'text-lg',
          }),
        )}>
        {label}
      </Text>
      {icon}
    </Pressable>
  )
}

export default MenuItem
