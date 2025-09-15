// font-size-segmented-control.tsx
import React, { useState } from 'react'
import { StyleSheet } from 'react-native'
import SegmentedControl from '@react-native-segmented-control/segmented-control'

type FontSizeOption = 'Small' | 'Medium' | 'Large'

interface Props {
  value?: FontSizeOption
  onChange?: (value: FontSizeOption) => void
  dark?: boolean
}

const options: FontSizeOption[] = ['Small', 'Medium', 'Large']

const FontSizeControl: React.FC<Props> = ({
  value = 'Medium',
  onChange,
  dark = false,
}) => {
  const initialIndex = options.indexOf(value)
  const [selectedIndex, setSelectedIndex] = useState(initialIndex)

  const handleChange = (event: any) => {
    const index = event.nativeEvent.selectedSegmentIndex
    setSelectedIndex(index)
    onChange?.(options[index])
  }

  return (
    <SegmentedControl
      values={options}
      selectedIndex={selectedIndex}
      onChange={handleChange}
      style={[
        styles.segmentedControl,
        { backgroundColor: dark ? '#4A5340' : '#E8E6D9' },
      ]}
      tintColor={dark ? '#899D78' : '#6C7A45'}
      fontStyle={{ ...styles.font, color: dark ? '#B5C2A3' : '#333' }}
      activeFontStyle={{
        ...styles.activeFont,
        color: dark ? '#E8E6D9' : 'white',
      }}
    />
  )
}

const styles = StyleSheet.create({
  segmentedControl: {
    height: 45,
  },
  font: {
    fontSize: 16,
  },
  activeFont: {
    fontSize: 16,
    fontWeight: '700',
  },
})

export default FontSizeControl
