import React, { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const useQuery = () => {
  const navigate = useNavigate()

  const location = useLocation()
  const [query, setQuery] = useState(null)
  const searchParams = useMemo(() => {
    return new URLSearchParams(location.search)
  }, [location.search])
  useEffect(() => {
    const newQuery = { page: 1 }
    for (const pair of searchParams.entries()) {
      newQuery[pair[0]] = pair[1]
    }
    setQuery(newQuery)
  }, [location.search])
  const onChange = (name, value) => {
    searchParams.set(name, value)
    navigate(
      {
        pathname: location.pathname,
        search: searchParams.toString(),
      },
      { replace: true }
    )
  }
  return { query, onChange }
}

export default useQuery
