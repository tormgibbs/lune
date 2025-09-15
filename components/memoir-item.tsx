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
import { useColorScheme } from '@/lib/useColorScheme'
import { FontSize, useFontSize } from '@/lib/use-font-size'

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


const MemoirItem = ({
  memoir,
  onDelete,
  onEdit,
  onMediaPress,
  onBookmarkPress,
}: MemoirItemProps) => {
  const { isDarkColorScheme: dark } = useColorScheme()
  const { fontSize } = useFontSize()

  const width = useWindowDimensions().width - 32
  const swipeableRef = useRef<ComponentRef<typeof Swipeable>>(null)

  const cleanedContent = memoir.content ? cleanHtml(memoir.content) : ''

  const [expanded, setExpanded] = useState(false)
  const [contentHeight, setContentHeight] = useState(0)
  const maxHeight = memoir.media?.length ? 120 : 200 // tweak these
  const isTruncated = !expanded && contentHeight > maxHeight

  const { openBottomSheet } = useBottomSheet()

  const bookmarkScale = useSharedValue(memoir.bookmark ? 1 : 0)

  const handleEdit = () => {
    onEdit?.(memoir.id)
    swipeableRef.current?.close()
  }

  const handleDelete = () => {
    onDelete?.(memoir.id)
  }

  const titleClass = cn(
    fontSize === 'small' && 'text-sm',
    fontSize === 'medium' && 'text-base',
    fontSize === 'large' && 'text-lg',
  )

  const contentClass = cn(
    fontSize === 'small' && 'text-sm',
    fontSize === 'medium' && 'text-base',
    fontSize === 'large' && 'text-lg',
  )

  const dateClass = cn(
    fontSize === 'small' && 'text-xs',
    fontSize === 'medium' && 'text-sm',
    fontSize === 'large' && 'text-base',
  )

  // console.log(
  //   'cleaned',
  //   cleanedContent,
  //   'length',
  //   getTextContent(cleanedContent).length,
  // )

  const bookmarkStyle = useAnimatedStyle(() => ({
    transform: [{ scale: bookmarkScale.value }],
    opacity: bookmarkScale.value,
  }))

  const renderers = {
    font: ({ tnode, TDefaultRenderer, ...props }: CustomRendererProps<any>) => {
      const { color, size, face } = tnode.attributes
      const style = {
        color: color ?? undefined,
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
    strike: ({
      tnode,
      TDefaultRenderer,
      ...props
    }: CustomRendererProps<any>) => {
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
          dark={dark}
          fontSize={fontSize}
        />
      )}>
      <View className="px-4">
        <View
          className={cn(
            'px-2 py-2 rounded-xl',
            dark ? 'bg-[#D5D6AA]/30' : 'bg-[#E6E9D8]',
          )}>
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
              <Text
                className={cn(
                  'font-semibold',
                  titleClass,
                  dark ? 'text-[#E8E5D8]' : 'text-black',
                )}>
                {memoir.title}
              </Text>
            )}
            {memoir.content && (
              <Pressable
                className="relative"
                onPress={() => setExpanded(!expanded)}>
                {/* Wrapper with maxHeight */}
                <View
                  style={{
                    maxHeight: expanded ? undefined : maxHeight,
                    overflow: 'hidden',
                  }}>
                  {/* Inner view only for measuring full content height */}
                  <View
                    onLayout={(e) =>
                      setContentHeight(e.nativeEvent.layout.height)
                    }>
                    <RenderHtml
                      contentWidth={width}
                      source={{ html: cleanedContent }}
                      customHTMLElementModels={customHTMLElementModels}
                      renderers={renderers}
                      baseStyle={{
                        fontSize:
                          fontSize === 'small'
                            ? 14
                            : fontSize === 'medium'
                              ? 16
                              : 18,
                        lineHeight:
                          fontSize === 'small'
                            ? 18
                            : fontSize === 'medium'
                              ? 20
                              : 22,
                      }}
                    />
                  </View>
                </View>

                {isTruncated && (
                  <View className="absolute bottom-[-10px] right-2">
                    <ChevronDown />
                  </View>
                )}
              </Pressable>
            )}
          </View>
          <Separator
            className={cn('my-1', dark ? 'bg-[#B5C599]' : 'bg-[#9CA082]')}
          />
          <View className="flex-row items-center justify-between">
            <Text
              className={cn(
                'font-medium',
                dateClass,
                dark ? 'text-[#A3B587]' : 'text-gray-500',
              )}>
              {formatDate(memoir.date)}
            </Text>

            <View className="flex-row items-center gap-5">
              <Animated.View style={bookmarkStyle}>
                <Bookmark
                  size={16}
                  fill={dark ? '#D8E0CC' : '#6C7A45'}
                  color={dark ? '#D8E0CC' : '#6C7A45'}
                />
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
                <Ellipsis size={20} color={dark ? '#D8E0CC' : '#6C7A45'} />
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
  dark = false,
  fontSize = 'medium',
}: {
  progress: SharedValue<number>
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
  memoirId: string
  dark: boolean
  fontSize: FontSize
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

  const iconSize = fontSize === 'small' ? 20 : fontSize === 'medium' ? 24 : 28
  const buttonPadding =
    fontSize === 'small' ? 'p-5' : fontSize === 'medium' ? 'p-6' : 'p-7'

  return (
    <View className="flex-row gap-4 items-center pr-4 pl-1">
      <Animated.View style={editStyle}>
        <Button
          size="icon"
          variant="secondary"
          className={cn(
            'rounded-full',
            buttonPadding,
            dark ? 'bg-[#8B9C6B]' : 'bg-[#2b311a]',
          )}
          onPress={() => onEdit?.(memoirId)}>
          <Pen color="white" size={iconSize} />
        </Button>
      </Animated.View>

      <Animated.View style={deleteStyle}>
        <Button
          size="icon"
          variant="destructive"
          className={cn('rounded-full', buttonPadding)}
          onPress={() => onDelete?.(memoirId)}>
          <Trash2 color="white" size={iconSize} />
        </Button>
      </Animated.View>
    </View>
  )
}
