import { View } from 'react-native'
import { MediaAsset } from '@/types/media'
import MediaItem from './media-item'
import BaseFiveLayout from './layouts/base-five-layout'
import TwoSideBySide from './layouts/two-side-by-side'
import TwoStacked from './layouts/two-stacked'
import TwoByTwoGrid from './layouts/two-by-two-grid'
import { MediaGridProvider } from './media-grid-context'
import { Overlay } from './overlay'

interface ResponsiveMediaGridProps {
  media: MediaAsset[]
  onMediaPress: (index: number) => void
  onDeletePress?: (id: string) => void
  editable?: boolean
  mode?: 'full' | 'preview'
  expanded?: boolean
  setExpanded?: (expanded: boolean) => void
}

const ResponsiveMediaGrid: React.FC<ResponsiveMediaGridProps> = ({
  media,
  onMediaPress,
  onDeletePress,
  mode = 'full',
  editable = true,
  expanded = false,
  setExpanded,
}) => {
  // const [expanded, setExpanded] = useState(false)

  const count = media.length
  const radius = 7
  const gap = 2

  return (
    <MediaGridProvider value={{ editable, onDeletePress }}>
      {mode === 'preview' && count >= 6 && !expanded ? (
        <View style={{ flexDirection: 'row', gap }}>
          <MediaItem
            media={media[0]}
            onPress={() => onMediaPress(0)}
            radius={radius}
            aspect={1}
          />
          <View style={{ flex: 1, flexDirection: 'column', gap }}>
            <View style={{ flexDirection: 'row', gap, flex: 1 }}>
              <MediaItem
                media={media[1]}
                onPress={() => onMediaPress(1)}
                fill
                radius={radius}
              />
              <MediaItem
                media={media[2]}
                onPress={() => onMediaPress(2)}
                fill
                radius={radius}
              />
            </View>
            <View style={{ flexDirection: 'row', gap, flex: 1 }}>
              <MediaItem
                media={media[3]}
                onPress={() => onMediaPress(3)}
                fill
                radius={radius}
              />
              <MediaItem
                media={media[4]}
                onPress={() => onMediaPress(4)}
                fill
                radius={radius}>
                <Overlay
                  count={count - 5}
                  radius={radius}
                  onPress={() => setExpanded?.(true)}
                />
              </MediaItem>
            </View>
          </View>
        </View>
      ) : (
        <>
          {count === 1 && (
            <MediaItem
              media={media[0]}
              onPress={() => onMediaPress(0)}
              onDeletePress={onDeletePress}
              aspect={2}
              radius={radius}
            />
          )}

          {count === 2 && (
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
          )}

          {count === 3 && (
            <View style={{ flexDirection: 'row', gap }}>
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
          )}

          {count === 4 && (
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
          )}

          {count === 5 && (
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
          )}

          {count === 6 && (
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
          )}

          {count === 7 && (
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
          )}

          {count === 8 && (
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
          )}

          {count === 9 && (
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
          )}

          {count === 10 && (
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
          )}

          {count === 11 && (
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
          )}

          {count === 12 && (
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
          )}

          {count === 13 && (
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
          )}
        </>
      )}
    </MediaGridProvider>
  )
}

export default ResponsiveMediaGrid
