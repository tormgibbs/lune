import React from 'react'
import { Plus } from 'lucide-react-native'
import { Button } from './ui/button'
import { useColorScheme } from '@/lib/useColorScheme'
import { cn } from '@/lib/utils'

interface FloatingActionButtonProps {
  onPress?: () => void
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  onPress,
}) => {
  const { isDarkColorScheme: dark } = useColorScheme()
  return (
    <Button
      variant="secondary"
      size="icon"
      className={cn(
        'absolute bottom-12 rounded-full p-10 shadow-lg',
        dark ? 'bg-[#94A479]' : 'bg-[#2b311a]',
      )}
      accessibilityLabel="Add Memoir"
      onPress={onPress}
    >
      <Plus color="white" size={32} />
    </Button>
  )
}

export default FloatingActionButton

// absolute bottom-12 rounded-full p-10 bg-[#2b311a] shadow-lg