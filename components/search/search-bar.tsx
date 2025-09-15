import { SearchIcon } from 'lucide-react-native'
import { Pressable, Text, TextInput, View } from 'react-native'
import TagInput from '../ui/tag-input'
import { Category } from '@/db/schema'
import { cn } from '@/lib/utils'

interface SearchBarProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
  inputRef: React.RefObject<TextInput | null>
  onCancel: () => void
  selectedCategory: Category | null
  setSelectedCategory: (cat: Category | null) => void
  dark?: boolean
}

const SearchBar = ({
  searchQuery,
  setSearchQuery,
  onCancel,
  selectedCategory,
  setSelectedCategory,
  dark = false,
}: SearchBarProps) => (
  <View className="flex-row justify-between items-center gap-3 pt-4 px-4 mb-6">
    <View
      className={cn(
        'flex-1 flex-row rounded-lg px-2 items-center gap-2',
        dark ? 'bg-[#4A5340]' : 'bg-[#E8E6D9]',
      )}>
      <SearchIcon size={20} color={dark ? '#B5C2A3' : '#666'} />
      <TagInput
        dark={dark}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        tags={selectedCategory ? [selectedCategory] : []}
        onChangeTags={(tags) => {
          setSelectedCategory(tags[0] ?? null)
        }}
      />
    </View>
    <Pressable onPress={onCancel}>
      <Text
        className={cn('text-xl', dark ? 'text-[#B5C2A3]' : 'text-[#6C7A45]')}>
        Cancel
      </Text>
    </Pressable>
  </View>
)

export default SearchBar
