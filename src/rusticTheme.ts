/* eslint-disable no-magic-numbers */
import type {
  Palette,
  PaletteColor,
  Shadows,
  ThemeOptions,
} from '@mui/material/styles'
import { createTheme, responsiveFontSizes } from '@mui/material/styles'
import _ from 'lodash'

interface CustomPaletteColor {
  focus?: string
  hover?: string
  selected?: string
  focusVisible?: string
  border?: string
}

declare module '@mui/material/styles' {
  export interface RusticPalette extends Palette {
    primary: PaletteColor & CustomPaletteColor
    secondary: PaletteColor & CustomPaletteColor
  }
}

declare module '@mui/material/Chip' {
  interface ChipPropsSizeOverrides {
    large: true
  }
}

declare module '@mui/material/styles' {
  interface TypographyVariants {
    body1Bold: React.CSSProperties
  }

  // allow configuration using `createTheme`
  interface TypographyVariantsOptions {
    body1Bold?: React.CSSProperties
  }
}

// Update the Typography's variant prop options
declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    body1Bold: true
  }
}

type Colors = Record<'lightMode' | 'darkMode', Record<string, string>>

function generatePalette(
  modeColors: Record<string, string>
): Record<string, string> {
  const palette: Record<string, any> = {}

  Object.keys(modeColors).forEach((key) => {
    const match = key.match(/^([a-z]+)([A-Z].*)$/)

    if (match) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [fullMatch, firstPart, rest] = match
      const path = `${firstPart.toLowerCase()}.${_.camelCase(rest)}`
      _.set(palette, path, modeColors[key])
    } else {
      _.set(palette, key.toLowerCase(), modeColors[key])
    }
  })

  return palette
}

const colors = {
  lightMode: {
    commonBlack: '#000000',
    commonWhite: '#FFFFFF',
    divider: '#E1D9D5',
    backgroundPaper: '#FFFFFF',
    backgroundDefault: '#F4F4F4',
    textPrimary: '#1E0C04',
    textSecondary: '#4E443F',
    textDisabled: '#727272',
    actionActive: 'rgba(0, 0, 0, 0.56)',
    actionHover: 'rgba(0, 0, 0, 0.08)',
    actionSelected: 'rgba(0, 0, 0, 0.16)',
    actionFocus: 'rgba(0, 0, 0, 0.12)',
    actionDisabledBackground: 'rgba(0, 0, 0, 0.12)',
    actionDisabled: 'rgba(0, 0, 0, 0.38)',
    primaryMain: '#2D2825',
    primaryLight: 'rgba(45, 40, 37, 0.60)',
    primaryDark: '#000000',
    primaryContrastText: '#FFFFFF',
    primaryHover: 'rgba(45, 40, 37, 0.08)',
    primarySelected: 'rgba(45, 40, 37, 0.16)',
    primaryFocus: 'rgba(45, 40, 37, 0.12)',
    primaryFocusVisible: 'rgba(45, 40, 37, 0.30)',
    primaryOutlinedBorder: 'rgba(45, 40, 37, 0.50)',
    secondaryMain: '#FF6928',
    secondaryDark: '#E54500',
    secondaryLight: 'rgba(255, 105, 40, 0.60)',
    secondaryContrast: '#FFFFFF',
    secondaryHover: 'rgba(255, 105, 40, 0.08)',
    secondarySelected: 'rgba(255, 105, 40, 0.16)',
    secondaryFocus: 'rgba(255, 105, 40, 0.12)',
    secondaryFocusVisible: 'rgba(255, 105, 40, 0.30)',
    secondaryOutlinedBorder: 'rgba(255, 105, 40, 0.50)',
    successMain: '#007F51',
    successDark: '#014F33',
    successLight: '#00D788',
    successContrastText: '#000000',
    errorMain: '#F82A43',
    errorDark: '#C82639',
    errorLight: '#FF9BA7',
    errorContrastText: '#000000',
    warningMain: '#FFB800',
    warningDark: '#DC8400',
    warningLight: '#FFDB7D',
    warningContrastText: '#000000',
    infoMain: '#0094FF',
    infoDark: '#005A9B',
    infoLight: '#8CCFFF',
    infoContrastText: '#000000',
  },
  darkMode: {
    commonBlack: '#000000',
    commonWhite: '#FFFFFF',
    divider: '#E1D9D5',
    backgroundPaper: '#202020',
    backgroundDefault: '#2C2C2C',
    textPrimary: '#FFFFFF',
    textSecondary: 'rgba(255, 255, 255, 0.70)',
    textDisabled: 'rgba(255, 255, 255, 0.38)',
    actionActive: 'rgba(255, 255, 255, 0.60)',
    actionHover: 'rgba(255, 255, 255, 0.30)',
    actionSelected: 'rgba(255, 255, 255, 0.16)',
    actionFocus: 'rgba(255, 255, 255, 0.12)',
    actionDisabledBackground: 'rgba(255, 255, 255, 0.12)',
    actionDisabled: 'rgba(255, 255, 255, 0.38)',
    primaryMain: '#FFFCFB',
    primaryLight: 'rgba(255, 252, 251, 0.60)',
    primaryDark: '#FFFFFF',
    primaryContrastText: 'rgba(0, 0, 0, 0.87)',
    primaryOutlinedBorder: 'rgba(255, 252, 251, 0.50)',
    primaryFocus: 'rgba(255, 252, 251, 0.12)',
    primaryFocusVisible: 'rgba(255, 252, 251, 0.30)',
    primaryHover: 'rgba(255, 252, 251, 0.08)',
    primarySelected: 'rgba(255, 252, 251, 0.16)',
    secondaryMain: '#FF6928',
    secondaryDark: '#E54500',
    secondaryLight: 'rgba(255, 105, 40, 0.60)',
    secondaryContrastText: 'rgba(0, 0, 0, 0.87)',
    secondaryHover: 'rgba(255, 105, 40, 0.08)',
    secondarySelected: 'rgba(255, 105, 40, 0.16)',
    secondaryFocus: 'rgba(255, 105, 40, 0.12)',
    secondaryFocusVisible: 'rgba(255, 105, 40, 0.30)',
    secondaryOutlinedBorder: 'rgba(255, 105, 40, 0.50)',
    successMain: '#00B775',
    successDark: '#01784D',
    successLight: '#00E390',
    successContrastText: 'rgba(0, 0, 0, 0.87)',
    errorMain: '#F82A43',
    errorDark: '#C82639',
    errorLight: '#FF9BA7',
    errorContrastText: 'rgba(0, 0, 0, 0.87)',
    warningMain: '#FFB800',
    warningDark: '#DC8400',
    warningLight: '#FFDB7D',
    warningContrastText: 'rgba(0, 0, 0, 0.87)',
    infoMain: '#0094FF',
    infoDark: '#005A9B',
    infoLight: '#8CCFFF',
    infoContrastText: 'rgba(0, 0, 0, 0.87)',
  },
}

