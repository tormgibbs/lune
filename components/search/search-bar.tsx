import { SearchIcon } from 'lucide-react-native'
import { Pressable, Text, TextInput, View } from 'react-native'
import TagInput from '../ui/tag-input'
import { Category } from '@/db/schema'

interface SearchBarProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
  inputRef: React.RefObject<TextInput | null>
  onCancel: () => void
  selectedCategory: Category | null
  setSelectedCategory: (cat: Category | null) => void
}

const SearchBar = ({
  searchQuery,
  setSearchQuery,
  inputRef,
  onCancel,
  selectedCategory,
  setSelectedCategory,
}: SearchBarProps) => (
  <View className="flex-row justify-between items-center gap-3 pt-4 px-4 mb-6">
    <View className="flex-1 flex-row rounded-lg px-2 bg-[#E8E6D9] items-center gap-2">
      <SearchIcon size={20} color="#666" />
      <TagInput
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        tags={selectedCategory ? [selectedCategory] : []}
        onChangeTags={(tags) => {
          // only allow one category → take the first or null
          setSelectedCategory(tags[0] ?? null)
        }}
      />

      {/* <Input
        ref={inputRef}
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search your entries..."
        className="p-0 flex-1 border-0 bg-[#E8E6D9] text-black rounded-lg text-base"
      /> */}
    </View>
    <Pressable onPress={onCancel}>
      <Text className="text-[#6C7A45] text-xl">Cancel</Text>
    </Pressable>
  </View>
)

export default SearchBar
