import { Memoir } from '@/db/schema'
import { View, Text, useWindowDimensions, Pressable } from 'react-native'
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable'
import { Separator } from './ui/separator'
import { formatDate } from '@/lib/date'
import {
  Bookmark,
  ChevronDown,
  Ellipsis,
  Pen,
  Trash2,
} from 'lucide-react-native'
import RenderHtml, {
  HTMLContentModel,
  HTMLElementModel,
  CustomRendererProps,
} from 'react-native-render-html'
import { Button } from './ui/button'
import Animated, {
  interpolate,
  useAnimatedStyle,
  SharedValue,
  withSpring,
  withTiming,
  useSharedValue,
} from 'react-native-reanimated'
import { ComponentRef, useEffect, useRef, useState } from 'react'
import ResponsiveMediaGrid from './responsive-media-grid'
import { cn } from '@/lib/utils'
import { useBottomSheet } from './bottom-sheet-provider'

interface MemoirItemProps {
  memoir: Memoir
  onDelete?: (id: string) => void
  onEdit?: (id: string) => void
  onBookmarkPress?: (id: string) => void
  onMediaPress: (mediaIndex: number) => void
}

const customHTMLElementModels = {
  font: HTMLElementModel.fromCustomModel({
    tagName: 'font',
    contentModel: HTMLContentModel.mixed,
  }),
}

const renderers = {
  font: ({ tnode, TDefaultRenderer, ...props }: CustomRendererProps<any>) => {
    const { color, size, face } = tnode.attributes
    const style = {
      color: color || undefined,
      fontSize: size ? parseInt(size) : undefined,
      fontFamily: face || undefined,
    }

    return (
      <Text style={style}>
        <TDefaultRenderer tnode={tnode} {...props} />
      </Text>
    )
  },
  b: ({ tnode, TDefaultRenderer, ...props }: CustomRendererProps<any>) => {
    return (
      <Text style={{ fontWeight: 'bold' }}>
        <TDefaultRenderer tnode={tnode} {...props} />
      </Text>
    )
  },
  i: ({ tnode, TDefaultRenderer, ...props }: CustomRendererProps<any>) => {
    return (
      <Text style={{ fontStyle: 'italic' }}>
        <TDefaultRenderer tnode={tnode} {...props} />
      </Text>
    )
  },
  u: ({ tnode, TDefaultRenderer, ...props }: CustomRendererProps<any>) => {
    return (
      <Text style={{ textDecorationLine: 'underline' }}>
        <TDefaultRenderer tnode={tnode} {...props} />
      </Text>
    )
  },
  strike: ({ tnode, TDefaultRenderer, ...props }: CustomRendererProps<any>) => {
    return (
      <Text style={{ textDecorationLine: 'line-through' }}>
        <TDefaultRenderer tnode={tnode} {...props} />
      </Text>
    )
  },
  blockquote: ({
    tnode,
    TDefaultRenderer,
    ...props
  }: CustomRendererProps<any>) => {
    return (
      <View
        style={{
          borderLeftWidth: 4,
          borderLeftColor: '#9CA082',
          borderRadius: 2,
          paddingLeft: 5,
          marginVertical: 2,
        }}>
        <TDefaultRenderer tnode={tnode} {...props} />
      </View>
    )
  },
}

const cleanHtml = (html: string) => {
  return html
    .replace(
      /<div[^>]*>\s*(<[^>]*>)*\s*<br\s*\/?>\s*(<\/[^>]*>)*\s*<\/div>/gi,
      '',
    )

    .replace(/<div[^>]*>\s*<\/div>/gi, '')

    .replace(/(<\/div>)\s*<br\s*\/?>\s*(<div)/gi, '$1$2')

    .replace(/(<br\s*\/?>)\s*(<br\s*\/?>)+/gi, '$1')

    .replace(/<([^>]+)>\s*<\/\1>/gi, '')

    .trim()
}

const truncateHtmlByLines = (html: string, maxLines: number) => {
  if (!html) return ''

  // Split by common block elements
  const lines = html.split(/<\/div>|<\/p>|<\/li>|<br\s*\/?>/i)

  // Take only the first maxLines lines
  const truncated = lines.slice(0, maxLines).join('')

  return truncated
}

