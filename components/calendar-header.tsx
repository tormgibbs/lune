import { View, Text, Platform } from 'react-native'
import React from 'react'
import dayjs from 'dayjs'
import { Button } from './ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react-native'
import { cn } from '@/lib/utils'

interface CalendarHeaderProps {
  date: Date
  onNextMonth: () => void
  onPreviousMonth: () => void
  dark?: boolean
}

const CalendarHeader = ({
  date,
  onNextMonth,
  onPreviousMonth,
  dark = false,
}: CalendarHeaderProps) => {
  return (
    <View>
      <View className="w-full flex-row items-center justify-between">
        <Text
          className={cn(
            'font-medium',
            dark ? 'text-[#E8E6D9]' : 'text-[#2B311A]',
            Platform.select({
              ios: 'text-xl',
              android: 'text-lg',
              default: 'text-lg',
            }),
          )}>
          {dayjs(date).format('MMMM YYYY')}
        </Text>
        <View className="flex-row">
          <Button onPress={onPreviousMonth} size="icon" variant="link">
            <ChevronLeft
              color={dark ? '#E8E6D9' : '#2B311A'}
              size={Platform.select({
                ios: 28,
                android: 24,
                default: 24,
              })}
            />
          </Button>

          <Button onPress={onNextMonth} size="icon" variant="link">
            <ChevronRight
              color={dark ? '#E8E6D9' : '#2B311A'}
              size={Platform.select({
                ios: 28,
                android: 24,
                default: 24,
              })}
            />
          </Button>
        </View>
      </View>
    </View>
  )
}

export default CalendarHeader
