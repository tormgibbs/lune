// export const NAV_THEME = {
//   light: {
//     background: 'hsl(0 0% 100%)', // background
//     border: 'hsl(240 5.9% 90%)', // border
//     card: 'hsl(0 0% 100%)', // card
//     notification: 'hsl(0 84.2% 60.2%)', // destructive
//     primary: 'hsl(240 5.9% 10%)', // primary
//     text: 'hsl(240 10% 3.9%)', // foreground
//   },
//   dark: {
//     background: 'hsl(240 10% 3.9%)', // background
//     border: 'hsl(240 3.7% 15.9%)', // border
//     card: 'hsl(240 10% 3.9%)', // card
//     notification: 'hsl(0 72% 51%)', // destructive
//     primary: 'hsl(0 0% 98%)', // primary
//     text: 'hsl(0 0% 98%)', // foreground
//   },
// }

export const NAV_THEME = {
  light: {
    background: 'hsl(48 27% 95%)', // Warm Off-White (#F5F4EF)
    border: 'hsl(49 23% 89%)', // Soft Beige-Tan (#E8E6D9)
    card: 'hsl(49 23% 89%)', // Soft Beige-Tan (#E8E6D9)
    notification: 'hsl(8 45% 44%)', // Muted Brick Red (#A34B3D)
    primary: 'hsl(75 29% 15%)', // Dark Olive (#2B311A)
    text: 'hsl(75 29% 15%)', // Dark Olive (#2B311A)
  },
  dark: {
    background: 'hsl(75 29% 15%)', // Dark Olive (#2B311A)
    border: 'hsl(78 25% 38%)', // Sage Green (#6C7A45)
    card: 'hsl(75 29% 15%)', // Dark Olive (#2B311A)
    notification: 'hsl(8 45% 44%)', // Muted Brick Red (#A34B3D)
    primary: 'hsl(48 59% 50%)', // Golden Mustard (#CBA135)
    text: 'hsl(48 27% 95%)', // Warm Off-White (#F5F4EF)
  },
}

export const CENTERED_TEXT_STYLE = (color: string = '#2B311A') => ({
  position: 'absolute',
  left: '50%',
  transform: [{ translateX: '-50%' }], // Use transform instead of Tailwind
  color,
} as const)