import React from "react"

export default function TextField({
  label,
  type,
  name,
  placeholder,
  value = undefined,
  required = false,
  error = undefined,
  message = undefined,
  disabled = undefined,
  onChange = undefined,
  onBlur = undefined,
}: {
  label: string
  type: string
  name: string
  placeholder: string
  value?: string
  required?: boolean
  error?: string
  message?: string
  disabled?: boolean
  onChange?: React.ChangeEventHandler<HTMLInputElement>
  onBlur?: React.FocusEventHandler<HTMLInputElement>
}) {
  const requiredClass = required
    ? "after:content-['*'] after:ml-0.5 after:text-red-500 block text-sm font-medium text-slate-700"
    : "block text-sm font-medium text-slate-700"
  return (
    <label htmlFor={name} className="flex flex-col w-80 mb-3">
      <span className={requiredClass}>{label}</span>
      <input
        type={type}
        name={name}
        value={value}
        className="mt-1 px-3 py-2 h-10 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-main-theme focus:ring-main-theme block w-full rounded-md sm:text-sm focus:ring-1 disabled:opacity-50"
        placeholder={placeholder}
        onBlur={onBlur}
        onChange={onChange}
        disabled={disabled}
      />
      {message && <p className="block text-sm font-medium text-slate-700 mt-1">{message}</p>}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </label>
  )
}
