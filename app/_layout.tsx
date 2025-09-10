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
import * as SplashScreen from 'expo-splash-screen'
import { Appearance, Platform } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { KeyboardProvider } from 'react-native-keyboard-controller'
import { useDBInitialization } from '@/db/use-db-initialization'

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

SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  usePlatformSpecificSetup()
  // const { isDarkColorScheme } = useColorScheme()

  const [loaded] = useDBInitialization()

  React.useEffect(() => {
    if (loaded) {
      SplashScreen.hide()
    }
  }, [loaded])

  if (!loaded) {
    return null
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
            {/* <Toaster /> */}
            <PortalHost name="root-host" />
          </ThemeProvider>
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
