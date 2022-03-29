//import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'
import styled from 'styled-components'
import { InstantSearch, Configure } from 'react-instantsearch-hooks'
import { isGlobalProduction } from '../../common/helpers/datasetHelpers'
//import { blocksToText } from '../../common/helpers'
//import getOpenGraphImages from '../../common/helpers/getOpenGraphImages'
//import { getFullUrl } from '../../common/helpers/getFullUrl'
import { Text, Heading } from '@components'
import { searchClientServer, searchClient } from '../../lib/algolia'
import NewsContent from '../newsRoom/NewsContent'
import { getIsoFromLocale } from '../../lib/localization'

const Wrapper = styled.div`
  max-width: var(--maxViewportWidth);
  margin: 0 auto;
  grid-template-areas:
    '. intro'
    '. .'
    'news news';
  grid-template-rows: auto var(--space-large) auto;
  grid-template-columns: var(--space-large) auto;
  display: grid;
  /* Yup, in an ideal world we might have used some clamp based paddings here to avoid MQ, but the smallest
  one is way too big. Might create some fluid spacings later on   */
  @media (min-width: 800px) {
    grid-template-areas:
      '. . .'
      '. intro .'
      '. . .'
      '.  news news';
    grid-template-rows: var(--space-xxLarge) auto var(--space-3xLarge) auto;
    grid-template-columns: var(--layout-paddingHorizontal-small) minmax(auto, var(--layout-maxContent-narrow)) auto;
  }
`

const Intro = styled.div`
  grid-area: intro;
  margin: 0 auto;
`

const News = styled.div`
  grid-area: news;
`

const UnpaddedText = styled.div`
  & p:only-child {
    margin-bottom: 0;
  }
`

type NewsRoomTemplateProps = {
  isServerRendered?: boolean
  locale: string
}

const NewsRoomPage = ({ isServerRendered = false, locale }: NewsRoomTemplateProps) => {
  // @TODO Add seo and some #947
  //const { documentTitle, metaDescription, openGraphImage } = data.seoAndSome
  // const plainTitle = title ? blocksToText(title) : ''
  //const { pathname } = useRouter()
  //const fullUrl = getFullUrl(pathname, slug)

  const envPrefix = isGlobalProduction ? 'prod' : 'dev'
  const isoCode = getIsoFromLocale(locale)

  const indexName = `${envPrefix}_NEWS_${isoCode}`
  return (
    <>
      <NextSeo
      //  title={documentTitle || plainTitle}
      //  description={metaDescription}
      //   openGraph={{
      //     title: plainTitle,
      //     description: metaDescription,
      //     type: 'website',
      //     url: fullUrl,
      //     images: openGraphImage?.asset && getOpenGraphImages(openGraphImage),
      //   }}
      />
      <main>
        <Wrapper>
          <Intro>
            <Heading size="2xl" level="h1">
              Newsroom
            </Heading>
            <UnpaddedText>
              <Text>
                We’re Equinor, a broad energy company with more than 20,000 colleagues committed to developing oil, gas,
                wind and solar energy in more than 30 countries worldwide. We’re dedicated to safety, equality and
                sustainability.
              </Text>
            </UnpaddedText>
          </Intro>
          <News>
            <InstantSearch
              searchClient={isServerRendered ? searchClientServer : searchClient}
              indexName={indexName}
              /*  routing={{
                  router: history({
                    getLocation() {
                      if (typeof window === 'undefined') {
                        return new URL(url!) as unknown as Location
                      }

                      return window.location
                    },
                  }),
                }} */
            >
              <Configure facetingAfterDistinct />
              <NewsContent />
            </InstantSearch>
          </News>
        </Wrapper>
      </main>
    </>
  )
}

export default NewsRoomPage
