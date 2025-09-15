import { View, Text } from 'react-native'
import React from 'react'
import { KeyboardAvoidingView } from 'react-native-keyboard-controller'
import { FlashList } from '@shopify/flash-list'
import MemoirItem from '../memoir-item'
import { Memoir } from '@/db/schema'
import { useMemoirActions } from '@/hooks/use-memoir-actions'
import { cn } from '@/lib/utils'

const SearchResults = ({
  results,
  dark = false,
}: {
  results: Memoir[]
  dark?: boolean
}) => {
  const { handleEdit, handleDelete, handleToggleBookmark, handleMediaPress } =
    useMemoirActions()

  if (results.length === 0) {
    return (
      <KeyboardAvoidingView behavior="padding" className="flex-1">
        <View className="flex-1 justify-center items-center px-4">
          <Text
            className={cn(
              'text-center font-bold text-xl',
              dark ? 'text-[#B5C2A3]' : 'text-[#6C7A45]',
            )}>
            No results
          </Text>
          <Text
            className={cn(
              'text-center',
              dark ? 'text-[#B5C2A3]' : 'text-gray-500',
            )}>
            Try a new search
          </Text>
        </View>
      </KeyboardAvoidingView>
    )
  }

  return (
    <FlashList
      data={results}
      renderItem={({ item }) => (
        <MemoirItem
          memoir={item}
          onDelete={handleDelete}
          onEdit={handleEdit}
          onMediaPress={(mediaIndex) => handleMediaPress(item.id, mediaIndex)}
          onBookmarkPress={handleToggleBookmark}
        />
      )}
      keyExtractor={(item) => item.id}
      keyboardShouldPersistTaps="handled"
      style={{ flex: 1 }}
    />
  )
}

export default SearchResults
