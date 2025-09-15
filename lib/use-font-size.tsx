import * as React from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'

export type FontSize = 'small' | 'medium' | 'large'

type FontSizeContextType = {
  fontSize: FontSize
  setFontSize: (size: FontSize) => void
}

const FontSizeContext = React.createContext<FontSizeContextType | undefined>(
  undefined,
)

type FontSizeProviderProps = {
  children: React.ReactNode
}

export function FontSizeProvider({ children }: FontSizeProviderProps) {
  const [fontSize, setFontSizeState] = React.useState<FontSize>('medium')

  React.useEffect(() => {
    const loadFontSize = async () => {
      const saved = await AsyncStorage.getItem('fontSize')
      if (saved) setFontSizeState(saved as FontSize)
    }
    loadFontSize()
  }, [])

  const setFontSize = async (size: FontSize) => {
    setFontSizeState(size)
    await AsyncStorage.setItem('fontSize', size)
  }

  return (
    <FontSizeContext.Provider value={{ fontSize, setFontSize }}>
      {children}
    </FontSizeContext.Provider>
  )
}

export function useFontSize() {
  const context = React.useContext(FontSizeContext)
  if (!context) {
    throw new Error('useFontSize must be used within a FontSizeProvider')
  }
  return context
}
