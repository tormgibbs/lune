import React from 'react'
import { Plus } from 'lucide-react-native'
import { Button } from '../ui/button'
import { useColorScheme } from '@/lib/useColorScheme'
import { cn } from '@/lib/utils'
import { useFontSize } from '@/lib/use-font-size'

interface FloatingActionButtonProps {
  onPress?: () => void
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  onPress,
}) => {
  const { isDarkColorScheme: dark } = useColorScheme()
  const { fontSize } = useFontSize()

  const buttonPadding = cn(
    fontSize === 'small' && 'p-8',
    fontSize === 'medium' && 'p-10',
    fontSize === 'large' && 'p-12',
  )

  const iconSize = fontSize === 'small' ? 24 : fontSize === 'medium' ? 32 : 40

  return (
    <Button
      variant="secondary"
      size="icon"
      className={cn(
        'absolute bottom-12 rounded-full shadow-lg',
        buttonPadding,
        dark ? 'bg-[#94A479]' : 'bg-[#2b311a]',
      )}
      accessibilityLabel="Add Memoir"
      onPress={onPress}>
      <Plus color="white" size={iconSize} />
    </Button>
  )
}

export default FloatingActionButton
