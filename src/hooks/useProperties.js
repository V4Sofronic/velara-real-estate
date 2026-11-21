import { useEffect, useState } from 'react'
import { api } from '../api'

let cache = null
export function useProperties() {
  const [list, setList] = useState(cache)
  const [error, setError] = useState('')
  useEffect(() => {
    if (cache) return
    api.listProperties().then((l) => { cache = l; setList(l) }).catch((e) => setError(e.message))
  }, [])
  return { list, loading: !list && !error, error }
}
