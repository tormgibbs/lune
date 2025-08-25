export type MediaType =
  | 'image'
  | 'video'
  | 'audio'
  | 'livePhoto'
  | 'pairedVideo'
  | undefined

export interface MediaAsset {
  uri: string
  type: MediaType
  duration?: number
  id?: string
  persisted?: boolean
}

export interface MediaViewerState {
  visible: boolean
  selectedIndex: number
}
