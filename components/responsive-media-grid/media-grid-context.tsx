import { createContext, useContext } from 'react'

interface MediaGridContextValue {
  editable: boolean
  onDeletePress?: (id: string) => void
}

const MediaGridContext = createContext<MediaGridContextValue>({
  editable: true,
  onDeletePress: undefined,
})

export const useMediaGrid = () => useContext(MediaGridContext)

export const MediaGridProvider: React.FC<{
  value: MediaGridContextValue
  children: React.ReactNode
}> = ({ value, children }) => {
  return (
    <MediaGridContext.Provider value={value}>
      {children}
    </MediaGridContext.Provider>
  )
}
