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
  // const screenWidth = Dimensions.get('window').width
  const gap = 2
  const radius = 7

  // 1 item full width
  if (count === 1) {
    return (
      <MediaItem
        uri={media[0].uri}
        onPress={() => onMediaPress(0)}
        aspect={2}
        radius={radius}
      />
    )
  }

  // 2 items: half-half
  if (count === 2) {
    return (
      <View style={{ flexDirection: 'row', gap }}>
        {media.map((item, idx) => (
          <MediaItem
            key={item.id}
            uri={item.uri}
            onPress={() => onMediaPress(idx)}
            aspect={1}
            radius={radius}
          />
        ))}
      </View>
    )
  }

  // 3 items: 1 big left, 2 stacked right
  if (count === 3) {
    return (
      <View style={{ flexDirection: 'row', gap }}>
        {/* Left big */}

        <MediaItem
          uri={media[0].uri}
          onPress={() => onMediaPress(0)}
          aspect={1}
          radius={radius}
        />

        {/* Right stacked */}
        <View style={{ flex: 1, flexDirection: 'column', gap }}>
          {media.slice(1, 3).map((item, idx) => (
            <MediaItem
              key={item.id}
              uri={item.uri}
              onPress={() => onMediaPress(idx + 1)}
              aspect={1}
              fill
              radius={radius}
            />
          ))}
        </View>
      </View>
    )
  }

  if (count === 4) {
    return (
      <View style={{ flexDirection: 'row', gap }}>
        {/* Left big */}
        <MediaItem
          uri={media[0].uri}
          onPress={() => onMediaPress(0)}
          aspect={1}
          radius={radius}
        />

        {/* Right column */}
        <View style={{ flex: 1, flexDirection: 'column', gap }}>
          {/* Top full-width */}
          <MediaItem
            uri={media[1].uri}
            onPress={() => onMediaPress(1)}
            fill
            radius={radius}
          />

          {/* Bottom row split into two */}
          <View style={{ flexDirection: 'row', gap, flex: 1 }}>
            {media.slice(2, 4).map((item, idx) => (
              <MediaItem
                key={item.id}
                uri={item.uri}
                onPress={() => onMediaPress(idx + 2)}
                fill
                radius={radius}
              />
            ))}
          </View>
        </View>
      </View>
    )
  }

  if (count === 5) {
    return (
      <View style={{ flexDirection: 'row', gap }}>
        {/* Left big */}
        <MediaItem
          uri={media[0].uri}
          onPress={() => onMediaPress(0)}
          aspect={1}
          radius={radius}
        />

        {/* Right column */}
        <View style={{ flex: 1, flexDirection: 'column', gap }}>
          {/* Top row split */}
          <View style={{ flexDirection: 'row', gap, flex: 1 }}>
            {media.slice(1, 3).map((item, idx) => (
              <MediaItem
                key={item.id}
                uri={item.uri}
                onPress={() => onMediaPress(idx + 1)}
                fill
                radius={radius}
              />
            ))}
          </View>

          {/* Bottom row split */}
          <View style={{ flexDirection: 'row', gap, flex: 1 }}>
            {media.slice(3, 5).map((item, idx) => (
              <MediaItem
                key={item.id}
                uri={item.uri}
                onPress={() => onMediaPress(idx + 3)}
                fill
                radius={radius}
              />
            ))}
          </View>
        </View>
      </View>
    )
  }

  if (count === 6) {
    return (
      <View style={{ flexDirection: 'column', gap }}>
        {/* 
        
        */}
        {/* Row 1 = 5-item layout */}
        <View style={{ flexDirection: 'row', gap }}>
          {/* Left big */}
          <MediaItem
            uri={media[0].uri}
            onPress={() => onMediaPress(0)}
            aspect={1}
            radius={radius}
          />

          {/* Right column */}
          <View style={{ flex: 1, flexDirection: 'column', gap }}>
            {/* Top row split */}
            <View style={{ flexDirection: 'row', gap, flex: 1 }}>
              {media.slice(1, 3).map((item, idx) => (
                <MediaItem
                  key={item.id}
                  uri={item.uri}
                  onPress={() => onMediaPress(idx + 1)}
                  fill
                  radius={radius}
                />
              ))}
            </View>

            {/* Bottom row split */}
            <View style={{ flexDirection: 'row', gap, flex: 1 }}>
              {media.slice(3, 5).map((item, idx) => (
                <MediaItem
                  key={item.id}
                  uri={item.uri}
                  onPress={() => onMediaPress(idx + 3)}
                  fill
                  radius={radius}
                />
              ))}
            </View>
          </View>
        </View>

        {/* Row 2 = full width single image */}
        <MediaItem
          uri={media[5].uri}
          onPress={() => onMediaPress(5)}
          aspect={2}
          radius={radius}
        />
      </View>
    )
  }

  if (count === 7) {
    return (
      <View style={{ flexDirection: 'column', gap }}>
        {/* Row 1 = 5-item layout */}
        <View style={{ flexDirection: 'row', gap }}>
          {/* Left big */}
          <MediaItem
            uri={media[0].uri}
            onPress={() => onMediaPress(0)}
            aspect={1}
            radius={radius}
          />

          {/* Right column */}
          <View style={{ flex: 1, flexDirection: 'column', gap }}>
            {/* Top row split */}
            <View style={{ flexDirection: 'row', gap, flex: 1 }}>
              {media.slice(1, 3).map((item, idx) => (
                <MediaItem
                  key={item.id}
                  uri={item.uri}
                  onPress={() => onMediaPress(idx + 1)}
                  fill
                  radius={radius}
                />
              ))}
            </View>

            {/* Bottom row split */}
            <View style={{ flexDirection: 'row', gap, flex: 1 }}>
              {media.slice(3, 5).map((item, idx) => (
                <MediaItem
                  key={item.id}
                  uri={item.uri}
                  onPress={() => onMediaPress(idx + 3)}
                  fill
                  radius={radius}
                />
              ))}
            </View>
          </View>
        </View>

        {/* Row 2 = 2 side-by-side */}
        <View style={{ flexDirection: 'row', gap }}>
          {media.slice(5, 7).map((item, idx) => (
            <MediaItem
              key={item.id}
              uri={item.uri}
              onPress={() => onMediaPress(idx + 5)}
              aspect={1}
              radius={radius}
            />
          ))}
        </View>
      </View>
    )
  }

  if (count === 8) {
    return (
      <View style={{ flexDirection: 'column', gap }}>
        {/* Row 1 = 5-item layout */}
        <View style={{ flexDirection: 'row', gap }}>
          {/* Left big */}
          <MediaItem
            uri={media[0].uri}
            onPress={() => onMediaPress(0)}
            aspect={1}
            radius={radius}
          />

          {/* Right column */}
          <View style={{ flex: 1, flexDirection: 'column', gap }}>
            {/* Top row split */}
            <View style={{ flexDirection: 'row', gap, flex: 1 }}>
              {media.slice(1, 3).map((item, idx) => (
                <MediaItem
                  key={item.id}
                  uri={item.uri}
                  onPress={() => onMediaPress(idx + 1)}
                  fill
                  radius={radius}
                />
              ))}
            </View>

            {/* Bottom row split */}
            <View style={{ flexDirection: 'row', gap, flex: 1 }}>
              {media.slice(3, 5).map((item, idx) => (
                <MediaItem
                  key={item.id}
                  uri={item.uri}
                  onPress={() => onMediaPress(idx + 3)}
                  fill
                  radius={radius}
                />
              ))}
            </View>
          </View>
        </View>

        {/* Row 2 = left stack (2) + right tall (1) */}
        <View style={{ flexDirection: 'row', gap, aspectRatio: 2 }}>
          {/* Left stack of 2 */}
          <View style={{ flex: 1, flexDirection: 'column', gap }}>
            {media.slice(5, 7).map((item, idx) => (
              <MediaItem
                key={item.id}
                uri={item.uri}
                onPress={() => onMediaPress(idx + 5)}
                fill
                radius={radius}
              />
            ))}
          </View>

          {/* Right full height */}
          <MediaItem
            uri={media[7].uri}
            onPress={() => onMediaPress(7)}
            fill
            radius={radius}
          />
        </View>
      </View>
    )
  }

  if (count === 9) {
    return (
      <View style={{ flexDirection: 'column', gap }}>
        {/* Row 1 = 5-item layout */}
        <View style={{ flexDirection: 'row', gap }}>
          {/* Left big */}
          <MediaItem
            uri={media[0].uri}
            onPress={() => onMediaPress(0)}
            aspect={1}
            radius={radius}
          />

          {/* Right column */}
          <View style={{ flex: 1, flexDirection: 'column', gap }}>
            {/* Top row split */}
            <View style={{ flexDirection: 'row', gap, flex: 1 }}>
              {media.slice(1, 3).map((item, idx) => (
                <MediaItem
                  key={item.id}
                  uri={item.uri}
                  onPress={() => onMediaPress(idx + 1)}
                  fill
                  radius={radius}
                />
              ))}
            </View>

            {/* Bottom row split */}
            <View style={{ flexDirection: 'row', gap, flex: 1 }}>
              {media.slice(3, 5).map((item, idx) => (
                <MediaItem
                  key={item.id}
                  uri={item.uri}
                  onPress={() => onMediaPress(idx + 3)}
                  fill
                  radius={radius}
                />
              ))}
            </View>
          </View>
        </View>

        {/* Row 2 = left (stack: 1 + 2), right (single) */}
        <View style={{ flexDirection: 'row', gap, aspectRatio: 2 }}>
          {/* Left half */}
          <View style={{ flex: 1, flexDirection: 'column', gap }}>
            {/* Top single */}
            <MediaItem
              uri={media[5].uri}
              onPress={() => onMediaPress(5)}
              fill
              radius={radius}
            />
            {/* Bottom two side-by-side */}
            <View style={{ flexDirection: 'row', gap, flex: 1 }}>
              {media.slice(6, 8).map((item, idx) => (
                <MediaItem
                  key={item.id}
                  uri={item.uri}
                  onPress={() => onMediaPress(idx + 6)}
                  fill
                  radius={radius}
                />
              ))}
            </View>
          </View>

          {/* Right half = single full */}
          <MediaItem
            uri={media[8].uri}
            onPress={() => onMediaPress(8)}
            fill
            radius={radius}
          />
        </View>
      </View>
    )
  }

  if (count === 10) {
    return (
      <View style={{ flexDirection: 'column', gap }}>
        {/* Row 1 = 5-item layout */}
        <View style={{ flexDirection: 'row', gap }}>
          {/* Left big */}
          <MediaItem
            uri={media[0].uri}
            onPress={() => onMediaPress(0)}
            aspect={1}
            radius={radius}
          />

          {/* Right column */}
          <View style={{ flex: 1, flexDirection: 'column', gap }}>
            {/* Top row split */}
            <View style={{ flexDirection: 'row', gap, flex: 1 }}>
              {media.slice(1, 3).map((item, idx) => (
                <MediaItem
                  key={item.id}
                  uri={item.uri}
                  onPress={() => onMediaPress(idx + 1)}
                  fill
                  radius={radius}
                />
              ))}
            </View>

            {/* Bottom row split */}
            <View style={{ flexDirection: 'row', gap, flex: 1 }}>
              {media.slice(3, 5).map((item, idx) => (
                <MediaItem
                  key={item.id}
                  uri={item.uri}
                  onPress={() => onMediaPress(idx + 3)}
                  fill
                  radius={radius}
                />
              ))}
            </View>
          </View>
        </View>

        {/* Row 2 = left 2x2 grid, right full */}
        <View style={{ flexDirection: 'row', gap, aspectRatio: 2 }}>
          {/* Left 2x2 grid */}
          <View style={{ flex: 1, flexDirection: 'column', gap }}>
            {/* Top row 2 side-by-side */}
            <View style={{ flexDirection: 'row', gap, flex: 1 }}>
              {media.slice(5, 7).map((item, idx) => (
                <MediaItem
                  key={item.id}
                  uri={item.uri}
                  onPress={() => onMediaPress(idx + 5)}
                  fill
                  radius={radius}
                />
              ))}
            </View>

            {/* Bottom row 2 side-by-side */}
            <View style={{ flexDirection: 'row', gap, flex: 1 }}>
              {media.slice(7, 9).map((item, idx) => (
                <MediaItem
                  key={item.id}
                  uri={item.uri}
                  onPress={() => onMediaPress(idx + 7)}
                  fill
                  radius={radius}
                />
              ))}
            </View>
          </View>

          {/* Right full single */}
          <MediaItem
            uri={media[9].uri}
            onPress={() => onMediaPress(9)}
            fill
            radius={radius}
          />
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

const MediaItem = ({
  uri,
  onPress,
  aspect = 1,
  radius = 7,
  fill = false,
}: {
  uri: string
  onPress: () => void
  aspect?: number
  radius?: number
  fill?: boolean
}) => (
  <Pressable onPress={onPress} style={{ flex: 1 }}>
    <Image
      source={{ uri }}
      style={
        fill
          ? { width: '100%', height: '100%', borderRadius: radius }
          : { width: '100%', aspectRatio: aspect, borderRadius: radius }
      }
      contentFit="cover"
    />
  </Pressable>
)

type Media = {
  id: string
  uri: string
}

type LayoutProps = {
  media: Media[]
  onMediaPress: (index: number) => void
  radius: number
  start?: number
}

const BaseFiveLayout: React.FC<LayoutProps> = ({
  media,
  onMediaPress,
  radius,
}) => (
  <View style={{ flexDirection: 'row', gap: 2 }}>
    <MediaItem
      uri={media[0].uri}
      onPress={() => onMediaPress(0)}
      aspect={1}
      radius={radius}
    />
    <View style={{ flex: 1, flexDirection: 'column', gap: 2 }}>
      <View style={{ flexDirection: 'row', gap: 2, flex: 1 }}>
        {media.slice(1, 3).map((item, idx) => (
          <MediaItem
            key={item.id}
            uri={item.uri}
            onPress={() => onMediaPress(idx + 1)}
            fill
            radius={radius}
          />
        ))}
      </View>
      <View style={{ flexDirection: 'row', gap: 2, flex: 1 }}>
        {media.slice(3, 5).map((item, idx) => (
          <MediaItem
            key={item.id}
            uri={item.uri}
            onPress={() => onMediaPress(idx + 3)}
            fill
            radius={radius}
          />
        ))}
      </View>
    </View>
  </View>
)

const TwoSideBySide: React.FC<LayoutProps> = ({
  media,
  start = 0,
  onMediaPress,
  radius,
}) => (
  <View style={{ flexDirection: 'row', gap: 2 }}>
    {media.slice(start, start + 2).map((item, idx) => (
      <MediaItem
        key={item.id}
        uri={item.uri}
        onPress={() => onMediaPress(start + idx)}
        aspect={1}
        radius={radius}
      />
    ))}
  </View>
)

const TwoStacked: React.FC<LayoutProps> = ({
  media,
  start = 0,
  onMediaPress,
  radius,
}) => (
  <View style={{ flex: 1, flexDirection: 'column', gap: 2 }}>
    {media.slice(start, start + 2).map((item, idx) => (
      <MediaItem
        key={item.id}
        uri={item.uri}
        onPress={() => onMediaPress(start + idx)}
        fill
        radius={radius}
      />
    ))}
  </View>
)

const TwoByTwoGrid: React.FC<LayoutProps> = ({
  media,
  start = 0,
  onMediaPress,
  radius,
}) => (
  <View style={{ flex: 1, flexDirection: 'column', gap: 2 }}>
    <View style={{ flexDirection: 'row', gap: 2, flex: 1 }}>
      {media.slice(start, start + 2).map((item, idx) => (
        <MediaItem
          key={item.id}
          uri={item.uri}
          onPress={() => onMediaPress(start + idx)}
          fill
          radius={radius}
        />
      ))}
    </View>
    <View style={{ flexDirection: 'row', gap: 2, flex: 1 }}>
      {media.slice(start + 2, start + 4).map((item, idx) => (
        <MediaItem
          key={item.id}
          uri={item.uri}
          onPress={() => onMediaPress(start + 2 + idx)}
          fill
          radius={radius}
        />
      ))}
    </View>
  </View>
)
