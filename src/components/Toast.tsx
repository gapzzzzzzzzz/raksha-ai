'use client'

import { useState, useEffect } from 'react'
import { CheckCircle, AlertCircle, X } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface ToastProps {
  id: string
  type: 'success' | 'error' | 'info'
  title: string
  description?: string
  duration?: number
  onClose: (id: string) => void
}

export function Toast({ id, type, title, description, duration = 5000, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(() => onClose(id), 300)
    }, duration)

    return () => clearTimeout(timer)
  }, [id, duration, onClose])

  const config = {
    success: {
      icon: CheckCircle,
      color: 'text-rk-accent',
      bgColor: 'bg-rk-accent/10',
      borderColor: 'border-rk-accent/20'
    },
    error: {
      icon: AlertCircle,
      color: 'text-rk-danger',
      bgColor: 'bg-rk-danger/10',
      borderColor: 'border-rk-danger/20'
    },
    info: {
      icon: AlertCircle,
      color: 'text-rk-primary',
      bgColor: 'bg-rk-primary/10',
      borderColor: 'border-rk-primary/20'
    }
  }

  const { icon: Icon, color, bgColor, borderColor } = config[type]

  return (
    <div
      className={cn(
        "rk-card p-4 max-w-sm w-full transform transition-all duration-300",
        isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0",
        bgColor,
        borderColor
      )}
    >
      <div className="flex items-start gap-3">
        <Icon className={cn("w-5 h-5 mt-0.5 flex-shrink-0", color)} />
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-rk-text text-sm">{title}</h4>
          {description && (
            <p className="text-rk-subtle text-xs mt-1">{description}</p>
          )}
        </div>
        <button
          onClick={() => {
            setIsVisible(false)
            setTimeout(() => onClose(id), 300)
          }}
          className="text-rk-subtle hover:text-rk-text transition-colors flex-shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

export function ToastContainer({ toasts, onClose }: { toasts: ToastProps[], onClose: (id: string) => void }) {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} onClose={onClose} />
      ))}
    </div>
  )
}
