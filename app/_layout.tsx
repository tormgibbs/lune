import '@/global.css'

// import { ThemeToggle } from '@/components/ThemeToggle'
import { setAndroidNavigationBar } from '@/lib/android-navigation-bar'
import { NAV_THEME } from '@/lib/constants'
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'
// import { useColorScheme } from '@/lib/useColorScheme'
import {
  // DarkTheme,
  DefaultTheme,
  Theme,
  ThemeProvider,
} from '@react-navigation/native'
import { PortalHost } from '@rn-primitives/portal'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import * as React from 'react'
import { Appearance, Platform } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { KeyboardProvider } from 'react-native-keyboard-controller'

import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator'
import migrations from '@/drizzle/migrations'
import { db } from '@/db'

import { useMemoirStore } from '@/store/memoir'
import { getAllMemoirs } from '@/db/memoir'

const LIGHT_THEME: Theme = {
  ...DefaultTheme,
  colors: NAV_THEME.light,
}
// const DARK_THEME: Theme = {
//   ...DarkTheme,
//   colors: NAV_THEME.dark,
// }

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router'

const usePlatformSpecificSetup = Platform.select({
  web: useSetWebBackgroundClassName,
  android: useSetAndroidNavigationBar,
  default: noop,
})

export default function RootLayout() {
  usePlatformSpecificSetup()
  const { success, error } = useMigrations(db, migrations)
  const setMemoirs = useMemoirStore((s) => s.setMemoirs)
  // const { isDarkColorScheme } = useColorScheme()


  React.useEffect(() => {
    if (!success) return
    ;(async () => {
      try {
        const memoirs = await getAllMemoirs()
        setMemoirs(memoirs)
      } catch (err) {
        console.error('Failed to load memoirs:', err)
      }
    })()
  }, [success])

  if (!success) return null

  if (error) {
    console.error('Database migration error:', error)
  }


  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <KeyboardProvider
          
          // navigationBarTranslucent={Platform.OS === 'android'}
          preserveEdgeToEdge={Platform.OS === 'android'}
          statusBarTranslucent={Platform.OS === 'android'}>
          <ThemeProvider value={LIGHT_THEME}>
            <StatusBar style={'dark'} />
            <Stack
              screenOptions={{
                headerShown: false,
              }}>
              <Stack.Screen name="index" />
              <Stack.Screen
                name="memoirs/[id]/index"
                options={{
                  presentation: Platform.select({
                    ios: 'modal',
                    android: 'formSheet',
                    default: 'formSheet',
                  }),
                  gestureDirection: 'vertical',
                  animation: 'slide_from_bottom',
                }}
              />
              <Stack.Screen
                name="memoirs/[id]/edit-date"
                options={{
                  presentation: Platform.select({
                    ios: 'modal',
                    android: 'formSheet',
                    default: 'formSheet',
                  }),
                  gestureDirection: 'vertical',
                  animation: 'slide_from_bottom',
                }}
              />
            </Stack>
          </ThemeProvider>
          <PortalHost name="root-host" />
        </KeyboardProvider>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  )
}

const useIsomorphicLayoutEffect =
  Platform.OS === 'web' && typeof window === 'undefined'
    ? React.useEffect
    : React.useLayoutEffect

function useSetWebBackgroundClassName() {
  useIsomorphicLayoutEffect(() => {
    // Adds the background color to the html element to prevent white background on overscroll.
    document.documentElement.classList.add('bg-background')
  }, [])
}

function useSetAndroidNavigationBar() {
  React.useLayoutEffect(() => {
    setAndroidNavigationBar(Appearance.getColorScheme() ?? 'light')
  }, [])
}

function noop() {}
