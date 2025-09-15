import { forwardRef } from 'react'
import { cn } from '@/src/lib/utils'
import { generateId } from '@/src/lib/accessibility'

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  help?: string
  icon?: React.ReactNode
}

export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, error, help, icon, className, id, ...props }, ref) => {
    const fieldId = id || generateId('form-field')
    const helpId = generateId('form-help')
    const errorId = generateId('form-error')
    
    return (
      <div className="space-y-2">
        <label 
          htmlFor={fieldId}
          className="block text-sm font-medium text-rk-text"
        >
          {label}
        </label>
        <div className="relative">
          {icon && (
            <div 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-rk-subtle"
              aria-hidden="true"
            >
              {icon}
            </div>
          )}
          <input
            ref={ref}
            id={fieldId}
            className={cn(
              "w-full px-4 py-3 bg-rk-surface border border-rk-border rounded-2xl text-rk-text placeholder-rk-subtle transition-colors rk-focus",
              "hover:border-rk-primary/50 focus:border-rk-primary",
              error && "border-rk-danger focus:border-rk-danger",
              icon && "pl-10",
              className
            )}
            aria-describedby={error ? errorId : help ? helpId : undefined}
            aria-invalid={error ? 'true' : 'false'}
            {...props}
          />
        </div>
        {help && !error && (
          <p id={helpId} className="text-sm text-rk-subtle">{help}</p>
        )}
        {error && (
          <p id={errorId} className="text-sm text-rk-danger" role="alert">
            {error}
          </p>
        )}
      </div>
    )
  }
)

FormField.displayName = 'FormField'

interface TextareaFieldProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  error?: string
  help?: string
  icon?: React.ReactNode
}

export const TextareaField = forwardRef<HTMLTextAreaElement, TextareaFieldProps>(
  ({ label, error, help, icon, className, id, ...props }, ref) => {
    const fieldId = id || generateId('textarea-field')
    const helpId = generateId('textarea-help')
    const errorId = generateId('textarea-error')
    
    return (
      <div className="space-y-2">
        <label 
          htmlFor={fieldId}
          className="block text-sm font-medium text-rk-text"
        >
          {label}
        </label>
        <div className="relative">
          {icon && (
            <div 
              className="absolute left-3 top-3 text-rk-subtle"
              aria-hidden="true"
            >
              {icon}
            </div>
          )}
          <textarea
            ref={ref}
            id={fieldId}
            className={cn(
              "w-full px-4 py-3 bg-rk-surface border border-rk-border rounded-2xl text-rk-text placeholder-rk-subtle transition-colors rk-focus resize-none",
              "hover:border-rk-primary/50 focus:border-rk-primary",
              error && "border-rk-danger focus:border-rk-danger",
              icon && "pl-10",
              className
            )}
            aria-describedby={error ? errorId : help ? helpId : undefined}
            aria-invalid={error ? 'true' : 'false'}
            {...props}
          />
        </div>
        {help && !error && (
          <p id={helpId} className="text-sm text-rk-subtle">{help}</p>
        )}
        {error && (
          <p id={errorId} className="text-sm text-rk-danger" role="alert">
            {error}
          </p>
        )}
      </div>
    )
  }
)

TextareaField.displayName = 'TextareaField'

interface SelectFieldProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  error?: string
  help?: string
  icon?: React.ReactNode
  options: { value: string; label: string }[]
}

export const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(
  ({ label, error, help, icon, options, className, id, ...props }, ref) => {
    const fieldId = id || generateId('select-field')
    const helpId = generateId('select-help')
    const errorId = generateId('select-error')
    
    return (
      <div className="space-y-2">
        <label 
          htmlFor={fieldId}
          className="block text-sm font-medium text-rk-text"
        >
          {label}
        </label>
        <div className="relative">
          {icon && (
            <div 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-rk-subtle"
              aria-hidden="true"
            >
              {icon}
            </div>
          )}
          <select
            ref={ref}
            id={fieldId}
            className={cn(
              "w-full px-4 py-3 bg-rk-surface border border-rk-border rounded-2xl text-rk-text transition-colors rk-focus appearance-none",
              "hover:border-rk-primary/50 focus:border-rk-primary",
              error && "border-rk-danger focus:border-rk-danger",
              icon && "pl-10",
              className
            )}
            aria-describedby={error ? errorId : help ? helpId : undefined}
            aria-invalid={error ? 'true' : 'false'}
            {...props}
          >
            <option value="">Pilih {label.toLowerCase()}</option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div 
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-rk-subtle pointer-events-none"
            aria-hidden="true"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        {help && !error && (
          <p id={helpId} className="text-sm text-rk-subtle">{help}</p>
        )}
        {error && (
          <p id={errorId} className="text-sm text-rk-danger" role="alert">
            {error}
          </p>
        )}
      </div>
    )
  }
)

SelectField.displayName = 'SelectField'
