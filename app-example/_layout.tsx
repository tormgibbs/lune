import { PortalHost } from '@rn-primitives/portal'
import { Stack } from 'expo-router'
import { Platform } from 'react-native'

const Layout = () => {
  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="[id]"  
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
        {/* <Stack.Screen name="[id]/index" />
        <Stack.Screen
          name="[id]/edit-date"
          options={{
            presentation: Platform.select({
              ios: 'modal',
              android: 'formSheet',
              default: 'formSheet',
            }),
            gestureDirection: 'vertical',
            animation: 'slide_from_bottom',
          }}
        /> */}
      </Stack>
      <PortalHost name="memoirs-host" />
    </>
  )
}

export default Layout
