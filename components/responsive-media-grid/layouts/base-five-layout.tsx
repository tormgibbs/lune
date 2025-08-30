import { MediaAsset } from '@/types/media'
import { View } from 'react-native'
import MediaItem from '../media-item'

export interface LayoutProps {
  media: MediaAsset[]
  onMediaPress: (index: number) => void
  onDeletePress?: (id: string) => void
  radius: number
  start?: number
  editable?: boolean
  maxVisibleItems?: number
}

const BaseFiveLayout: React.FC<LayoutProps> = ({
  media,
  onMediaPress,
  onDeletePress,
  radius,
}) => {
  return (
    <View style={{ flexDirection: 'row', gap: 2 }}>
      <MediaItem
        media={media[0]}
        onPress={() => onMediaPress(0)}
        onDeletePress={onDeletePress}
        aspect={1}
        radius={radius}
      />
      <View style={{ flex: 1, flexDirection: 'column', gap: 2 }}>
        <View style={{ flexDirection: 'row', gap: 2, flex: 1 }}>
          {media.slice(1, 3).map((item, idx) => (
            <MediaItem
              key={item.id}
              media={item}
              onPress={() => onMediaPress(idx + 1)}
              onDeletePress={onDeletePress}
              fill
              radius={radius}
            />
          ))}
        </View>
        <View style={{ flexDirection: 'row', gap: 2, flex: 1 }}>
          {media.slice(3, 5).map((item, idx) => {
            return (
              <MediaItem
                key={item.id}
                media={item}
                onPress={() => onMediaPress(idx + 3)}
                onDeletePress={onDeletePress}
                fill
                radius={radius}
              />
            )
          })}
        </View>
      </View>
    </View>
  )
}

export default BaseFiveLayout
