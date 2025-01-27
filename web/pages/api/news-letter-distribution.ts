import { distribute } from './subscription'
import { languages } from '../../languages'
import { NewsDistributionParameters } from '../../types/types'
import { NextApiRequest, NextApiResponse } from 'next'
import { isValidSignature, SIGNATURE_HEADER_NAME } from '@sanity/webhook'
import getRawBody from 'raw-body'
import getConfig from 'next/config'

const SANITY_API_TOKEN = process.env.SANITY_API_TOKEN || ''

// Next.js will by default parse the body, which can lead to invalid signatures
// https://nextjs.org/docs/api-routes/api-middlewares#custom-config
export const config = {
  api: {
    bodyParser: false,
  },
}

const logRequest = (req: NextApiRequest, title: string) => {
  console.log('\n')
  console.log(title)
  console.log('Datetime: ' + new Date())
  console.log('Headers:\n', req.headers)
  console.log('Body:\n', req.body)
  console.log('\n')
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('Sending newsletter...  ')
  console.log('Datetime: ' + new Date())
  const signature = req.headers[SIGNATURE_HEADER_NAME] as string
  const body = (await getRawBody(req)).toString()

  if (!isValidSignature(body, signature, SANITY_API_TOKEN)) {
    logRequest(req, 'Unauthorized request: Newsletter Distribution Endpoint')
    return res.status(401).json({ success: false, msg: 'Unauthorized!' })
  }

  const { publicRuntimeConfig } = getConfig()
  const data = JSON.parse(body)
  const locale = languages.find((lang) => lang.name == data.languageCode)?.locale || 'en'
  const newsDistributionParameters: NewsDistributionParameters = {
    timeStamp: data.timeStamp,
    title: data.title,
    ingress: data.ingress,
    link: `${publicRuntimeConfig.domain}/${locale}${data.link}`,
    newsType: data.newsType,
    languageCode: locale,
  }

  console.log('Newsletter link: ', newsDistributionParameters.link)

  await distribute(newsDistributionParameters).then((isSuccessful) => {
    if (!isSuccessful) {
      console.log('Newsletter distribution failed!')
      return res.status(400).json({ msg: `Distribution failed ${newsDistributionParameters.link}` })
    }
    console.log('Newsletter sent successfully!')
    res.status(200).json({ msg: `Successfully distributed ${newsDistributionParameters.link}` })
  })
}
