import React from 'react'
import { View, Text, StyleSheet, Pressable } from 'react-native'

interface OverlayProps {
  count: number
  radius?: number
  onPress?: () => void
}

export const Overlay: React.FC<OverlayProps> = ({ count, radius = 7, onPress }) => {
  return (
    <Pressable
      onPress={(e) => {
        e.stopPropagation?.()
        onPress?.()
      }}
      style={[
        StyleSheet.absoluteFillObject,
        styles.overlay,
        { borderRadius: radius },
      ]}
    >
      <Text style={styles.text}>+{count}</Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  overlay: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
})
