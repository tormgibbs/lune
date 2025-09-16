import { View, Text, } from 'react-native'
import React from 'react'
import dayjs from 'dayjs'
import { Button } from '../ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react-native'
import { cn } from '@/lib/utils'
import { FontSize } from '@/lib/use-font-size'

interface CalendarHeaderProps {
  date: Date
  onNextMonth: () => void
  onPreviousMonth: () => void
  dark?: boolean
  fontSize?: FontSize
}

const CalendarHeader = ({
  date,
  onNextMonth,
  onPreviousMonth,
  dark = false,
  fontSize = 'medium',
}: CalendarHeaderProps) => {
  const titleClass = cn(
    fontSize === 'small' && 'text-lg',
    fontSize === 'medium' && 'text-xl',
    fontSize === 'large' && 'text-2xl',
  )

  const iconSize = fontSize === 'small' ? 20 : fontSize === 'medium' ? 24 : 28

  return (
    <View>
      <View className="w-full flex-row items-center justify-between">
        <Text
          className={cn(
            'font-medium',
            titleClass,
            dark ? 'text-[#E8E6D9]' : 'text-[#2B311A]',
            // Platform.select({
            //   ios: 'text-xl',
            //   android: 'text-lg',
            //   default: 'text-lg',
            // }),
          )}>
          {dayjs(date).format('MMMM YYYY')}
        </Text>
        <View className="flex-row">
          <Button onPress={onPreviousMonth} size="icon" variant="link">
            <ChevronLeft
              color={dark ? '#E8E6D9' : '#2B311A'}
              size={iconSize}
            />
          </Button>

          <Button onPress={onNextMonth} size="icon" variant="link">
            <ChevronRight
              color={dark ? '#E8E6D9' : '#2B311A'}
              size={iconSize}
            />
          </Button>
        </View>
      </View>
    </View>
  )
}

export default CalendarHeader
