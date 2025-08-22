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

interface MemoirItemProps {
  memoir: Memoir
  onDelete?: (id: string) => void
  onEdit?: (id: string) => void
}


const customHTMLElementModels = {
  font: HTMLElementModel.fromCustomModel({
    tagName: 'font',
    contentModel: HTMLContentModel.mixed,
    // getUADerivedStyleFromAttributes({ face, color, size }) {
    //   const style: any = {}
    //   if (face) style.fontFamily = face
    //   if (color) style.color = color
    //   return style
    // },
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
}

const MemoirItem = ({ memoir, onDelete, onEdit }: MemoirItemProps) => {
  const width = useWindowDimensions().width - 32

  const renderRightActions = () => {
    return (
      <View className="flex-row gap-4 items-center pr-4 pl-1">
        <Button
          size="icon"
          variant="secondary"
          className="rounded-full p-7 bg-[#2b311a]"
          onPress={() => onEdit?.(memoir.id)}>
          <Pen color="white" size={28} />
        </Button>
        <Button
          size="icon"
          variant="destructive"
          className="rounded-full p-7"
          onPress={() => onDelete?.(memoir.id)}>
          <Trash2 color="white" size={28} />
        </Button>
      </View>
    )
  }

  return (
    <Swipeable 
      renderRightActions={renderRightActions} 
      containerStyle={{paddingHorizontal: 16}}
    >
      <View className="px-2 py-2 bg-[#E6E9D8] rounded-xl">
        <View className="py-2">
          {memoir.title && (
            <Text className="text-base font-semibold">{memoir.title}</Text>
          )}
          {memoir.content && (
            <RenderHtml
              contentWidth={width}
              source={{ html: memoir.content }}
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
          <Pressable>
            <Ellipsis size={20} color="gray" />
          </Pressable>
        </View>
      </View>
    </Swipeable>
  )
}

export default MemoirItem

const transformHtml = (html: string): string => {
  if (!html) return html

  return (
    html
      // Handle <font> tags with color attribute
      .replace(
        /<font\s+color=["']([^"']+)["']([^>]*)>/gi,
        '<span style="color: $1"$2>',
      )
      // Handle <font> tags with size attribute
      .replace(
        /<font\s+size=["']([^"']+)["']([^>]*)>/gi,
        '<span style="font-size: $1"$2>',
      )
      // Handle <font> tags with face attribute
      .replace(
        /<font\s+face=["']([^"']+)["']([^>]*)>/gi,
        '<span style="font-family: $1"$2>',
      )
      // Handle <font> tags with multiple attributes (color + size)
      .replace(
        /<font([^>]*)\s+color=["']([^"']+)["']([^>]*)\s+size=["']([^"']+)["']([^>]*)>/gi,
        '<span style="color: $2; font-size: $4"$1$3$5>',
      )
      // Handle <font> tags with multiple attributes (size + color - different order)
      .replace(
        /<font([^>]*)\s+size=["']([^"']+)["']([^>]*)\s+color=["']([^"']+)["']([^>]*)>/gi,
        '<span style="font-size: $2; color: $4"$1$3$5>',
      )
      // Close font tags
      .replace(/<\/font>/gi, '</span>')
      // Handle other common deprecated tags
      .replace(/<center>/gi, '<div style="text-align: center">')
      .replace(/<\/center>/gi, '</div>')
      .replace(/<b>/gi, '<strong>')
      .replace(/<\/b>/gi, '</strong>')
      .replace(/<i>/gi, '<em>')
      .replace(/<\/i>/gi, '</em>')
      .replace(/<u>/gi, '<span style="text-decoration: underline">')
      .replace(/<\/u>/gi, '</span>')
      // Handle strike/s tags
      .replace(/<(strike|s)>/gi, '<span style="text-decoration: line-through">')
      .replace(/<\/(strike|s)>/gi, '</span>')
      // Clean up any remaining empty attributes
      .replace(/\s+>/g, '>')
  )
}
