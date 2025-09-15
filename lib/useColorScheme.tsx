import { useColorScheme as useNativewindColorScheme } from 'nativewind'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useEffect } from 'react'

const STORAGE_KEY = 'colorScheme'

export function useColorScheme() {
  const {
    colorScheme,
    setColorScheme: setScheme,
    toggleColorScheme: toggleScheme,
  } = useNativewindColorScheme()

  useEffect(() => {
    const load = async () => {
      const saved = await AsyncStorage.getItem(STORAGE_KEY)
      if (saved === 'light' || saved === 'dark') {
        setScheme(saved)
      } else {
        setScheme('light')
      }
    }
    load()
  }, [setScheme])

  const setColorScheme = async (scheme: 'light' | 'dark' | 'system') => {
    setScheme(scheme)
    if (scheme === 'light' || scheme === 'dark') {
      await AsyncStorage.setItem(STORAGE_KEY, scheme)
    } else {
      await AsyncStorage.removeItem(STORAGE_KEY)
    }
  }

  const toggleColorScheme = async () => {
    const newScheme = colorScheme === 'dark' ? 'light' : 'dark'
    await setColorScheme(newScheme)
  }

  return {
    colorScheme: colorScheme ?? 'light',
    isDarkColorScheme: colorScheme === 'dark',
    setColorScheme,
    toggleColorScheme,
  }
}
