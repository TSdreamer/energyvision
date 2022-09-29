import { isValidSignature, SIGNATURE_HEADER_NAME } from '@sanity/webhook'
import { groq } from 'next-sanity'
import getRawBody from 'raw-body'
import { sanityClient } from '../../lib/sanity.server'

const SANITY_API_TOKEN = process.env.SANITY_API_TOKEN || ''

// Next.js will by default parse the body, which can lead to invalid signatures
// https://nextjs.org/docs/api-routes/api-middlewares#custom-config
export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(req, res) {
  const signature = req.headers[SIGNATURE_HEADER_NAME]
  const body = (await getRawBody(req)).toString()

  if (!isValidSignature(body, signature, SANITY_API_TOKEN)) {
    console.log(req, 'Unauthorized request: Revalidate Endpoint')
    return res.status(401).json({ success: false, msg: 'Unauthorized!' })
  }
  const data = JSON.parse(body)
  try {
    // @TODO Remove 'unstable' after upgrading next to ^12.2.0
    if (data._type in ['page', 'landingPage', 'event']) {
      const routes = await sanityClient.fetch(
        groq`*[_type match "route_*" && content._ref == $id]{"slug": slug.current}`,
        { id: data._id },
      )
      // Revalidade every path that points to the modified document
      routes.map(async (route) => {
        await res.unstable_revalidate(route.slug)
        //console.log('Revalidated: ', route.slug)
      })
    } else {
      await res.unstable_revalidate(data.slug)
      //console.log('Revalidated: ', data.slug)
    }
    return res.json({ revalidated: true })
  } catch (err) {
    // If there was an error, Next.js will continue
    // to show the last successfully generated page
    console.log('Error revalidating: ', data.slug)
    return res.status(500).json({ revalidated: false })
    // return res.status(500).send('Error revalidating')
  }
}