import React from 'react'
import { Modal } from 'react-native'
import ImageView from 'react-native-image-viewing'
import VideoPlayer from '@/features/memoir/components/video-player'
import { MediaAsset } from '../types/media'

interface MediaViewerProps {
  media: MediaAsset[]
  visible: boolean
  selectedIndex: number
  onClose: () => void
}

const MediaViewer: React.FC<MediaViewerProps> = ({
  media,
  visible,
  selectedIndex,
  onClose,
}) => {
  if (!visible || !media[selectedIndex]) return null

  const currentMedia = media[selectedIndex]

  if (currentMedia.type === 'image') {
    return (
      <ImageView
        images={media.map((item) => ({ uri: item.uri }))}
        imageIndex={selectedIndex}
        visible={visible}
        onRequestClose={onClose}
      />
    )
  }

  return (
    <Modal visible={visible} transparent={true}>
      <VideoPlayer uri={currentMedia.uri} />
    </Modal>
  )
}

export default MediaViewer
