import { Category, CategoryLabels } from '@/db/schema'
import { FontSize } from '@/lib/use-font-size'
import { cn } from '@/lib/utils'
import { X } from 'lucide-react-native'
import React, { useRef } from 'react'
import {
  NativeSyntheticEvent,
  Pressable,
  Text,
  TextInput,
  TextInputKeyPressEventData,
  View,
} from 'react-native'

interface TagInputProps {
  tags: Category[]
  searchQuery: string
  placeholder?: string
  onChangeTags: (tags: Category[]) => void
  setSearchQuery: (query: string) => void
  dark?: boolean
  fontSize?: FontSize
}

const TagInput = ({
  tags,
  onChangeTags,
  placeholder,
  setSearchQuery,
  searchQuery,
  dark = false,
  fontSize = 'medium',
}: TagInputProps) => {
  const selectionRef = useRef({ start: 0, end: 0 })

  const iconSize = fontSize === 'small' ? 10 : fontSize === 'medium' ? 12 : 16
  const textClass = cn(
    fontSize === 'small' && 'text-xs',
    fontSize === 'medium' && 'text-sm',
    fontSize === 'large' && 'text-base',
  )

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
    <View
      className={cn(
        'flex-row flex-1 items-center rounded-lg p-0',
        dark ? 'bg-[#4A5340]' : 'bg-[#E8E6D9]',
      )}>
      {tags.map((tag) => (
        <View
          key={tag}
          className={cn(
            'flex-row items-center gap-0.5 p-1 px-1.5 rounded-md',
            dark ? 'bg-[#5A6B4D]' : 'bg-[#D4D2C7]',
          )}>
          <Text
            className={cn(textClass, dark ? 'text-[#E8E6D9]' : 'text-black')}>
            {CategoryLabels[tag]}
          </Text>
          <Pressable hitSlop={8} onPress={() => handleRemoveTag(tag)}>
            <X size={iconSize} color={dark ? '#E8E6D9' : 'black'} />
          </Pressable>
        </View>
      ))}
      <TextInput
        autoFocus
        className={cn('flex-1 px-0.5', dark ? 'text-[#E8E6D9]' : 'text-black')}
        value={searchQuery}
        onChangeText={setSearchQuery}
        onSubmitEditing={handleAddTag}
        onSelectionChange={(e) => {
          selectionRef.current = e.nativeEvent.selection
        }}
        onKeyPress={handleKeyPress}
        placeholder={placeholder}
        placeholderTextColor={dark ? '#B5C2A3' : '#666'}
        returnKeyType="done"
      />
    </View>
  )
}

export default TagInput
