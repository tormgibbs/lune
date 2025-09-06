import { Memoir } from '@/db/schema'
import { View, Text, Pressable, useWindowDimensions } from 'react-native'
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable'
import { Separator } from './ui/separator'
import { formatDate } from '@/lib/date'
import { Ellipsis, Pen, Trash2 } from 'lucide-react-native'
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
} from 'react-native-reanimated'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import MenuItem from './menu-item'
import { ComponentRef, useRef } from 'react'
import ResponsiveMediaGrid from './responsive-media-grid'
import { cn } from '@/lib/utils'

interface MemoirItemProps {
  memoir: Memoir
  onDelete?: (id: string) => void
  onEdit?: (id: string) => void
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
          // backgroundColor: '#F5F5F0',
          // paddingVertical: 8,
          // paddingRight: 8,
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

const MemoirItem = ({ memoir, onDelete, onEdit, onMediaPress }: MemoirItemProps) => {
  const width = useWindowDimensions().width - 32
  const popoverRef = useRef<ComponentRef<typeof PopoverTrigger>>(null)
  const swipeableRef = useRef<ComponentRef<typeof Swipeable>>(null)

  const handleEdit = () => {
    onEdit?.(memoir.id)
    swipeableRef.current?.close()
  }

  const handleDelete = () => {
    onDelete?.(memoir.id)
  }

  const cleanedContent = memoir.content ? cleanHtml(memoir.content) : ''

  // console.log(JSON.stringify(memoir, null, 2))

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
            mode='preview'
            onMediaPress={onMediaPress}
          />
          <View
            className={cn(memoir.title || memoir.content ? 'py-2' : 'py-0')}>
            {memoir.title && memoir.titleVisible && (
              <Text className="text-base font-semibold">{memoir.title}</Text>
            )}
            {memoir.content && (
              <RenderHtml
                contentWidth={width}
                source={{ html: cleanedContent }}
                customHTMLElementModels={customHTMLElementModels}
                renderers={renderers}
              />
            )}
          </View>
          <Separator className="my-1 bg-[#9CA082]" />
          <View className="flex-row items-center justify-between">
            <Text className="text-sm font-medium text-gray-500">
              {formatDate(memoir.date)}
            </Text>

            <Popover>
              <PopoverTrigger ref={popoverRef} asChild>
                <Pressable>
                  <Ellipsis size={20} color="gray" />
                </Pressable>
              </PopoverTrigger>

              <PopoverContent
                portalHost="root-host"
                side="bottom"
                align="end"
                className="w-auto py-0 px-0 bg-[#EDE9D5] border border-[#6C7A45]/20 rounded-2xl overflow-hidden">
                <MenuItem
                  label="Edit"
                  icon={<Pen size={16} />}
                  rounded="top"
                  onPress={() => {
                    popoverRef.current?.close?.()
                    onEdit?.(memoir.id)
                  }}
                />

                <Separator className="h-[1px] bg-[#D4CDB3]" />

                <MenuItem
                  label="Delete"
                  icon={<Trash2 size={16} color="#A34B3D" />}
                  rounded="bottom"
                  danger
                  onPress={() => {
                    popoverRef.current?.close?.()
                    onDelete?.(memoir.id)
                  }}
                />
              </PopoverContent>
            </Popover>
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
