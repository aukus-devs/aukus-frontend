import { useCallback, useSyncExternalStore } from 'react'

type Props<T> = {
  key: string
  defaultValue: T
}

export default function useLocalStorage<T>({ key, defaultValue }: Props<T>) {
  const eventKey = `local-storage-${key}`

  const getSnapshot = useCallback(() => {
    return localStorage.getItem(key)
  }, [key])

  const subscribe = useCallback(
    (onChange: () => void) => {
      window.addEventListener(eventKey, onChange)
      return () => window.removeEventListener(eventKey, onChange)
    },
    [eventKey]
  )

  const valueRaw = useSyncExternalStore(subscribe, getSnapshot)

  const save = (value: T) => {
    localStorage.setItem(key, JSON.stringify(value))
    window.dispatchEvent(new Event(eventKey))
  }

  let currentValue = null
  if (valueRaw !== null) {
    currentValue = JSON.parse(valueRaw) as T
  }

  return {
    save,
    value: currentValue ?? defaultValue,
  }
}
