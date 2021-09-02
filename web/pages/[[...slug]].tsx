/* eslint-disable @typescript-eslint/no-explicit-any */
import { GetStaticProps, GetStaticPaths } from 'next'
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import { sanityClient, getClient } from '../lib/sanity.server'
import { menuQuery } from '../lib/queries/menu'
import { groq } from 'next-sanity'
import getConfig from 'next/config'
import { NextSeo } from 'next-seo'
import { getQueryFromSlug } from '../lib/queryFromSlug'
import ErrorPage from 'next/error'
import dynamic from 'next/dynamic'
import { usePreviewSubscription } from '../lib/sanity'
import { Layout } from '@components'
import getOpenGraphImages from '../common/helpers/getOpenGraphImages'
import { mapLocaleToLang } from '../lib/localization'
import { Menu } from '../tempcomponents/shared/Menu'
import { useAppInsightsContext } from '@microsoft/applicationinsights-react-js'

const HomePage = dynamic(() => import('../tempcomponents/pageTemplates/Home'))
const TopicPage = dynamic(() => import('../tempcomponents/pageTemplates/TopicPage'))
const OldTopicPage = dynamic(() => import('../tempcomponents/pageTemplates/OldTopicPage'))
const { publicRuntimeConfig } = getConfig()

export default function Page({ data, preview }: any) {
  const appInsights = useAppInsightsContext()
  const router = useRouter()
  const slug = data?.pageData?.slug
  const { pathname } = useRouter()
  const { data: pageData } = usePreviewSubscription(data?.query, {
    params: data?.queryParams ?? {},
    initialData: data?.pageData,
    enabled: preview || router.query.preview !== null,
  })

  console.log(data?.docType)
  if (data?.docType === 'home') {
    return <HomePage />
  }

  if(data?.docType === 'old'){
    console.log("I am being called .. ")
    return <OldTopicPage data={pageData}/>
  }

  if (!router.isFallback && !slug && !data?.queryParams?.id) {
    return <ErrorPage statusCode={404} />
  }

  const fullUrlDyn = pathname.indexOf('http') === -1 ? `${publicRuntimeConfig.domain}${pathname}` : pathname
  const fullUrl = fullUrlDyn.replace('/[[...slug]]', slug)

  appInsights.trackPageView({ name: slug, uri: fullUrl })

  return (
    <>
      {router.isFallback ? (
        <p>Loading…</p>
      ) : (
        <>
          <NextSeo
            title={pageData?.seoAndSome?.documentTitle || pageData?.title}
            description={pageData?.seoAndSome?.metaDescription}
            openGraph={{
              title: pageData?.title,
              description: pageData?.seoAndSome?.metaDescription,
              type: 'website',
              url: fullUrl,
              /* @TODO: Add fallback image */
              images: getOpenGraphImages(pageData?.seoAndSome?.openGraphImage),
            }}
            twitter={{
              handle: '@handle',
              site: '@site',
              cardType: 'summary_large_image',
            }}
          ></NextSeo>

          {data?.docType === 'page' && <TopicPage data={pageData}/>}
        </>
      )}
    </>
  )
}

// eslint-disable-next-line react/display-name
Page.getLayout = (page: AppProps) => {
  /* The getLayout pattern is a way to preserve state in the layout
  across client side navigation. The downside is that since it's just an
  ordinary function, we can't use the preview subcscription hook out of the box.
  As a consequence, preview for the menu data is not available.

  If this is a problem, we need to see if we are able to find another solution  */

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const { props } = page

  const { data, preview } = props

  const slugs = {
    en_GB: data?.pageData?.allSlugs?.en_GB,
    nb_NO: data?.pageData?.allSlugs?.nb_NO,
  }
  return (
    <Layout preview={preview}>
      <Menu slugs={slugs} data={data?.menuData} />
      {page}
    </Layout>
  )
}

export const getStaticProps: GetStaticProps = async ({ params, preview = false, locale = 'en' }) => {
  const { query, queryParams, docType } = getQueryFromSlug(params?.slug as string[], locale)

  let pageData
  if(docType === 'old'){
    console.log("inside getStaticProps ")
    const pagePathArray = params?.slug as string[]
  const pagePath = pagePathArray.join('/')
  const archiveSeverURL = publicRuntimeConfig.archiveStorageURL
  /** Check if the required page is old archived AEM page or not
   * because AEM also has archived pages which has 'archive' the page path */
  
  const response = await fetch(`${archiveSeverURL}/${locale}/${pagePath}.json`)
  try {
    pageData = await response.json()
  } catch (err) {
    console.log('error', err)
    pageData = null
  }
  }
else
   pageData = query && (await getClient(preview).fetch(query, queryParams))
  // Let's do it simple stupid and iterate later on
  const menuData = await getClient(preview).fetch(menuQuery, { lang: mapLocaleToLang(locale) })

  // console.log('Menu data', menuData)
  // console.log('query:', query)
  // console.log('queryParams:', queryParams)
  // console.log('docType:', docType)
  // console.log('data', pageData)

  return {
    props: {
      preview,
      data: {
        query,
        queryParams,
        pageData,
        docType,
        menuData,
      },
    },
    revalidate: 1,
  }
}

export const getTopicRoutesForLocale = async (locale: string) => {
  const lang = mapLocaleToLang(locale)
  const data = await sanityClient.fetch(groq`*[_type == "route_" + $lang && defined(slug.current)][].slug.current`, {
    lang,
  })
  return data
}

export const getStaticPaths: GetStaticPaths = async ({ locales = [] }) => {
  const fetchPaths = locales.map(async (locale) => {
    const pages = await getTopicRoutesForLocale(locale)
    return pages.map((slug: string) => ({
      params: { slug: slug.split('/').filter((p) => p) },
      locale,
    }))
  })
  const paths = await Promise.all(fetchPaths)

  return {
    paths: paths.flat(),
    fallback: true,
  }
}
