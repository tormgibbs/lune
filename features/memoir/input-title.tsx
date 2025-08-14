import { useState } from 'react'
import { TextInput } from 'react-native'

export function InputTitle() {
  const [value, setValue] = useState('')
  const [height, setHeight] = useState(0)

  return (
    <TextInput
      multiline
      value={value}
      onChangeText={setValue}
      onContentSizeChange={(e) =>
        setHeight(e.nativeEvent.contentSize.height)
      }
      style={{
        height: Math.max(35, height), // minimum height so it doesn’t shrink too much
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 5,
      }}
    />
  )
}
