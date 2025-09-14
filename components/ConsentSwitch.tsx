'use client'

import { useState } from 'react'

interface ConsentSwitchProps {
  checked: boolean
  onChange: (checked: boolean) => void
}

export function ConsentSwitch({ checked, onChange }: ConsentSwitchProps) {
  return (
    <div className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only peer"
        />
        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
      </label>
      <div className="text-sm">
        <p className="font-medium text-gray-800 dark:text-gray-200">
          Bagikan data anonim untuk tren komunitas
        </p>
        <p className="text-gray-600 dark:text-gray-400">
          Data akan digunakan untuk melacak pola kesehatan regional tanpa menyimpan informasi pribadi
        </p>
      </div>
    </div>
  )
}
