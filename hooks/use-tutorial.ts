import { useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'

export function useTutorial() {
  const [showTutorialModal, setShowTutorialModal] = useState(false)

  useEffect(() => {
    const checkTutorialSeen = async () => {
      try {
        const seen = await AsyncStorage.getItem('hasSeenTutorial')
        if (!seen) {
          setShowTutorialModal(true)
        }
      } catch (err) {
        console.log('Error checking tutorial flag:', err)
      }
    }
    checkTutorialSeen()
  }, [])

  const markTutorialSeen = async () => {
    try {
      await AsyncStorage.setItem('hasSeenTutorial', 'true')
      setShowTutorialModal(false)
    } catch (err) {
      console.log('Error saving tutorial flag:', err)
    }
  }

  return {
    showTutorialModal,
    setShowTutorialModal,
    markTutorialSeen,
  }
}
