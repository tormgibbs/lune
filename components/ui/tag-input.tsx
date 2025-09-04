import { Category, CategoryLabels } from '@/db/schema'
import { X } from 'lucide-react-native'
import React, { useRef } from 'react'
import {
  View,
  Text,
  TextInput,
  Pressable,
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
} from 'react-native'

interface TagInputProps {
  tags: Category[]
  searchQuery: string
  placeholder?: string
  onChangeTags: (tags: Category[]) => void
  setSearchQuery: (query: string) => void
}

const TagInput = ({
  tags,
  onChangeTags,
  placeholder,
  setSearchQuery,
  searchQuery,
}: TagInputProps) => {
  const selectionRef = useRef({ start: 0, end: 0 })

  const handleKeyPress = (
    e: NativeSyntheticEvent<TextInputKeyPressEventData>,
  ) => {
    if (
      e.nativeEvent.key === 'Backspace' &&
      selectionRef.current.start === 0 &&
      selectionRef.current.end === 0 &&
      tags.length
    ) {
      onChangeTags(tags.slice(0, -1))
    }
  }

  const handleAddTag = () => {
    const newTag = searchQuery.trim() as Category
    if (!newTag) return
    if (!tags.includes(newTag)) {
      onChangeTags([...tags, newTag])
    }
    setSearchQuery('')
  }

  const handleRemoveTag = (tag: string) => {
    onChangeTags(tags.filter((t) => t !== tag))
  }

  return (
    <View className="flex-row flex-1 items-center bg-[#E8E6D9] rounded-lg p-0">
      {tags.map((tag) => (
        <View
          key={tag}
          className="flex-row items-center gap-0.5 bg-[#D4D2C7] p-1 px-1.5 rounded-md">
          <Text className="text-sm">{CategoryLabels[tag]}</Text>
          <Pressable hitSlop={8} onPress={() => handleRemoveTag(tag)}>
            <X size={12} />
          </Pressable>
        </View>
      ))}
      <TextInput
        autoFocus
        className="flex-1 text-black px-0.5"
        value={searchQuery}
        onChangeText={setSearchQuery}
        onSubmitEditing={handleAddTag}
        onSelectionChange={(e) => {
          selectionRef.current = e.nativeEvent.selection
        }}
        onKeyPress={handleKeyPress}
        placeholder={placeholder}
        placeholderTextColor="#666"
        returnKeyType="done"
      />
    </View>
  )
}

export default TagInput
