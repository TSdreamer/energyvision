import { publishDateTimeQuery } from './news'
import markDefs from './common/blockEditorMarks'
import linkSelectorFields from './common/actions/linkSelectorFields'
import downloadableFileFields from './common/actions/downloadableFileFields'
import downloadableImageFields from './common/actions/downloadableImageFields'

const allSlugsQuery = /* groq */ `
  "slugs": *[_type == 'localNews' && ^._id match _id + "*"] | order(_id asc)[0] {
    "allSlugs": *[_type == 'localNews' && _id match ^._id + "*"] {
       "slug": *[_type == 'localNews' && _id == ^._id][0].slug.current,
       "lang": _lang
    }
  }`

export const localNewsFields = /* groq */ `
  "id": _id,
  "updatedAt": _updatedAt,
  title,
  heroImage,
  "publishDateTime": ${publishDateTimeQuery},
  "slug": slug.current,
  ${allSlugsQuery},
  ingress[]{
    ...,
    ${markDefs},
  },
  "iframe": iframe{
    title,
    frameTitle,
    url,
    "designOptions": {
      "aspectRatio": coalesce(aspectRatio, '16:9'),
      height,
    },
  },
`

export const localNewsQuery = /* groq */ `
{
  "news": *[_type == "localNews" && slug.current == $slug] | order(${publishDateTimeQuery} desc)[0] {
    _id, //used for data filtering
    "slug": slug.current,
    "documentTitle": seo.documentTitle,
    "metaDescription": seo.metaDescription,
    "template": _type,
    openGraphImage,
    "localNewsTag": localNewsTag->{
      ...
    },
    "content": content[]{
      ...,
      _type == "pullQuote" => {
        "type": _type,
        "id": _key,
        author,
        authorTitle,
        image,
        quote,
        "designOptions": {
          "imagePosition": coalesce(imagePosition, 'right'),
        }
      },
      _type == "positionedInlineImage" => {
        ...,
        // For these images, we don't want crop and hotspot
        // because we don't know the aspect ratio
        "image": image{
          _type,
          "asset": asset,
          "alt": alt
        }
      },
      ${markDefs},
    },
    "relatedLinks": relatedLinks{
      title,
      heroImage,
      "links": links[]{
       ${linkSelectorFields},
       ${downloadableFileFields},
       ${downloadableImageFields},
    }
  },
    ${localNewsFields}
  },
}`

export const localNewsSlugsQuery = /* groq */ `
*[_type == "localNews" && defined(slug.current)][].slug.current
`