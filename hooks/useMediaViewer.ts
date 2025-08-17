import { useState } from 'react'
import { MediaViewerState } from '../types/media'

export const useMediaViewer = () => {
  const [viewerState, setViewerState] = useState<MediaViewerState>({
    visible: false,
    selectedIndex: 0,
  })

  const openViewer = (index: number) => {
    setViewerState({
      visible: true,
      selectedIndex: index,
    })
  }

  const closeViewer = () => {
    setViewerState((prev) => ({
      ...prev,
      visible: false,
    }))
  }

  return {
    ...viewerState,
    openViewer,
    closeViewer,
  }
}
