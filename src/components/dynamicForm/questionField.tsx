import { useMediaQuery, useTheme } from '@mui/material'
import Chip from '@mui/material/Chip'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import Stack from '@mui/material/Stack'
import React, { useState } from 'react'
import { filterDOMProps, useField } from 'uniforms'

type Option<T> = {
  label?: string
  value: T
}

type QuestionFieldProps = {
  name: string
  options?: Option<string>[]
  value?: string
}

function QuestionField(props: QuestionFieldProps) {
  const [fieldProps] = useField(props.name, props)

  const {
    options = [],
    disabled,
    onChange,
    value,
    error,
    errorMessage,
    showInlineError,
    ...rest
  } = fieldProps

  const [selectedOption, setSelectedOption] = useState<string>(value || '')

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const buttonGroupOrientation = isMobile ? 'column' : 'row'

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option)
    onChange?.(option)
  }

  const buttonList = options.map((option, index) => {
    const isSelected = selectedOption === option.value
    const selectedStyles = {
      '&.MuiChip-root': {
        backgroundColor: 'secondary.light',
        color: 'text.primary',
      },
    }

    return (
      <Chip
        key={index}
        onClick={() => handleOptionSelect(option.value)}
        color="secondary"
        sx={isSelected ? selectedStyles : {}}
        className="rustic-option"
        disabled={!!disabled}
        aria-disabled={!!disabled}
        label={option.label || option.value}
      />
    )
  })

  return (
    <FormControl
      component="fieldset"
      fullWidth
      error={!!error}
      {...filterDOMProps(rest)}
      className="rustic-question-field"
    >
      <Stack
        direction={buttonGroupOrientation}
        className="rustic-options-container"
      >
        {buttonList}
      </Stack>

      {!!(error && showInlineError) && (
        <FormHelperText>{errorMessage}</FormHelperText>
      )}
    </FormControl>
  )
}

export default QuestionField
