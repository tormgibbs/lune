import { View, Text, Pressable } from 'react-native'
import React from 'react'
import {
  AudioLines,
  Bookmark,
  Image,
  TextIcon,
  Video,
} from 'lucide-react-native'
import { Separator } from '@/components/ui/separator'
import { Category } from '@/db/schema'
import { cn } from '@/lib/utils'

interface CategoriesListProps {
  onSelect: (cat: Category) => void
  dark?: boolean
}

const CategoriesList = ({ onSelect, dark = false }: CategoriesListProps) => {
  const categories: {
    key: Category
    label: string
    icon: React.JSX.Element
  }[] = [
    {
      key: 'bookmark',
      label: 'Bookmarks',
      icon: <Bookmark size={20} color={dark ? '#B5C2A3' : '#6C7A45'} />,
    },
    {
      key: 'photo',
      label: 'Photos',
      icon: <Image size={20} color={dark ? '#B5C2A3' : '#6C7A45'} />,
    },
    {
      key: 'video',
      label: 'Videos',
      icon: <Video size={20} color={dark ? '#B5C2A3' : '#6C7A45'} />,
    },
    {
      key: 'audio',
      label: 'Recorded Audio',
      icon: <AudioLines size={20} color={dark ? '#B5C2A3' : '#6C7A45'} />,
    },
    {
      key: 'text',
      label: 'Text Only',
      icon: <TextIcon size={20} color={dark ? '#B5C2A3' : '#6C7A45'} />,
    },
  ]

  return (
    <View className="flex-1 px-4">
      <Text
        className={cn(
          'font-bold text-xl',
          dark ? 'text-[#E8E6D9]' : 'text-[#2C3526]',
        )}>
        Categories
      </Text>
      <View className="flex-col">
        {categories.map((cat, idx) => (
          <View key={cat.label}>
            <Pressable
              onPress={() => onSelect(cat.key)}
              className="flex-row items-center py-3 gap-1 active:opacity-70">
              {cat.icon}
              <Text
                className={cn(
                  'text-lg',
                  dark ? 'text-[#E8E6D9]' : 'text-[#4A5340]',
                )}>
                {cat.label}
              </Text>
            </Pressable>
            {idx < categories.length - 1 && <Separator />}
          </View>
        ))}
      </View>
    </View>
  )
}

export default CategoriesList
