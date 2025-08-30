import { View } from 'react-native'
import { LayoutProps } from './base-five-layout'
import MediaItem from '../media-item'

const TwoSideBySide: React.FC<LayoutProps> = ({
  media,
  start = 0,
  onMediaPress,
  onDeletePress,
  radius,
}) => (
  <View style={{ flexDirection: 'row', gap: 2 }}>
    {media.slice(start, start + 2).map((item, idx) => (
      <MediaItem
        key={item.id}
        media={item}
        onPress={() => onMediaPress(start + idx)}
        onDeletePress={onDeletePress}
        aspect={1}
        radius={radius}
      />
    ))}
  </View>
)

export default TwoSideBySide
