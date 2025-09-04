import { View, Text } from 'react-native'
import React from 'react'
import { KeyboardAvoidingView } from 'react-native-keyboard-controller'
import { FlashList } from '@shopify/flash-list'
import MemoirItem from '../memoir-item'
import { Memoir } from '@/db/schema'
import { useMemoirActions } from '@/hooks/use-memoir-actions'

const SearchResults = ({ results }: { results: Memoir[] }) => {
  const { handleEdit, handleDelete } = useMemoirActions()

  if (results.length === 0) {
    return (
      <KeyboardAvoidingView behavior="padding" className="flex-1">
        <View className="flex-1 justify-center items-center px-4">
          <Text className="text-center font-bold text-xl text-[#6C7A45]">
            No results
          </Text>
          <Text className="text-center text-gray-500">Try a new search</Text>
        </View>
      </KeyboardAvoidingView>
    )
  }

  return (
    <FlashList
      data={results}
      renderItem={({ item }) => (
        <MemoirItem memoir={item} onDelete={handleDelete} onEdit={handleEdit} />
      )}
      keyExtractor={(item) => item.id}
      keyboardShouldPersistTaps="handled"
      style={{ flex: 1 }}
    />
  )
}

export default SearchResults
