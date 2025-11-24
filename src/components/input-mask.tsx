import React, { forwardRef } from 'react'

interface InputMaskProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'children'> {
  mask: string
  value: string
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  children: (props: React.InputHTMLAttributes<HTMLInputElement>) => React.ReactElement
}

/**
 * Aplica uma máscara a um valor de input
 * @param value - Valor a ser mascarado
 * @param mask - Máscara no formato '999.999.999-99' onde 9 representa um dígito
 * @returns Valor mascarado
 */
export function applyMask(value: string, mask: string): string {
  if (!value) return ''

  // Remove todos os caracteres não numéricos
  const numbers = value.replace(/\D/g, '')
  let maskedValue = ''
  let numberIndex = 0

  // Itera pela máscara e aplica os números
  for (let i = 0; i < mask.length && numberIndex < numbers.length; i++) {
    if (mask[i] === '9') {
      maskedValue += numbers[numberIndex]
      numberIndex++
    } else {
      maskedValue += mask[i]
    }
  }

  return maskedValue
}

/**
 * Remove a máscara de um valor, mantendo apenas os números
 * @param value - Valor mascarado
 * @returns Valor sem máscara (apenas números)
 */
export function removeMask(value: string): string {
  return value.replace(/\D/g, '')
}

/**
 * Componente de input com máscara customizável
 * Uso:
 * <InputMask
 *   mask="999.999.999-99"
 *   value={value}
 *   onChange={handleChange}
 * >
 *   {(props) => <Input {...props} />}
 * </InputMask>
 */
export const InputMask = forwardRef<HTMLInputElement, InputMaskProps>(
  ({ mask, value, onChange, children, ...rest }, ref) => {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = event.target.value
      const maskedValue = applyMask(inputValue, mask)

      // Cria um novo evento com o valor mascarado
      const syntheticEvent = {
        ...event,
        target: {
          ...event.target,
          value: maskedValue
        }
      } as React.ChangeEvent<HTMLInputElement>

      onChange(syntheticEvent)
    }

    const inputProps = {
      ...rest,
      ref,
      value: applyMask(value, mask),
      onChange: handleChange
    }

    return children(inputProps)
  }
)

InputMask.displayName = 'InputMask'
