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
import { router, Stack, useLocalSearchParams } from 'expo-router'
import Header from '@/features/memoir/components/headers/edit-date'
import { Calendar } from 'react-native-calendars'
import { formatDate } from '@/lib/date'
import CalendarHeader from '@/components/calendar-header'
import dayjs from 'dayjs'
import { MarkedDates, Theme } from 'react-native-calendars/src/types'
import { useColorScheme } from '@/lib/useColorScheme'
import { cn } from '@/lib/utils'
import { useFontSize } from '@/lib/use-font-size'

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

// const calendarTheme: Theme & {
//   'stylesheet.calendar.header'?: CalendarHeaderStyles
//   'stylesheet.day.basic'?: DayBasicStyles
//   'stylesheet.calendar.main'?: CalendarMainStyles
// } = {
//   backgroundColor: '#9C988B',
//   calendarBackground: '#9C988B',

//   todayTextColor: '#E3E9B9',
//   textDayHeaderFontWeight: '400',
//   textDayFontWeight: 'medium',

//   textDisabledColor: '#8A8680',
//   dayTextColor: '#333333',

//   'stylesheet.calendar.header': Object.fromEntries(
//     Array(7)
//       .fill(null)
//       .map((_, i) => [`dayTextAtIndex${i}`, dayHeaderStyle]),
//   ),
// }

