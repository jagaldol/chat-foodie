import React, { ChangeEvent, KeyboardEvent } from "react"

/**
 * \<input\>에서 최대 입력가능 글자 수 제한
 * e.g. input에 onChange={e => { limitInputNumber(e, limit) } 추가
 * @param event
 * @param limit
 */
export function limitInputNumber(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, limit: number) {
  const { value } = event.target
  if (value.length > limit) {
    // eslint-disable-next-line no-param-reassign
    event.target.value = value.slice(0, limit)
  }
}

/**
 * focus되어 있을 때 enter 입력 시 callback 실행
 * e.g. React Component에 onKeyDown={(event)=>pressEnter(event, callback) 추가
 * @param event
 * @param callback
 */
export function pressEnter(event: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>, callback: () => void) {
  if (event.key === "Enter") {
    if (!event.shiftKey) {
      // shift 아니면
      event.preventDefault()
      callback()
    }
  }
}

const daysInMonth: any = {
  1: 31,
  2: 28,
  3: 31,
  4: 30,
  5: 31,
  6: 30,
  7: 31,
  8: 31,
  9: 30,
  10: 31,
  11: 30,
  12: 31,
}
function isLeapYear(year: number) {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0
}
export function generateDayOptions(year: number, month: number) {
  const maxDays = month === 2 && isLeapYear(year) ? 29 : daysInMonth[month]
  const options = []
  for (let i = 1; i <= maxDays; i += 1) {
    options.push(
      <option key={i} value={i}>
        {i}
      </option>,
    )
  }
  return options
}
export function generateYearOptions() {
  const options = []
  const minYear = 1900
  const maxYear = new Date().getFullYear()
  for (let i = minYear; i <= maxYear; i += 1) {
    options.push(
      <option key={i} value={i}>
        {i}
      </option>,
    )
  }
  return options
}
