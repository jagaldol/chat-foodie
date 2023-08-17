import React from "react"

export default function InputComponent({
  label,
  type,
  name,
  placeholder,
  value,
  onChange,
  required,
}: {
  label: string
  type: string
  name: string
  placeholder: string
  value?: string
  onChange: React.ChangeEventHandler<HTMLInputElement>
  required?: boolean
}) {
  const requiredClass = required
    ? "after:content-['*'] after:ml-0.5 after:text-red-500 block text-sm font-medium text-slate-700"
    : "block text-sm font-medium text-slate-700"
  return (
    <label htmlFor={name} className="block w-80 h-16 mb-3">
      <span className={requiredClass}>{label}</span>
      <input
        type={type}
        name={name}
        value={value}
        className="mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-main-theme focus:ring-main-theme block w-full rounded-md sm:text-sm focus:ring-1"
        placeholder={placeholder}
        onChange={onChange}
      />
    </label>
  )
}

InputComponent.defaultProps = {
  required: false,
  value: undefined,
}
