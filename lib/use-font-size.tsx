import * as React from 'react'

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
  const [fontSize, setFontSize] = React.useState<FontSize>('medium')

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
