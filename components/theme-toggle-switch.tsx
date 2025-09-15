import { Switch } from 'react-native-switch'
import { setAndroidNavigationBar } from '@/lib/android-navigation-bar'
import { useColorScheme } from '@/lib/useColorScheme'
import { Moon, Sun } from 'lucide-react-native'

export function ThemeToggleSwitch() {
  const { isDarkColorScheme, setColorScheme } = useColorScheme()

  const toggleColorScheme = (val: boolean) => {
    const newTheme = val ? 'dark' : 'light'
    setColorScheme(newTheme)
    setAndroidNavigationBar(newTheme)
  }

  return (
    <Switch
      value={isDarkColorScheme}
      onValueChange={toggleColorScheme}
      disabled={false}
      circleSize={32}
      barHeight={40}
      backgroundActive="#4A5340"
      backgroundInactive="#E8E6D9"
      circleBorderActiveColor="transparent"
      circleBorderInactiveColor="transparent"
      circleActiveColor="#899D78"
      circleInActiveColor="#F5F4F0"
      innerCircleStyle={{ alignItems: 'center', justifyContent: 'center' }}
      renderInsideCircle={() =>
        isDarkColorScheme ? (
          <Moon size={20} color="#E8E6D9" />
        ) : (
          <Sun size={20} color="#6C7A45" />
        )
      }
      renderActiveText={false}
      renderInActiveText={false}
      switchWidthMultiplier={2.2}
      switchBorderRadius={20}
    />
  )
}
