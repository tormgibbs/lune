import React, { useState } from 'react'
import { View } from 'react-native'
import { MediaAsset } from '@/types/media'
import MediaItem from './media-item'
import BaseFiveLayout from './layouts/base-five-layout'
import TwoSideBySide from './layouts/two-side-by-side'
import TwoStacked from './layouts/two-stacked'
import TwoByTwoGrid from './layouts/two-by-two-grid'
import { MediaGridProvider } from './media-grid-context'

interface ResponsiveMediaGridProps {
  media: MediaAsset[]
  onMediaPress: (index: number) => void
  onDeletePress?: (id: string) => void
  editable?: boolean
  maxVisibleItems?: number
}

const ResponsiveMediaGrid: React.FC<ResponsiveMediaGridProps> = ({
  media,
  onMediaPress,
  onDeletePress,
  editable = true,
}) => {
  const count = media.length
  const radius = 7
  const gap = 2



  // 1 item full width
  if (count === 1) {
    return (
      <MediaItem
        media={media[0]}
        onPress={() => onMediaPress(0)}
        onDeletePress={onDeletePress}
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
            media={item}
            onPress={() => onMediaPress(idx)}
            onDeletePress={onDeletePress}
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
          media={media[0]}
          onPress={() => onMediaPress(0)}
          onDeletePress={onDeletePress}
          aspect={1}
          radius={radius}
        />

        {/* Right stacked */}
        <View style={{ flex: 1, flexDirection: 'column', gap }}>
          {media.slice(1, 3).map((item, idx) => (
            <MediaItem
              key={item.id}
              media={item}
              onPress={() => onMediaPress(idx + 1)}
              onDeletePress={onDeletePress}
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
          media={media[0]}
          onPress={() => onMediaPress(0)}
          onDeletePress={onDeletePress}
          aspect={1}
          radius={radius}
        />

        {/* Right column */}
        <View style={{ flex: 1, flexDirection: 'column', gap }}>
          {/* Top full-width */}
          <MediaItem
            media={media[1]}
            onPress={() => onMediaPress(1)}
            onDeletePress={onDeletePress}
            fill
            radius={radius}
          />

          {/* Bottom row split into two */}
          <View style={{ flexDirection: 'row', gap, flex: 1 }}>
            {media.slice(2, 4).map((item, idx) => (
              <MediaItem
                key={item.id}
                media={item}
                onPress={() => onMediaPress(idx + 2)}
                onDeletePress={onDeletePress}
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
          media={media[0]}
          onPress={() => onMediaPress(0)}
          onDeletePress={onDeletePress}
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
                media={item}
                onPress={() => onMediaPress(idx + 1)}
                onDeletePress={onDeletePress}
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
                media={item}
                onPress={() => onMediaPress(idx + 3)}
                onDeletePress={onDeletePress}
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
        <BaseFiveLayout
          media={media}
          onMediaPress={onMediaPress}
          onDeletePress={onDeletePress}
          radius={radius}
        />
        <MediaItem
          media={media[5]}
          onPress={() => onMediaPress(5)}
          onDeletePress={onDeletePress}
          aspect={2}
          radius={radius}
        />
      </View>
    )
  }

  if (count === 7) {
    return (
      <View style={{ flexDirection: 'column', gap }}>
        <BaseFiveLayout
          media={media}
          onMediaPress={onMediaPress}
          onDeletePress={onDeletePress}
          radius={radius}
        />
        <TwoSideBySide
          media={media}
          start={5}
          onMediaPress={onMediaPress}
          onDeletePress={onDeletePress}
          radius={radius}
        />
      </View>
    )
  }

  if (count === 8) {
    return (
      <View style={{ flexDirection: 'column', gap }}>
        <BaseFiveLayout
          media={media}
          onMediaPress={onMediaPress}
          onDeletePress={onDeletePress}
          radius={radius}
        />

        <View style={{ flexDirection: 'row', gap, aspectRatio: 2 }}>
          <TwoStacked
            media={media}
            start={5}
            onMediaPress={onMediaPress}
            onDeletePress={onDeletePress}
            radius={radius}
          />
          <MediaItem
            media={media[7]}
            onPress={() => onMediaPress(7)}
            onDeletePress={onDeletePress}
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
        <BaseFiveLayout
          media={media}
          onMediaPress={onMediaPress}
          onDeletePress={onDeletePress}
          radius={radius}
        />

        {/* Row 2 = left (stack: 1 + 2), right (single) */}
        <View style={{ flexDirection: 'row', gap, aspectRatio: 2 }}>
          {/* Left half */}
          <View style={{ flex: 1, flexDirection: 'column', gap }}>
            {/* Top single */}
            <MediaItem
              media={media[5]}
              onPress={() => onMediaPress(5)}
              onDeletePress={onDeletePress}
              fill
              radius={radius}
            />
            {/* Bottom two side-by-side */}
            <TwoSideBySide
              media={media}
              start={6}
              onMediaPress={onMediaPress}
              onDeletePress={onDeletePress}
              radius={radius}
            />
          </View>

          {/* Right half = single full */}
          <MediaItem
            media={media[8]}
            onPress={() => onMediaPress(8)}
            onDeletePress={onDeletePress}
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
        <BaseFiveLayout
          media={media}
          onMediaPress={onMediaPress}
          onDeletePress={onDeletePress}
          radius={radius}
        />

        {/* Row 2 = left 2x2 grid, right full */}
        <View style={{ flexDirection: 'row', gap, aspectRatio: 2 }}>
          {/* Left 2x2 grid */}
          <TwoByTwoGrid
            media={media}
            start={5}
            onMediaPress={onMediaPress}
            onDeletePress={onDeletePress}
            radius={radius}
          />

          {/* Right full single */}
          <MediaItem
            media={media[9]}
            onPress={() => onMediaPress(9)}
            onDeletePress={onDeletePress}
            fill
            radius={radius}
          />
        </View>
      </View>
    )
  }

  if (count === 11) {
    return (
      <View style={{ flexDirection: 'column', gap }}>
        <BaseFiveLayout
          media={media}
          onMediaPress={onMediaPress}
          onDeletePress={onDeletePress}
          radius={radius}
        />

        {/* 2x2 grid */}
        <View style={{ flexDirection: 'row', gap, aspectRatio: 2 }}>
          {/* Left 2x2 grid */}
          <TwoByTwoGrid
            media={media}
            start={5}
            onMediaPress={onMediaPress}
            onDeletePress={onDeletePress}
            radius={radius}
          />

          {/* Right stacked */}
          <TwoStacked
            media={media}
            start={9}
            onMediaPress={onMediaPress}
            onDeletePress={onDeletePress}
            radius={radius}
          />
        </View>
      </View>
    )
  }

  if (count === 12) {
    return (
      <View style={{ flexDirection: 'column', gap: 2 }}>
        <BaseFiveLayout
          media={media}
          onMediaPress={onMediaPress}
          onDeletePress={onDeletePress}
          radius={radius}
        />

        <View style={{ flexDirection: 'row', gap, aspectRatio: 2 }}>
          <TwoByTwoGrid
            media={media}
            start={5}
            onMediaPress={onMediaPress}
            onDeletePress={onDeletePress}
            radius={radius}
          />

          <TwoByTwoGrid
            media={media}
            start={9}
            onMediaPress={onMediaPress}
            onDeletePress={onDeletePress}
            radius={radius}
          />
        </View>
      </View>
    )
  }

  if (count === 13) {
    return (
      <View style={{ flexDirection: 'column', gap: 2 }}>
        <BaseFiveLayout
          media={media}
          onMediaPress={onMediaPress}
          onDeletePress={onDeletePress}
          radius={radius}
        />

        <View style={{ flexDirection: 'row', gap, aspectRatio: 2 }}>
          <TwoByTwoGrid
            media={media}
            start={5}
            onMediaPress={onMediaPress}
            onDeletePress={onDeletePress}
            radius={radius}
          />

          <TwoByTwoGrid
            media={media}
            start={9}
            onMediaPress={onMediaPress}
            onDeletePress={onDeletePress}
            radius={radius}
          />
        </View>
      </View>
    )
  }
}

export default ResponsiveMediaGrid
