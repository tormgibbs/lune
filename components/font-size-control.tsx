import React from 'react'
import { StyleSheet } from 'react-native'
import SegmentedControl from '@react-native-segmented-control/segmented-control'
import { useFontSize } from '@/lib/use-font-size'

const FONT_SIZES = ['small', 'medium', 'large'] as const
const LABELS = ['Small', 'Medium', 'Large']

interface Props {
  dark?: boolean
}

const FontSizeControl: React.FC<Props> = ({ dark = false }) => {
  const { fontSize, setFontSize } = useFontSize()

  const selectedIndex = FONT_SIZES.indexOf(fontSize)

  const handleChange = (event: any) => {
    const index = event.nativeEvent.selectedSegmentIndex
    setFontSize(FONT_SIZES[index])
  }

  const labelSize = fontSize === 'small' ? 14 : fontSize === 'medium' ? 16 : 18
  const containerHeight = fontSize === 'small' ? 40 : fontSize === 'medium' ? 45 : 50

  return (
    <SegmentedControl
      values={LABELS}
      selectedIndex={selectedIndex}
      onChange={handleChange}
      style={[
        styles.segmentedControl,
        { backgroundColor: dark ? '#4A5340' : '#E8E6D9', height: containerHeight },
      ]}
      tintColor={dark ? '#899D78' : '#6C7A45'}
      fontStyle={{ ...styles.font, fontSize: labelSize, color: dark ? '#B5C2A3' : '#333' }}
      activeFontStyle={{
        ...styles.activeFont,
        fontSize: labelSize,
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
