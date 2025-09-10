import { Pressable } from 'react-native'
import { Ellipsis, Pen, Trash2 } from 'lucide-react-native'
import { Octicons } from '@expo/vector-icons'
import { Popover, PopoverTrigger, PopoverContent } from './ui/popover'
import MenuItem from './menu-item'
import { Separator } from './ui/separator'

interface MemoirPopoverMenuProps {
  memoirId: string
  isBookmarked: boolean
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
  onBookmarkPress?: (id: string) => void
  popoverRef: React.RefObject<any>
}

export function MemoirPopoverMenu({
  memoirId,
  isBookmarked,
  onEdit,
  onDelete,
  onBookmarkPress,
  popoverRef,
}: MemoirPopoverMenuProps) {
  const handleClose = () => popoverRef.current?.close?.()

  return (
    <Popover>
      <PopoverTrigger ref={popoverRef} asChild>
        <Pressable hitSlop={15}>
          <Ellipsis size={20} color="gray" />
        </Pressable>
      </PopoverTrigger>

      <PopoverContent
        portalHost="root-host"
        side="bottom"
        align="end"
        className="w-auto py-0 px-0 bg-[#EDE9D5] border border-[#6C7A45]/20 rounded-2xl overflow-hidden">
        {/* Edit */}
        <MenuItem
          label="Edit"
          icon={<Pen size={16} />}
          rounded="top"
          onPress={() => {
            handleClose()
            onEdit?.(memoirId)
          }}
        />

        <Separator className="bg-[#D4CDB3]" />

        {/* Bookmark / Remove Bookmark */}
        <MenuItem
          label={isBookmarked ? 'Remove Bookmark' : 'Bookmark'}
          icon={
            isBookmarked ? (
              <Octicons name="bookmark-slash" size={16} color="black" />
            ) : (
              <Octicons name="bookmark" size={16} color="black" />
            )
          }
          onPress={() => {
            handleClose()
            onBookmarkPress?.(memoirId)
          }}
        />

        <Separator className="h-[1px] bg-[#D4CDB3]" />

        {/* Delete */}
        <MenuItem
          label="Delete"
          icon={<Trash2 size={16} color="#A34B3D" />}
          rounded="bottom"
          danger
          onPress={() => {
            handleClose()
            onDelete?.(memoirId)
          }}
        />
      </PopoverContent>
    </Popover>
  )
}
