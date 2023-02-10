import { BackgroundContainer } from '@components'
import { Configure, InstantSearch } from 'react-instantsearch-hooks-web'
import styled from 'styled-components'
import { Flags } from '../../common/helpers/datasetHelpers'
import { searchClient, searchClientServer } from '../../lib/algolia'
import { getIsoFromLocale } from '../../lib/localization'
import type { MagazineIndexPageType } from '../../types'
import { Hits } from '../searchIndexPages/magazineIndex/Hits'
import { MagazineTagFilter } from '../searchIndexPages/magazineIndex/MagazineTagFilter'
import { Pagination } from '../shared/search/pagination/Pagination'
import { UnpaddedText } from './newsroom/StyledComponents'
//import { history } from 'instantsearch.js/es/lib/routers'
import { useRef } from 'react'
import usePaginationPadding from '../../lib/hooks/usePaginationPadding'
import Seo from '../../pageComponents/shared/Seo'
import { HeroTypes } from '../../types/types'
import MagazineIndexText from '../shared/portableText/MagazineIndexText'
import { PaginationContextProvider } from '../shared/search/pagination/PaginationContext'
import Teaser from '../shared/Teaser'
import { SharedBanner } from './shared/SharedBanner'
import SharedTitle from './shared/SharedTitle'

const IngressWrapper = styled.div`
  max-width: 1186px; /* 1920 - (2 * 367) */
  margin: 0 auto;
`

const Intro = styled.div`
  padding: var(--space-3xLarge) var(--layout-paddingHorizontal-large) var(--space-xLarge);
`

const MagazineWapper = styled.div`
  padding: var(--space-xLarge);
  max-width: var(--maxViewportWidth);
  margin: 0 auto;

  @media (min-width: 1000px) {
    padding: var(--space-3xLarge);
  }
`

const StyledHits = styled(Hits)`
  padding-bottom: var(--space-xLarge);

  @media (min-width: 1000px) {
    padding-bottom: var(--space-3xLarge);
  }
`

const StyledPagination = styled(Pagination)`
  padding: var(--space-xLarge) 0;
  justify-content: center;
`

type MagazineIndexTemplateProps = {
  isServerRendered?: boolean
  locale: string
  pageData: MagazineIndexPageType
  slug?: string
  // url: string
}

const MagazineIndexPage = ({
  isServerRendered = false,
  locale,
  pageData,
  slug /* url */,
}: MagazineIndexTemplateProps) => {
  const { ingress, title, hero, seoAndSome, magazineTags, footerComponent } = pageData || {}
  const envPrefix = Flags.IS_GLOBAL_PROD ? 'prod' : 'dev'
  const isoCode = getIsoFromLocale(locale)
  const padding = usePaginationPadding()

  const indexName = `${envPrefix}_MAGAZINE_${isoCode}`
  const HITS_PER_PAGE = 12

  const resultsRef = useRef<HTMLDivElement>(null)

  return (
    <PaginationContextProvider defaultRef={resultsRef}>
      <Seo seoAndSome={seoAndSome} slug={slug} pageTitle={title} />
      <main>
        <SharedBanner title={title} hero={hero} hideImageCaption={true} />
        {pageData?.hero.type !== HeroTypes.DEFAULT && title && (
          <SharedTitle title={title} styles={{ backgroundColor: ingress.background, negativeBottomSpace: true }} />
        )}
        <BackgroundContainer background={ingress.background}>
          <Intro>
            {ingress && (
              <IngressWrapper>
                <UnpaddedText>{ingress && <MagazineIndexText value={ingress.content} />}</UnpaddedText>
              </IngressWrapper>
            )}
          </Intro>
        </BackgroundContainer>

        <InstantSearch
          searchClient={isServerRendered ? searchClientServer : searchClient}
          indexName={indexName}
          /* routing={{
              // @TODO If this is enabled, the app will freeze with browser back
              router: history({
                createURL({ qsModule, routeState, location }) {
                  const isIndexpageUrl = location.pathname.split('/').length === (locale === 'en' ? 2 : 3)

                  if (!isIndexpageUrl) {
                    // do not update router state when magazine pages are clicked..
                    return location.href
                  }

                  const queryParameters: any = {}
                  if (routeState.query) {
                    queryParameters.query = encodeURIComponent(routeState.query as string)
                  }
                  if (routeState.page !== 1) {
                    queryParameters.page = routeState.page
                  }
                  if (routeState.magazineTags) {
                    queryParameters.tag = encodeURIComponent(routeState.magazineTags as string)
                  }

                  const queryString = qsModule.stringify(queryParameters, {
                    addQueryPrefix: true,
                    arrayFormat: 'repeat',
                  })
                  const href = locale === 'en' ? `/magazine${queryString}` : `/no/magasin${queryString}`

                  return href
                },
                // eslint-disable-next-line
                // @ts-ignore: @TODO: The types are not correct
                parseURL({ qsModule, location }) {
                  const { query = '', page, tag = '' }: any = qsModule.parse(location.search.slice(1))
                  return {
                    query: decodeURIComponent(query),
                    page,
                    magazineTags: decodeURIComponent(tag),
                  }
                },
                getLocation() {
                  if (typeof window === 'undefined') {
                    return new URL(url!) as unknown as Location
                  }

                  return window.location
                },
              }),

              stateMapping: {
                // eslint-disable-next-line
                // @ts-ignore: @TODO: The types are not correct
                stateToRoute(uiState) {
                  const indexUiState = uiState[indexName] || {}
                  return {
                    query: indexUiState.query,
                    magazineTags: indexUiState.menu && indexUiState.menu.magazineTags,
                  }
                },
                // eslint-disable-next-line
                // @ts-ignore: @TODO: The types are not correct
                routeToState(routeState) {
                  return {
                    [indexName]: {
                      query: routeState.query,
                      menu: {
                        magazineTags: routeState.magazineTags,
                      },
                    },
                  }
                },
              },
            }}*/
        >
          <Configure facetingAfterDistinct maxFacetHits={50} maxValuesPerFacet={100} hitsPerPage={HITS_PER_PAGE} />
          {magazineTags && (
            <MagazineTagFilter
              tags={magazineTags}
              attribute="magazineTags"
              sortBy={[`name:asc`]}
              limit={5}
              ref={resultsRef}
            />
          )}
          <MagazineWapper>
            <StyledHits />
            <StyledPagination padding={padding} hitsPerPage={HITS_PER_PAGE} />
          </MagazineWapper>
        </InstantSearch>
        {footerComponent && <Teaser data={footerComponent} />}
      </main>
    </PaginationContextProvider>
  )
}
export default MagazineIndexPage
