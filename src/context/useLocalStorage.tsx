import { useState } from 'react'

export default function useLocalStorage() {
  const [refreshState, setRefreshState] = useState(false)

  const saveToLocalStorage = (key: string, value: any) => {
    setRefreshState(!refreshState)
    localStorage.setItem(key, JSON.stringify(value))
  }

  const getFromLocalStorage = (key: string, default_: any) => {
    const result = localStorage.getItem(key)

    if (result === null) {
      return default_
    }
    return JSON.parse(result)
  }

  return {
    save: saveToLocalStorage,
    load: getFromLocalStorage,
  }
}
