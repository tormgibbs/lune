import { Text } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router, Stack } from 'expo-router'
import Header from '@/features/memoir/components/headers/edit-date'

const EditDate = () => {
  const handleCancel = () => {
    router.back()
  }

  const handleDone = () => {
    // Handle the done action, e.g., save changes
    router.back()
  }

  return (
    <SafeAreaView>
      <Stack.Screen
        options={{
          presentation: 'formSheet',
          headerShown: true,
          animation: 'slide_from_bottom',
          header: (props) => (
            <Header {...props} onCancel={handleCancel} onDone={handleDone} />
          ),
        }}
      />
      <Text>EditDate</Text>
    </SafeAreaView>
  )
}

export default EditDate