const MemoirItem = ({
  memoir,
  onDelete,
  onEdit,
  onMediaPress,
  onBookmarkPress,
}: MemoirItemProps) => {
  const width = useWindowDimensions().width - 32
  const swipeableRef = useRef<ComponentRef<typeof Swipeable>>(null)

  const [expanded, setExpanded] = useState(false)

  const maxLines = memoir.media?.length ? 5 : 10

  const { openBottomSheet } = useBottomSheet()

  const bookmarkScale = useSharedValue(memoir.bookmark ? 1 : 0)

  const handleEdit = () => {
    onEdit?.(memoir.id)
    swipeableRef.current?.close()
  }

  const handleDelete = () => {
    onDelete?.(memoir.id)
  }

  console.log('Raw content:', memoir.content)

  const cleanedContent = memoir.content ? cleanHtml(memoir.content) : ''
  const displayedContent = expanded
    ? cleanedContent
    : truncateHtmlByLines(cleanedContent, maxLines)

  const isTruncated = !expanded && displayedContent.length < cleanedContent.length

  console.log('Cleaned content:', cleanedContent)

  const bookmarkStyle = useAnimatedStyle(() => ({
    transform: [{ scale: bookmarkScale.value }],
    opacity: bookmarkScale.value, // optional fade
  }))

  useEffect(() => {
    bookmarkScale.value = memoir.bookmark
      ? withSpring(1)
      : withTiming(0, { duration: 150 })
  }, [memoir.bookmark])

  return (
    <Swipeable
      ref={swipeableRef}
      renderRightActions={(progress, dragX) => (
        <RightActions
          progress={progress}
          onEdit={handleEdit}
          onDelete={handleDelete}
          memoirId={memoir.id}
        />
      )}>
      <View className="px-4">
        <View className="px-2 py-2 bg-[#E6E9D8] rounded-xl">
          <ResponsiveMediaGrid
            media={memoir.media ?? []}
            editable={false}
            mode="preview"
            onMediaPress={onMediaPress}
            expanded={expanded}
            setExpanded={setExpanded}
          />
          <View
            className={cn(memoir.title || memoir.content ? 'py-2' : 'py-0')}>
            {memoir.title && memoir.titleVisible && (
              <Text className="text-base font-semibold">{memoir.title}</Text>
            )}
            {memoir.content && (
              <Pressable
                className="relative"
                onPress={() => setExpanded(!expanded)}>
                <RenderHtml
                  contentWidth={width}
                  source={{ html: displayedContent }}
                  customHTMLElementModels={customHTMLElementModels}
                  renderers={renderers}
                />
                {isTruncated && (
                  <View className="absolute bottom-1 right-2">
                    <ChevronDown />
                  </View>
                )}
              </Pressable>
            )}
          </View>
          <Separator className="my-1 bg-[#9CA082]" />
          <View className="flex-row items-center justify-between">
            <Text className="text-sm font-medium text-gray-500">
              {formatDate(memoir.date)}
            </Text>

            <View className="flex-row items-center gap-5">
              <Animated.View style={bookmarkStyle}>
                <Bookmark size={16} fill="#6C7A45" color="#6C7A45" />
              </Animated.View>

              <Pressable
                hitSlop={15}
                onPress={() =>
                  openBottomSheet({
                    id: memoir.id,
                    isBookMarked: memoir.bookmark,
                    onEdit,
                    onDelete,
                    onBookmarkPress,
                  })
                }>
                <Ellipsis size={20} color="gray" />
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </Swipeable>
  )
}

export default MemoirItem

const RightActions = ({
  progress,
  onEdit,
  onDelete,
  memoirId,
}: {
  progress: SharedValue<number>
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
  memoirId: string
}) => {
  const editStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: interpolate(progress.value, [0.3, 1], [0.6, 1], 'clamp') },
    ],
    opacity: interpolate(progress.value, [0.3, 1], [0, 1], 'clamp'),
  }))

  const deleteStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: interpolate(progress.value, [0, 0.6], [0.6, 1], 'clamp') },
    ],
    opacity: interpolate(progress.value, [0, 0.6], [0, 1], 'clamp'),
  }))

  return (
    <View className="flex-row gap-4 items-center pr-4 pl-1">
      <Animated.View style={editStyle}>
        <Button
          size="icon"
          variant="secondary"
          className="rounded-full p-7 bg-[#2b311a]"
          onPress={() => onEdit?.(memoirId)}>
          <Pen color="white" size={28} />
        </Button>
      </Animated.View>

      <Animated.View style={deleteStyle}>
        <Button
          size="icon"
          variant="destructive"
          className="rounded-full p-7"
          onPress={() => onDelete?.(memoirId)}>
          <Trash2 color="white" size={28} />
        </Button>
      </Animated.View>
    </View>
  )
}
