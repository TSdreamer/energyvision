import * as E from 'fp-ts/lib/Either'
import * as TE from 'fp-ts/lib/TaskEither'
import { pipe } from 'fp-ts/lib/function'
import { SanityClient } from '@sanity/client'
import { Language } from '../../common'

const publishDateTimeQuery = /* groq */ `
  select(
    customPublicationDate == true =>
      publishDateTime,
      coalesce(firstPublishedAt, _createdAt)
  )
`

export const query = /* groq */ `*[_type == "localNews" && _lang == $lang && !(_id in path("drafts.**")) && excludeFromSearch != true] {
  "slug": slug.current,
  _id,
  "title": title,
  "ingress": ingress,
  "type": _type,
  "publishDateTime": ${publishDateTimeQuery},
  "localNewsTag": localNewsTag->[$lang],
  "blocks": content[_type == "block"] {
    "blockKey": _key,
    "children": children[text match "*"] {
      "childKey": _key,
      "text": text
    }
  },
}
`

const getQueryParams = (language: Language) => ({
  lang: language.internalCode,
})

export type LocalNewsArticle = {
  slug: string
  title: string
  ingress: string
  // ISO 8601
  publishDateTime?: string
  localNewsTag: string
  blocks: {
    blockKey: string
    children: {
      childKey: string
      text: string
    }[]
  }[]
  _id: string
}

type FetchDataType = (
  query: string,
) => (
  getQueryparams: (language: Language) => Readonly<Record<string, string>>,
) => (language: Language) => (sanityClient: SanityClient) => TE.TaskEither<Error, LocalNewsArticle[]>

const fetch: FetchDataType = (query) => (getQueryParams) => (language) => (sanityClient) =>
  pipe(TE.tryCatch(() => sanityClient.fetch(query, getQueryParams(language)), E.toError))

export const fetchData = fetch(query)(getQueryParams)