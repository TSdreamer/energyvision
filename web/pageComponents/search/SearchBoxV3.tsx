import { useRouter } from 'next/router'
import { useEffect, useRef, useState, ChangeEvent, ComponentProps, useContext } from 'react'
import { useSearchBox, UseSearchBoxProps } from 'react-instantsearch-hooks-web'
import ControlledSearchBox from './ControlledSearchBox'
import { SearchContext } from './SearchContext'

const DEBOUNCE_TIME = 400

export type SearchBoxProps = ComponentProps<'div'> & UseSearchBoxProps

export function SearchBox(props: SearchBoxProps) {
  const router = useRouter()

  // I don't think we need iSearchStalled when we don't have a manual reset button and/or loading
  // spinner if search is slow? Do we need a spinner if this happens?
  const { query, refine /* isSearchStalled */ } = useSearchBox(props)
  const [value, setValue] = useState(query)
  const { userTyped, setUserTyped } = useContext(SearchContext)
  const inputRef = useRef<HTMLInputElement>(null)

  function onReset() {
    setValue('')
    router.push({
      query: {
        ...router.query,
        query: '',
      },
    })
  }

  function onChange(event: ChangeEvent<HTMLInputElement>) {
    setUserTyped(true)
    setValue(event.currentTarget.value)
  }

  // route to state
  useEffect(() => {
    if (userTyped) return
    setValue((router.query.query as string) || '')
  }, [userTyped, router.query.query])

  // state to route
  const debounceRef: { current: NodeJS.Timeout | null } = useRef(null)
  useEffect(() => {
    clearTimeout(debounceRef.current as NodeJS.Timeout)
    debounceRef.current = setTimeout(() => {
      console.log(router.query)
      const urlParts = router.asPath.split('?')[0]
      router.replace(
        {
          // @TODO Add the asPath explicit because of the 404 page and ssr
          // This might cause bugs, I'm a bit unsure about the best approach here :/
          // It adds the next.js query params slug :( Look into this
          // jeeeez, remove the slug query
          // pathname: router.asPath,
          pathname: urlParts,
          query: {
            query,
            tab: query === '' ? '' : router.query.tab,
          },
        },
        undefined,
        { shallow: true },
      )
    }, DEBOUNCE_TIME)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query])

  useEffect(() => {
    if (query !== value) {
      refine(value)
    }
    // We want to track when the value coming from the React state changes
    // to update the InstantSearch.js query, so we don't need to track the
    // InstantSearch.js query.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, refine])

  return (
    <ControlledSearchBox
      inputRef={inputRef}
      /* isSearchStalled={isSearchStalled} */
      onChange={onChange}
      onReset={onReset}
      value={value}
    />
  )
}