import React from 'react'
import { Plus } from 'lucide-react-native'
import { Button } from './ui/button'

interface FloatingActionButtonProps {
  onPress?: () => void
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  onPress,
}) => {
  return (
    <Button
      variant="secondary"
      size="icon"
      className="absolute bottom-12 rounded-full p-10 bg-[#2b311a] shadow-lg"
      onPress={onPress}
    >
      <Plus color="white" size={32} />
    </Button>
  )
}

export default FloatingActionButton
