import { TextInput, BackHandler } from 'react-native'
import React, { useRef, useCallback } from 'react'
import { router, Stack, useFocusEffect } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useMemoirStore } from '@/store/memoir'

import CategoriesList from '@/components/search/categories-list'
import SearchResults from '@/components/search/search-results'
import SearchBar from '@/components/search/search-bar'

const Search = () => {
  const searchQuery = useMemoirStore((s) => s.searchQuery)
  const setSearchQuery = useMemoirStore((s) => s.setSearchQuery)
  const results = useMemoirStore((s) => s.searchResults)
  const selectedCategory = useMemoirStore((s) => s.selectedCategory)
  const setSelectedCategory = useMemoirStore((s) => s.setSelectedCategory)

  const inputRef = useRef<TextInput>(null)
  const hasQuery = !!searchQuery?.trim() || !!selectedCategory

  const navigateBack = () => {
    router.back()
  }

  const handleBack = useCallback(() => {
    navigateBack()
    return true
  }, [])

  useFocusEffect(
    useCallback(() => {
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        handleBack,
      )
      return () => {
        backHandler.remove()
        setSearchQuery('')
        setSelectedCategory(null)
      }
    }, [handleBack, setSearchQuery, setSelectedCategory]),
  )


  return (
    <SafeAreaView className="flex-1">
      <Stack.Screen
        options={{
          animation: 'slide_from_bottom',
        }}
      />
      <SearchBar
        inputRef={inputRef}
        setSearchQuery={setSearchQuery}
        searchQuery={searchQuery}
        onCancel={handleBack}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      {!hasQuery ? (
        <CategoriesList onSelect={setSelectedCategory} />
      ) : (
        <SearchResults results={results} />
      )}
    </SafeAreaView>
  )
}

export default Search
