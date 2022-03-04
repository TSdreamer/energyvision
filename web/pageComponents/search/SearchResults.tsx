import { Tabs } from '@components'
import { Index, useHits } from 'react-instantsearch-hooks'
import styled from 'styled-components'
import { useRouter } from 'next/router'
import { FormattedMessage } from 'react-intl'
import NumberOfHits from './NumberOfHits'
import Hits from './Hits'
import EventHit from './EventHit'
import TopicHit from './TopicHit'
import { getIsoFromLocale } from '../../lib/localization' // grrr ../
import { Pagination } from './Pagination'
import TotalResultsStat from './TotalResultsStat'
import { isGlobalProduction } from '../../common/helpers/datasetHelpers'

const Results = styled.div`
  margin-top: var(--space-xLarge);
`

const StyledPagination = styled(Pagination)`
  margin-top: var(--space-xLarge);
  justify-content: center;
`

const { Tab, TabList, TabPanel, TabPanels } = Tabs

// Sven: I don't understand how we can revieve this number, it's configured
// in the Configure component, so how could we get it from there
const HITS_PER_PAGE = 5

type SearchResultsProps = {
  setIsOpen: (arg0: boolean) => void
  handleTabChange: (arg0: number) => void
  activeTabIndex: number
}

const SearchResults = ({ setIsOpen, handleTabChange, activeTabIndex }: SearchResultsProps) => {
  const router = useRouter()
  //const replaceUrl = useRouterReplace()
  const { results } = useHits()
  const isoCode = getIsoFromLocale(router.locale)

  const hasQuery = results && results.query !== ''

  // @TODO How can we make this robust?
  const envPrefix = isGlobalProduction ? 'prod' : 'dev'

  return (
    <>
      {hasQuery && (
        <Results>
          <Tabs index={activeTabIndex} onChange={handleTabChange}>
            <TabList>
              <Tab inverted>
                {/*   <Index indexName={`${envPrefix}_TOPICS_${isoCode}`} indexId={`${envPrefix}_TOPICS_${isoCode}`}> */}
                <FormattedMessage id="search_topics_tab" defaultMessage="Topics" />
                <NumberOfHits />
                {/*  </Index> */}
              </Tab>
              <Tab inverted>
                <Index indexName={`${envPrefix}_EVENTS_${isoCode}`} indexId={`${envPrefix}_EVENTS_${isoCode}`}>
                  <FormattedMessage id="search_events_tab" defaultMessage="Events" />
                  <NumberOfHits />
                </Index>
              </Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                {/*   <Index indexName={`${envPrefix}_TOPICS_${isoCode}`} indexId={`${envPrefix}_TOPICS_${isoCode}`}> */}
                <TotalResultsStat hitsPerPage={HITS_PER_PAGE} />
                <Hits hitComponent={TopicHit} setIsOpen={setIsOpen} category="Topic" />
                <StyledPagination padding={1} />
                {/*   </Index> */}
              </TabPanel>
              <TabPanel>
                <Index indexName={`${envPrefix}_EVENTS_${isoCode}`} indexId={`${envPrefix}_EVENTS_${isoCode}`}>
                  <TotalResultsStat hitsPerPage={HITS_PER_PAGE} />
                  <Hits setIsOpen={setIsOpen} hitComponent={EventHit} category="Event" />
                  <StyledPagination padding={1} />
                </Index>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Results>
      )}
    </>
  )
}

export default SearchResults
