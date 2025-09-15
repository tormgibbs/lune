
import React, { useState } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import Slider from '@react-native-community/slider'

type FontSizeOption = 'small' | 'medium' | 'large'

interface Props {
  value?: FontSizeOption
  onChange?: (value: FontSizeOption) => void
}

const options: FontSizeOption[] = ['small', 'medium', 'large']

const FontSizeSlider: React.FC<Props> = ({ value = 'medium', onChange }) => {
  const initialIndex = options.indexOf(value)
  const [index, setIndex] = useState(initialIndex)

  const handleChange = (val: number) => {
    setIndex(val)
    onChange?.(options[val])
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Font size: {options[index]}</Text>

      {/* Slider */}
      <Slider
        // className='w-72 h-6'
        style={{ width: '100%', height: 40 }}
        minimumValue={0}
        maximumValue={2}
        step={1}
        value={index}
        minimumTrackTintColor="#007AFF"
        maximumTrackTintColor="#ccc"
        thumbTintColor="#007AFF"
        onValueChange={handleChange}
      />

      {/* Labels aligned under stops */}
      <View className='flex-row items-center justify-between border'>
        {options.map((opt, i) => (
          <Text
            key={opt}
            className='border'
            style={[
              styles.label,
              index === i && styles.activeLabel, // highlight active label
            ]}
          >
            {opt}
          </Text>
        ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    marginBottom: 15,
    fontWeight: '600',
    fontSize: 16,
  },
  labelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 300,
    marginTop: 8,
  },
  label: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    width: 100, // must match track divisions
  },
  activeLabel: {
    color: '#007AFF',
    fontWeight: '700',
  },
})

export default FontSizeSlider
