import { View } from 'react-native'
import MediaItem from '../media-item'
import { LayoutProps } from './base-five-layout'

const TwoByTwoGrid: React.FC<LayoutProps> = ({
  media,
  start = 0,
  onMediaPress,
  onDeletePress,
  radius,
}) => (
  <View style={{ flex: 1, flexDirection: 'column', gap: 2 }}>
    <View style={{ flexDirection: 'row', gap: 2, flex: 1 }}>
      {media.slice(start, start + 2).map((item, idx) => (
        <MediaItem
          key={item.id}
          media={item}
          onPress={() => onMediaPress(start + idx)}
          onDeletePress={onDeletePress}
          fill
          radius={radius}
        />
      ))}
    </View>
    <View style={{ flexDirection: 'row', gap: 2, flex: 1 }}>
      {media.slice(start + 2, start + 4).map((item, idx) => (
        <MediaItem
          key={item.id}
          media={item}
          onPress={() => onMediaPress(start + 2 + idx)}
          onDeletePress={onDeletePress}
          fill
          radius={radius}
        />
      ))}
    </View>
  </View>
)


export default TwoByTwoGrid