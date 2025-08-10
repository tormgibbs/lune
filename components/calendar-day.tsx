import { Text, Pressable } from 'react-native'
import React from 'react'
import { MarkingProps } from 'react-native-calendars/src/calendar/day/marking'
import { cn } from '@/lib/utils'
import { DateData } from 'react-native-calendars'
import { DayState } from 'react-native-calendars/src/types'

interface CalendarDayProps {
  date?: DateData
  state?: DayState
  marking?: MarkingProps
  onPress?: (day: DateData) => void
}

const CalendarDay = ({ date, state, marking, onPress }: CalendarDayProps) => {
  if (!date) return null

  const isSelectedToday = state === 'today' && marking?.selected

  return (
    <Pressable 
      className={cn(
        'h-8 justify-center items-center my-0',
        {
          'bg-[#E8E6D9]': state === 'selected',
          'bg-blue-300': state === 'today',
          'bg-blue-600 rounded-full border border-[#4A90E2] text-green-400': isSelectedToday,
          '': state === 'disabled',
        },
        marking?.selected ? 'border rounded-full border-[#4A90E2]' : '',
      )}
      onPress={() => onPress?.(date)}
    >
      <Text className={cn(
        'text-center font-medium',
        {
          'text-[#4A90E2]': marking?.selected,
          'text-black': state === 'disabled',
          'text-[#999999]': state === 'today',
        }
      )}>
        {date.day}
      </Text>
    </Pressable>
  )
}

export default CalendarDay
