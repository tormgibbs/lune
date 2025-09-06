import { View, Dimensions, Modal } from 'react-native'
import PagerView from 'react-native-pager-view'
import { MediaAsset } from '@/types/media'
import { Image } from 'expo-image'
import {  useRef, useState } from 'react'
import VideoPlayer from '@/features/memoir/components/video-player'
import AudioPlayer from './audio-player'

interface MediaPagerProps {
  media: MediaAsset[]
  visible: boolean
  selectedIndex: number
  onClose: () => void
}

const { width, height } = Dimensions.get('window')

const MediaPager: React.FC<MediaPagerProps> = ({
  media,
  visible,
  selectedIndex,
  onClose,
}) => {
  const pagerRef = useRef<PagerView>(null)
  const [currentIndex, setCurrentIndex] = useState(selectedIndex)

  if (!visible || !media.length) return null

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={false}
      backdropColor="black"
      onRequestClose={onClose}
      onShow={() => {
        pagerRef.current?.setPageWithoutAnimation(selectedIndex)
      }}>
      <PagerView
        ref={pagerRef}
        style={{ flex: 1 }}
        initialPage={selectedIndex}
        onPageSelected={(e) => setCurrentIndex(e.nativeEvent.position)}>
        {media.map((item, index) => {
          if (item.type === 'image') {
            return (
              <View
                key={index}
                className="flex-1 bg-black justify-center items-center">
                <Image
                  style={{ width, height }}
                  source={{ uri: item.uri }}
                  contentFit="contain"
                />
              </View>
            )
          }

          if (item.type === 'video') {
            return (
              <VideoPlayer
                key={index}
                uri={item.uri}
                isActive={currentIndex === index}
                width={width}
                height={height}
              />
            )
          }

          if (item.type === 'audio') {
            return (
              <AudioPlayer
                key={index}
                audio={item}
                isActive={currentIndex === index}
                width={width}
                height={height}
              />
            )
          }

          return null
        })}
      </PagerView>
    </Modal>
  )
}

export default MediaPager
