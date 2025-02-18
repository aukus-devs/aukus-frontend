import { useEffect, useState } from 'react'

type Props<T> = {
  key: string
  defaultValue: T
}

const localState: { [k: string]: string | null } = {}
const localStateChangeListeners: { [k: string]: (() => void)[] } = {}
// const syncIntervalRef = setInterval(syncLocalState, 1000)

export default function useLocalStorage<T>({ key, defaultValue }: Props<T>) {
  const [refreshState, setRefreshState] = useState(false)

  const onChange = () => {
    setRefreshState((prev) => !prev)
  }

  useEffect(() => {
    addLocalStateChangeListener(key, onChange)
    return () => {
      removeLocalStateChangeListener(key, onChange)
    }
  }, [key])

  const save = (value: any) => {
    saveToLocalState(key, JSON.stringify(value))
  }

  const valueRaw = getFromLocalState(key)
  let currentValue = null
  if (valueRaw !== null) {
    currentValue = JSON.parse(valueRaw) as T
  }

  return {
    save,
    value: currentValue ?? defaultValue,
  }
}

function getFromLocalState(key: string) {
  const value = localState[key]
  if (value !== undefined) {
    return value
  }
  const storageValue = localStorage.getItem(key)
  localState[key] = storageValue
  return storageValue
}

function saveToLocalState(key: string, value: string) {
  localStorage.setItem(key, value)
  syncKey(key)
}

function addLocalStateChangeListener(key: string, listener: () => void) {
  localStateChangeListeners[key] = localStateChangeListeners[key] || []
  localStateChangeListeners[key].push(listener)
}

function removeLocalStateChangeListener(key: string, listener: () => void) {
  const listeners = localStateChangeListeners[key]
  if (listeners) {
    const index = listeners.indexOf(listener)
    if (index !== -1) {
      listeners.splice(index, 1)
    }
  }
}

function syncLocalState() {
  for (const key in localState) {
    syncKey(key)
  }
}

function syncKey(key: string) {
  const localValue = localState[key]
  const newValue = localStorage.getItem(key)
  if (localValue !== newValue) {
    localState[key] = newValue
    const listeners = localStateChangeListeners[key]
    if (!listeners) {
      return
    }
    listeners.forEach((listener) => listener())
  }
}
