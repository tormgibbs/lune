import { View } from 'react-native'
import MediaItem from '../media-item'
import { LayoutProps } from './base-five-layout'

const TwoStacked: React.FC<LayoutProps> = ({
  media,
  start = 0,
  onMediaPress,
  onDeletePress,
  radius,
}) => (
  <View style={{ flex: 1, flexDirection: 'column', gap: 2 }}>
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
)

export default TwoStacked
