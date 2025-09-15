import { Text, Pressable, Platform } from 'react-native'
import React from 'react'
import { cn } from '@/lib/utils'
import { useColorScheme } from '@/lib/useColorScheme'
import { FontSize } from '@/lib/use-font-size'

interface MenuItemProps {
  label: string
  icon: React.ReactNode
  onPress: () => void
  danger?: boolean
  rounded?: 'top' | 'bottom' | 'full'
  dark?: boolean
  fontSize?: FontSize
}
const MenuItem: React.FC<MenuItemProps> = ({
  label,
  icon,
  onPress,
  danger,
  rounded,
  dark = false,
  fontSize = 'medium',
}) => {
  const textClass = cn(
    fontSize === 'small' && 'text-sm',
    fontSize === 'medium' && 'text-base',
    fontSize === 'large' && 'text-xl',
  )

  return (
    <Pressable
      className={cn(
        'flex-row justify-between items-center py-2 px-4 gap-x-5',
        dark ? 'active:bg-[#8B9C6B]' : 'active:bg-[#D4CDB3]',
        rounded === 'top' && 'rounded-t-2xl',
        rounded === 'bottom' && 'rounded-b-2xl',
        rounded === 'full' && 'rounded-2xl',
      )}
      onPress={onPress}>
      <Text
        className={cn(
          textClass,
          danger
            ? 'text-[#DC2626]'
            : dark
              ? 'text-[#E8E6D9]'
              : 'text-[#2B311A]',
          // Platform.select({
          //   ios: 'text-xl',
          //   android: 'text-lg',
          //   default: 'text-lg',
          // }),
        )}>
        {label}
      </Text>
      {icon}
    </Pressable>
  )
}

export default MenuItem
