import {
  Pressable,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native'
import React, { useCallback, useMemo, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router, Stack, useFocusEffect } from 'expo-router'
import Header from '@/features/memoir/components/headers/edit-date'
import { Calendar } from 'react-native-calendars'
import { formatDate } from '@/lib/date'
import CalendarHeader from '@/components/calendar-header'
import dayjs from 'dayjs'
import { MarkedDates, Theme } from 'react-native-calendars/src/types'
import { useMemoirStore } from '@/store/memoir'
import { KeyboardController } from 'react-native-keyboard-controller'

interface CalendarHeaderStyles {
  dayTextAtIndex0?: TextStyle
  dayTextAtIndex1?: TextStyle
  dayTextAtIndex2?: TextStyle
  dayTextAtIndex3?: TextStyle
  dayTextAtIndex4?: TextStyle
  dayTextAtIndex5?: TextStyle
  dayTextAtIndex6?: TextStyle
}

interface DayBasicStyles {
  base?: ViewStyle
  text?: TextStyle
}

interface CalendarMainStyles {
  week?: ViewStyle
}

const dayHeaderStyle = {
  textTransform: 'uppercase' as const,
  fontWeight: '400' as const,
  color: '#B8B4A7',
}

const calendarTheme: Theme & {
  'stylesheet.calendar.header'?: CalendarHeaderStyles
  'stylesheet.day.basic'?: DayBasicStyles
  'stylesheet.calendar.main'?: CalendarMainStyles
} = {
  backgroundColor: '#9C988B',
  calendarBackground: '#9C988B',

  todayTextColor: '#E3E9B9',
  textDayHeaderFontWeight: '400',
  textDayFontWeight: 'medium',

  textDisabledColor: '#8A8680',
  dayTextColor: '#333333',

  'stylesheet.calendar.header': Object.fromEntries(
    Array(7)
      .fill(null)
      .map((_, i) => [`dayTextAtIndex${i}`, dayHeaderStyle]),
  ),
}

const EditDate = () => {
  const today = useMemo(() => new Date().toISOString().split('T')[0], [])
  const createdDate = useMemo(() => formatDate(new Date()), [])
  const createdDateISO = useMemo(
    () => dayjs(new Date()).format('YYYY-MM-DD'),
    [],
  )

  const selectedDate = useMemoirStore((s) => s.selectedDate)

  const [localDate, setLocalDate] = useState(selectedDate)
  const [currentMonth, setCurrentMonth] = useState(selectedDate)

  const setSelectedDate = useMemoirStore((s) => s.setSelectedDate)


  const changeMonth = useCallback(
    (months: number) => {
      const newMonth = dayjs(currentMonth)
        .add(months, 'month')
        .format('YYYY-MM-DD')
      setCurrentMonth(newMonth)
    },
    [currentMonth],
  )

  const handleCancel = useCallback(() => router.back(), [])
  const handleDone = useCallback(() => {
    setSelectedDate(localDate)
    router.back()
  }, [localDate])

  // const dismissKeyboard = useCallback(() => {
  //   KeyboardController.dismiss()
  // }, [])

  // useFocusEffect(dismissKeyboard)


  const markedDates: MarkedDates = useMemo(
    () => ({
      [localDate]: {
        customStyles: {
          container: {
            borderWidth: 2,
            borderColor: localDate === today ? '#9FB26C' : '#7A8357',
            borderRadius: 20,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: localDate === today ? '#9FB26C' : '#7A8357',
          },
          text: {
            color: localDate === today ? '#FFFFFF' : '#D9E3A6',
            fontWeight: 'bold',
          },
        },
      },
    }),
    [localDate, today],
  )

  return (
    <SafeAreaView
      className="flex-1 p-4 bg-[#E8E6D9]"
      edges={['left', 'right', 'bottom']}>
      <Stack.Screen
        options={{
          headerShown: true,
          header: (props) => (
            <Header {...props} onCancel={handleCancel} onDone={handleDone} />
          ),
        }}
      />
      <Text className="text-sm px-4">SELECT CUSTOM DATE</Text>

      <Calendar
        firstDay={1}
        key={currentMonth}
        current={currentMonth}
        enableSwipeMonths
        onMonthChange={(month) => {
          const newMonth = `${month.year}-${month.month.toString().padStart(2, '0')}-01`
          setCurrentMonth(newMonth)
        }}
        hideExtraDays
        maxDate={today}
        hideArrows={true}
        style={styles.calendar}
        renderHeader={(date) => (
          <CalendarHeader
            date={date}
            onNextMonth={() => changeMonth(1)}
            onPreviousMonth={() => changeMonth(-1)}
          />
        )}
        onDayPress={(day) => setLocalDate(day.dateString)}
        markedDates={markedDates}
        markingType="custom"
        theme={calendarTheme}
      />

      <View className="mt-10">
        <Text className="text-sm px-4">USE DATE FROM</Text>
        <Pressable
          className="flex-row items-center justify-between p-3 bg-[#9C988B] rounded-lg my-2"
          onPress={() => {
            setLocalDate(createdDateISO)
            setCurrentMonth(createdDateISO)
            setSelectedDate(createdDateISO)
          }}>
          <Text className="text-[#DDD9CC] text-xl">Entry Created</Text>
          <Text className="text-[#F5F4F0] text-xl">{createdDate}</Text>
        </Pressable>
        <Text className="text-sm px-4">
          Use the date this entry was created.
        </Text>
      </View>
    </SafeAreaView>
  )
}

export default EditDate

const styles = StyleSheet.create({
  calendar: {
    height: 370,
    marginTop: 8,
    borderRadius: 10,
    padding: 15,
  },
})
