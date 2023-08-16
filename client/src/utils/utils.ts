import { ChangeEvent, KeyboardEvent } from "react"

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
    // Enter 입력
    callback()
  }
}