const EditDate = () => {
  const { isDarkColorScheme: dark } = useColorScheme()
  const { fontSize } = useFontSize()

  const today = useMemo(() => new Date().toISOString().split('T')[0], [])
  const createdDate = useMemo(() => formatDate(new Date()), [])
  const createdDateISO = useMemo(
    () => dayjs(new Date()).format('YYYY-MM-DD'),
    [],
  )

  const { id, date } = useLocalSearchParams<{ id: string; date?: string }>()

  const initialDate = date ?? today

  const [localDate, setLocalDate] = useState(initialDate)
  const [currentMonth, setCurrentMonth] = useState(initialDate)

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
  const handleDone = () => {
    router.dismissTo({
      pathname: '/memoirs/[id]',
      params: { id, date: localDate },
    })
  }

  const sectionLabelClass = cn(
    fontSize === 'small' && 'text-xs',
    fontSize === 'medium' && 'text-base',
    fontSize === 'large' && 'text-lg',
  )

  const entryTitleClass = cn(
    fontSize === 'small' && 'text-base',
    fontSize === 'medium' && 'text-lg',
    fontSize === 'large' && 'text-2xl',
  )

  const entryDateClass = cn(
    fontSize === 'small' && 'text-base',
    fontSize === 'medium' && 'text-lg',
    fontSize === 'large' && 'text-xl',
  )

  const helperTextClass = cn(
    fontSize === 'small' && 'text-xs',
    fontSize === 'medium' && 'text-base',
    fontSize === 'large' && 'text-lg',
  )

  const calendarTheme: Theme = useMemo(
    () => {
      const calendarFontSizes = {
        day: fontSize === 'small' ? 14 : fontSize === 'medium' ? 16 : 18,
        header: fontSize === 'small' ? 12 : fontSize === 'medium' ? 14 : 16,
        month: fontSize === 'small' ? 16 : fontSize === 'medium' ? 18 : 20,
      }

      return {
        backgroundColor: dark ? '#4A5340' : '#9C988B',
        calendarBackground: dark ? '#4A5340' : '#9C988B',

        todayTextColor: dark ? '#E8E6D9' : '#E3E9B9',
        textDisabledColor: dark ? '#5A6B4D' : '#8A8680',
        dayTextColor: dark ? '#E8E6D9' : '#333333',

        textDayFontSize: calendarFontSizes.day,
        textDayHeaderFontSize: calendarFontSizes.header,
        textMonthFontSize: calendarFontSizes.month,

        textDayHeaderFontWeight: '400',
        textDayFontWeight: 'medium',

        'stylesheet.calendar.header': Object.fromEntries(
          Array(7)
            .fill(null)
            .map((_, i) => [
              `dayTextAtIndex${i}`,
              {
                ...dayHeaderStyle,
                color: dark ? '#B5C2A3' : '#B8B4A7',
                fontSize: calendarFontSizes.header,
              },
            ]),
        ),
      }
    },
    [dark, fontSize], // Remove calendarFontSizes from deps
  )

  // const calendarTheme: Theme = useMemo(
  //   () => ({
  //     backgroundColor: dark ? '#4A5340' : '#9C988B',
  //     calendarBackground: dark ? '#4A5340' : '#9C988B',

  //     todayTextColor: dark ? '#E8E6D9' : '#E3E9B9',
  //     textDisabledColor: dark ? '#5A6B4D' : '#8A8680',
  //     dayTextColor: dark ? '#E8E6D9' : '#333333',

  //     textDayFontSize: calendarFontSizes.day,
  //     textDayHeaderFontSize: calendarFontSizes.header,
  //     textMonthFontSize: calendarFontSizes.month,

  //     textDayHeaderFontWeight: '400',
  //     textDayFontWeight: 'medium',

  //     'stylesheet.calendar.header': Object.fromEntries(
  //       Array(7)
  //         .fill(null)
  //         .map((_, i) => [
  //           `dayTextAtIndex${i}`,
  //           {
  //             ...dayHeaderStyle,
  //             color: dark ? '#B5C2A3' : '#B8B4A7',
  //             fontSize: calendarFontSizes.header,
  //           },
  //         ]),
  //     ),
  //   }),
  //   [dark, fontSize],
  // )

  const markedDates: MarkedDates = useMemo(
    () => ({
      [localDate]: {
        customStyles: {
          container: {
            borderWidth: 2,
            borderColor:
              localDate === today
                ? dark
                  ? '#B5C2A3'
                  : '#9FB26C'
                : dark
                  ? '#657556'
                  : '#7A8357',
            borderRadius: 20,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor:
              localDate === today
                ? dark
                  ? '#B5C2A3'
                  : '#9FB26C'
                : dark
                  ? '#657556'
                  : '#7A8357',
          },
          text: {
            color:
              localDate === today
                ? dark
                  ? '#2C3526'
                  : '#FFFFFF'
                : dark
                  ? '#E8E6D9'
                  : '#D9E3A6',
            fontWeight: 'bold',
          },
        },
      },
    }),
    [localDate, today, dark],
  )

  return (
    <SafeAreaView
      className={cn('flex-1 p-4', dark ? 'bg-[#899D78]' : 'bg-[#E8E6D9]')}
      edges={['left', 'right', 'bottom']}>
      <Stack.Screen
        options={{
          headerShown: true,
          header: (props) => (
            <Header
              {...props}
              onCancel={handleCancel}
              onDone={handleDone}
              dark={dark}
              fontSize={fontSize}
            />
          ),
        }}
      />
      <Text
        className={cn(
          'px-4',
          sectionLabelClass,
          dark ? 'text-[#E8E6D9]' : 'text-black',
        )}>
        SELECT CUSTOM DATE
      </Text>

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
            dark={dark}
            fontSize={fontSize}
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
        <Text
          className={cn(
            'px-4',
            sectionLabelClass,
            dark ? 'text-[#E8E6D9]' : 'text-black',
          )}>
          USE DATE FROM
        </Text>

        <Pressable
          className={cn(
            'flex-row items-center justify-between p-3 rounded-lg my-2',
            dark ? 'bg-[#4A5340]' : 'bg-[#9C988B]',
          )}
          onPress={() => {
            setLocalDate(createdDateISO)
            setCurrentMonth(createdDateISO)
          }}>
          <Text
            className={cn(
              entryTitleClass,
              dark ? 'text-[#B5C2A3]' : 'text-[#DDD9CC]',
            )}>
            Entry Created
          </Text>
          <Text
            className={cn(
              entryTitleClass,
              dark ? 'text-[#E8E6D9]' : 'text-[#F5F4F0]',
            )}>
            {createdDate}
          </Text>
        </Pressable>
        <Text
          className={cn(
            'px-4',
            helperTextClass,
            dark ? 'text-[#E8E6D9]' : 'text-black',
          )}>
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