const smallButtonAndChipStyle = {
  fontSize: '12px',
  lineHeight: 1.5,
  letterSpacing: '0.5px',
  padding: '0 12px',
  minHeight: '26px',
}

const mediumButtonAndChipStyle = {
  fontSize: '14px',
  lineHeight: 1.43,
  letterSpacing: '0.25px',
  padding: '0 16px',
  minHeight: '40px',
}

const largeButtonAndChipStyle = {
  fontSize: '16px',
  lineHeight: 1.75,
  letterSpacing: '0.15px',
  padding: '0 24px',
  minHeight: '64px',
}

export function generateTheme(
  mode: 'light' | 'dark',
  colors: Colors
): ThemeOptions {
  const modeColors = mode === 'light' ? colors.lightMode : colors.darkMode

  function generateTooltipStyles() {
    if (mode === 'light') {
      return {
        backgroundColor: modeColors.commonBlack,
        color: modeColors.commonWhite,
      }
    } else {
      return {
        backgroundColor: modeColors.commonWhite,
        color: modeColors.commonBlack,
      }
    }
  }
  return {
    shape: {
      borderRadius: 16,
    },
    typography: {
      fontFamily: 'Inter',
      h1: {
        fontStyle: 'normal',
        fontWeight: 300,
        fontSize: '94px',
        lineHeight: 1.167,
        letterSpacing: '-1.5px',
      },
      h2: {
        fontStyle: 'normal',
        fontWeight: 300,
        fontSize: '59px',
        letterSpacing: '-2px',
        lineHeight: 1.2,
      },
      h3: {
        fontStyle: 'normal',
        fontWeight: 400,
        fontSize: '47px',
        letterSpacing: '0px',
        lineHeight: 1.167,
      },
      h4: {
        fontStyle: 'normal',
        fontWeight: 400,
        fontSize: '33px',
        letterSpacing: '0px',
        lineHeight: 1.235,
      },
      h5: {
        fontStyle: 'normal',
        fontWeight: 400,
        fontSize: '24px',
        letterSpacing: '0px',
        lineHeight: 1.334,
      },
      h6: {
        fontStyle: 'normal',
        fontWeight: 500,
        fontSize: '20px',
        letterSpacing: '0px',
        lineHeight: 1.6,
      },
      body1: {
        fontStyle: 'normal',
        fontWeight: 400,
        fontSize: '16px',
        letterSpacing: '0px',
        lineHeight: 1.5,
      },
      body1Bold: {
        fontStyle: 'normal',
        fontWeight: 700,
        fontSize: '16px',
        letterSpacing: '0px',
        lineHeight: 1.5,
      },
      body2: {
        fontStyle: 'normal',
        fontWeight: 400,
        fontSize: '14px',
        letterSpacing: '0px',
        lineHeight: 1.43,
      },
      subtitle1: {
        fontStyle: 'normal',
        fontWeight: 400,
        fontSize: '16px',
        letterSpacing: '0px',
        lineHeight: 1.75,
      },
      subtitle2: {
        fontStyle: 'normal',
        fontWeight: 500,
        fontSize: '14px',
        letterSpacing: '0px',
        lineHeight: 1.57,
      },
      overline: {
        fontStyle: 'normal',
        fontWeight: 400,
        fontSize: '10px',
        letterSpacing: '0px',
        lineHeight: 1.5,
        textTransform: 'uppercase',
      },
      caption: {
        fontStyle: 'normal',
        fontWeight: 400,
        fontSize: '12px',
        letterSpacing: '0px',
        lineHeight: 1.66,
      },
      button: {
        textTransform: 'none',
        fontWeight: 700,
      },
    },
    shadows: [
      ...createTheme({}).shadows.map((shadow, i) => {
        if (i === 1) {
          return '0 4px 5px rgba(0, 0, 0, 0.05)'
        } else if (i === 2) {
          return '0 4px 10px rgba(0, 0, 0, 0.1)'
        } else if (i === 3) {
          return '0 4px 15px rgba(0, 0, 0, 0.15)'
        } else {
          return 'none'
        }
      }),
    ] as Shadows,
    palette: {
      mode: mode,
      ...generatePalette(modeColors),
    },
    components: {
      MuiTooltip: {
        styleOverrides: {
          tooltip: generateTooltipStyles(),
        },
      },
      MuiTableCell: {
        styleOverrides: {
          head: {
            backgroundColor: modeColors.actionFocus,
          },
          root: {
            borderBottom: `1px solid ${modeColors.divider}`,
            padding: '8px 16px',
          },
        },
      },
      MuiTableSortLabel: {
        styleOverrides: {
          root: {
            '&.Mui-active': {
              '& .MuiTableSortLabel-icon': {
                color: modeColors.textPrimary,
              },
            },
          },
        },
      },
      MuiPopover: {
        styleOverrides: {
          paper: {
            border: `1px solid ${modeColors.divider}`,
            backgroundImage: 'none',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            '&.MuiButton-sizeSmall': {
              ...smallButtonAndChipStyle,
            },
            '&.MuiButton-sizeMedium': {
              borderRadius: '24px',
              ...mediumButtonAndChipStyle,
            },
            '&.MuiButton-sizeLarge': {
              borderRadius: '32px',
              ...largeButtonAndChipStyle,
            },
            '&.Mui-disabled': {
              background: modeColors.backgroundPaper,
              color: modeColors.textDisabled,
              border: `1px solid ${modeColors.actionDisabled}`,
            },
          },
          containedPrimary: {
            background: modeColors.primaryMain,
            color: modeColors.primaryContrastText,
            '&:hover': {
              background: modeColors.primaryLight,
            },
            '&:active': {
              background: modeColors.primaryMain,
              outline: `2px solid ${modeColors.primaryLight}`,
            },
          },
          containedSecondary: {
            '&:hover': {
              background: modeColors.secondaryLight,
            },
            '&:active': {
              background: modeColors.secondaryMain,
              outline: `2px solid ${modeColors.secondaryLight}`,
            },
          },
          outlinedSecondary: {
            color: modeColors.textPrimary,
            '&:hover': {
              border: `1px solid ${modeColors.secondaryDark}`,
              background: modeColors.secondaryFocus,
            },
            '&:active': {
              outline: `2px solid ${modeColors.secondaryLight}`,
            },
          },
          textSecondary: {
            color: modeColors.textPrimary,
            '&:hover': {
              background: modeColors.secondaryFocus,
            },
            '&.Mui-disabled': {
              border: 'none',
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            '& .MuiChip-icon': {
              margin: '0px 8px 0px 0px',
            },
            '& .MuiChip-label': {
              padding: 0,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            },
            '&.MuiChip-sizeSmall': {
              ...smallButtonAndChipStyle,
            },
            '&.MuiChip-sizeMedium': {
              borderRadius: '24px',
              ...mediumButtonAndChipStyle,
            },
            '&.MuiChip-sizeLarge': {
              borderRadius: '32px',
              ...largeButtonAndChipStyle,
            },
            color: modeColors.textPrimary,
            background: modeColors.backgroundPaper,
            '&.Mui-disabled': {
              opacity: 1,
              background: modeColors.backgroundPaper,
              color: modeColors.textDisabled,
              border: `1px solid ${modeColors.actionDisabled}`,
            },
          },
          colorPrimary: {
            border: `1px solid ${modeColors.textPrimary}`,
            '&:hover': {
              color: modeColors.primaryContrastText,
            },
            '&:active': {
              outline: `2px solid ${modeColors.primaryLight}`,
            },
          },
          colorSecondary: {
            border: `1px solid ${modeColors.secondaryMain}`,
            '&:hover': {
              color: modeColors.primaryContrastText,
              background: modeColors.secondaryMain,
            },
            '&:active': {
              outline: `2px solid ${modeColors.secondaryLight}`,
            },
          },
        },
      },
    },
  }
}

let rusticLightTheme = createTheme(generateTheme('light', colors))
let rusticDarkTheme = createTheme(generateTheme('dark', colors))

rusticLightTheme = responsiveFontSizes(rusticLightTheme)
rusticDarkTheme = responsiveFontSizes(rusticDarkTheme)
export default rusticLightTheme
export { rusticDarkTheme, rusticLightTheme }
