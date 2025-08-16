import React from 'react'
import { View, Pressable, StyleSheet } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'

interface ColorPickerButtonProps {
  color: string
  onPress: () => void
  size?: number
  borderWidth?: number
  gapWidth?: number
}

export default function ColorPickerButton({
  color,
  onPress,
  size = 30,
  borderWidth = 5,
  gapWidth = 2,
}: ColorPickerButtonProps) {
  const outerSize = size + gapWidth * 2 + borderWidth * 2

  return (
    <Pressable onPress={onPress}>
      <LinearGradient
        colors={[
          '#ff0000',
          '#ffff00',
          '#00ff00',
          '#00ffff',
          '#0000ff',
          '#ff00ff',
          '#ff0000',
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          width: outerSize,
          height: outerSize,
          padding: borderWidth,
          borderRadius: 999,
        }}>
        <View
          style={{
            flex: 1,
            borderRadius: 999,
            backgroundColor: '#E0DCCC',
            padding: gapWidth,
          }}>
          <View style={[styles.innerCircle, { backgroundColor: color }]} />
        </View>
      </LinearGradient>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  innerCircle: {
    backgroundColor: 'black',
    flex: 1,
    borderRadius: 999,
  },
})
