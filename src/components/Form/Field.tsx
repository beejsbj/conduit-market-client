import * as React from 'react'
import { cn } from '@/lib/utils'
import Input from './Input'
import Icon from '../Icon'
import { useAutoAnimate } from '@formkit/auto-animate/react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from './Dropdown'

export type FieldProps = {
  label?: string
  labelClassName?: string
  name: string
  type?:
    | 'text'
    | 'number'
    | 'email'
    | 'password'
    | 'dropdown'
    | 'select'
    | 'textarea'
    | 'file'
  required?: boolean
  help?: string
  error?: string
  options?: string[] | { label: string; value: string }[]
  className?: string
  inputWrapperClassName?: string
  inputClassName?: string
  disabled?: boolean
  hidden?: boolean
  placeholder?: string
  rightIcon?: keyof typeof Icon
  leftIcon?: keyof typeof Icon
} & React.ComponentProps<'input'> &
  React.ComponentProps<'select'> &
  React.ComponentProps<'textarea'>

const Field = React.forwardRef<
  | HTMLInputElement
  | HTMLSelectElement
  | HTMLTextAreaElement
  | HTMLButtonElement,
  FieldProps
>(
  (
    {
      label,
      labelClassName,
      name,
      type = 'text',
      required,
      help,
      error,
      options,
      className,
      inputWrapperClassName,
      inputClassName,
      disabled,
      hidden,
      placeholder,
      rightIcon,
      leftIcon,
      ...props
    },
    ref
  ) => {
    const id = React.useId()
    const [parent] = useAutoAnimate()
    const containerClassNames = cn(
      'grid gap-1 relative',
      {
        'cursor-not-allowed opacity-50': disabled,
        hidden: hidden
      },
      className
    )

    const labelClassNames = cn(
      // Typography - Using design system voice level for consistent text styling
      'voice-sm font-bold',
      labelClassName,

      // Add any conditional classes if needed
      {
        'sr-only': hidden // Accessibility: Hide label visually but keep for screen readers if field is hidden
      }
    )

    const inputWrapperClassNames = cn(
      // Position & Layout
      'relative flex items-center',

      // Spacing
      'p-2 pl-4',

      // Borders & Shape
      'rounded-lg border',

      // Error styling
      error ? 'border-red-500' : 'border-base-700',

      // Colors & Background
      'bg-base-900',

      // Typography
      'voice-base',

      // Interactive States
      'shadow-sm transition-colors focus-within:outline-none focus-within:ring-1',
      error ? 'focus-within:ring-red-500' : 'focus-within:ring-ring',

      // File Input Specific Styles
      {
        'file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground':
          type === 'file'
      },

      inputWrapperClassName
    )

    const inputClassNames = cn(
      'w-full bg-transparent outline-none',
      {
        'pl-6': leftIcon,
        'pr-6': rightIcon
      },
      inputClassName
    )

    const renderFormElement = () => {
      if (type === 'dropdown') {
        const selectedOption = options?.find(
          (option) =>
            (typeof option === 'string' ? option : option.value) === props.value
        )
        const displayLabel = selectedOption
          ? typeof selectedOption === 'string'
            ? selectedOption
            : selectedOption.label
          : placeholder ?? 'Select an option'

        return (
          <DropdownMenu>
            <DropdownMenuTrigger
              ref={ref as React.RefObject<HTMLButtonElement>}
              id={id}
              name={name}
              disabled={disabled}
              className={cn(inputClassNames, 'w-full text-left')}
            >
              <span>{displayLabel}</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {options?.map((option, index) => {
                const value = typeof option === 'string' ? option : option.value
                const label = typeof option === 'string' ? option : option.label
                return (
                  <DropdownMenuItem
                    key={index}
                    onSelect={() => {
                      if (props.onChange) {
                        const event = {
                          target: { value, name }
                        } as any
                        props.onChange(event)
                      }
                    }}
                  >
                    {label}
                  </DropdownMenuItem>
                )
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        )
      }

      if (type === 'select') {
        return (
          <select
            id={id}
            ref={ref as React.RefObject<HTMLSelectElement>}
            name={name}
            disabled={disabled}
            className={inputClassNames}
            {...(props as React.ComponentProps<'select'>)}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options?.map((option, index) => {
              if (typeof option === 'string') {
                return (
                  <option key={index} value={option}>
                    {option}
                  </option>
                )
              } else {
                return (
                  <option key={index} value={option.value}>
                    {option.label}
                  </option>
                )
              }
            })}
          </select>
        )
      }

      if (type === 'textarea') {
        return (
          <textarea
            id={id}
            ref={ref as React.RefObject<HTMLTextAreaElement>}
            name={name}
            disabled={disabled}
            placeholder={placeholder ?? label}
            className={cn(inputClassNames, 'min-h-[80px] resize-y')}
            {...(props as React.ComponentProps<'textarea'>)}
          />
        )
      }

      return (
        <Input
          id={id}
          ref={ref as React.RefObject<HTMLInputElement>}
          name={name}
          type={type}
          disabled={disabled}
          placeholder={placeholder ?? label}
          className={inputClassNames}
          {...(props as React.ComponentProps<'input'>)}
        />
      )
    }

    const LeftIcon = leftIcon ? Icon[leftIcon] : null
    const RightIcon = rightIcon ? Icon[rightIcon] : null

    return (
      <div ref={parent} className={containerClassNames}>
        {label && (
          <label htmlFor={id} className={labelClassNames}>
            {label}
            {required && <span className="text-secondary ml-1">*</span>}
          </label>
        )}
        <div className={inputWrapperClassNames}>
          {LeftIcon && <LeftIcon className="absolute left-2" />}
          {renderFormElement()}
          {RightIcon && <RightIcon className="absolute right-2" />}
        </div>
        {error && (
          <p className="text-destructive-foreground voice-sm mt-1">{error}</p>
        )}
        {help && !error && (
          <p className="text-muted-foreground voice-sm mt-1">{help}</p>
        )}
      </div>
    )
  }
)

Field.displayName = 'Field'

export default Field
