import React from 'react'
import Button from './Button'
import type { ButtonProps } from './Button'
import Icon from '../Icon'

export interface ZapoutButtonProps extends Omit<ButtonProps, 'isLink' | 'to'> {}

const ZapoutButton: React.FC<ZapoutButtonProps> = ({
  variant = 'primary',
  size = 'md',
  disabled = false,
  children,
  rounded = true,

  ...props
}) => {
  return (
    <Button
      {...props}
      variant={variant}
      size={size}
      disabled={disabled}
      isLink={true}
      to={'/zapout'}
      rounded={rounded}
    >
      <picture>
        <Icon icon="zap" />
      </picture>

      {children}
    </Button>
  )
}

export default ZapoutButton
