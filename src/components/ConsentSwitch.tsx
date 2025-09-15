import { cn } from '@/src/lib/utils'

interface ConsentSwitchProps {
  checked: boolean
  onChange: (checked: boolean) => void
  className?: string
}

export function ConsentSwitch({ checked, onChange, className }: ConsentSwitchProps) {
  return (
    <div className={cn("rk-card p-4", className)}>
      <div className="flex items-center gap-3">
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-rk-border peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-rk-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-rk-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rk-primary"></div>
        </label>
        <div className="text-sm">
          <p className="font-medium text-rk-text">
            Bagikan data anonim untuk tren komunitas
          </p>
          <p className="text-rk-subtle">
            Data akan digunakan untuk melacak pola kesehatan regional tanpa menyimpan informasi pribadi
          </p>
        </div>
      </div>
    </div>
  )
}