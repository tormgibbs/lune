import React from 'react'
import { View, Pressable, Dimensions } from 'react-native'
import { Image } from 'expo-image'
import { FlashList } from '@shopify/flash-list'
import { MediaAsset } from '@/types/media'

interface ResponsiveMediaGridProps {
  media: MediaAsset[]
  onMediaPress: (index: number) => void
}

const ResponsiveMediaGrid: React.FC<ResponsiveMediaGridProps> = ({
  media,
  onMediaPress,
}) => {
  if (!media.length) return null

  const count = media.length
  const screenWidth = Dimensions.get('window').width
  const gap = 4
  const radius = 8

  // 1 item full width
  if (count === 1) {
    return (
      <Pressable onPress={() => onMediaPress(0)}>
        <Image
          source={{ uri: media[0].uri }}
          style={{
            width: screenWidth - 32,
            aspectRatio: 1,
            borderRadius: radius,
          }}
        />
      </Pressable>
    )
  }

  // 2 items: half-half
  if (count === 2) {
    return (
      <View style={{ flexDirection: 'row', gap }}>
        {media.map((item, idx) => (
          <Pressable key={item.id} onPress={() => onMediaPress(idx)} style={{ flex: 1 }}>
            <Image
              source={{ uri: item.uri }}
              style={{ width: '100%', aspectRatio: 1, borderRadius: radius }}
            />
          </Pressable>
        ))}
      </View>
    )
  }

  // 3 items: 1 big left, 2 stacked right
  if (count === 3) {
    return (
      <View style={{ flexDirection: 'row', gap }}>
        {/* Left */}
        <Pressable onPress={() => onMediaPress(0)} style={{ flex: 1 }}>
          <Image
            source={{ uri: media[0].uri }}
            style={{ width: '100%', aspectRatio: 1, borderRadius: radius }}
          />
        </Pressable>

        {/* Right stacked */}
        <View style={{ flex: 1, flexDirection: 'column', gap }}>
          {[media[1], media[2]].map((item, idx) => (
            <Pressable
              key={item.id}
              onPress={() => onMediaPress(idx + 1)}
              style={{ flex: 1 }}>
              <Image
                source={{ uri: item.uri }}
                style={{ width: '100%', height: '100%', borderRadius: radius }}
              />
            </Pressable>
          ))}
        </View>
      </View>
    )
  }

  // 4+ items: fallback to grid
  return (
    <FlashList
      data={media}
      numColumns={3}
      renderItem={({ item, index }) => (
        <Pressable
          onPress={() => onMediaPress(index)}
          style={{ flex: 1, margin: gap / 2 }}>
          <Image
            source={{ uri: item.uri }}
            style={{ width: '100%', aspectRatio: 1, borderRadius: radius }}
          />
        </Pressable>
      )}
    />
  )
}

export default ResponsiveMediaGrid
