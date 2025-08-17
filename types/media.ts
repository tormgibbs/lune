export type MediaType =
  | 'image'
  | 'video'
  | 'livePhoto'
  | 'pairedVideo'
  | undefined

export interface MediaAsset {
  uri: string
  type: MediaType
  duration?: number
  id?: string
}

export interface MediaViewerState {
  visible: boolean
  selectedIndex: number
}
