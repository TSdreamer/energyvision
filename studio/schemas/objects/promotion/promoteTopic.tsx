import React from 'react'
import { configureBlockContent } from '../../editors/blockContentType'
import CharCounterEditor from '../../components/CharCounterEditor'
import blocksToText from '../../../helpers/blocksToText'
import { validateCharCounterEditor } from '../../validations/validateCharCounterEditor'

import type { Block, Rule, Image, Reference } from '@sanity/types'
import routes from '../../routes'
import { topicPromotionFilter } from '../../../helpers/referenceFilters'
import { Flags } from '../../../src/lib/datasetHelpers'
import { HeroTypes } from '../../HeroTypes'

const introBlockContentType = configureBlockContent({
  h1: false,
  h2: false,
  h3: false,
  h4: false,
  internalLink: false,
  externalLink: false,
  attachment: false,
  lists: false,
})

type PromotedTopicPage = {
  _key: string
  _type: 'topics'
  ingress: Block[]
  reference: Reference
}

export type TopicPromotion = {
  _type: 'promoteTopics'
  references: PromotedTopicPage[]
}

export default {
  title: 'Topic/magazine promotion',
  name: 'promoteTopics',
  type: 'object',

  fields: [
    {
      name: 'references',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'topics',
          title: 'Pages',
          fields: [
            {
              title: 'Page to be promoted',
              name: 'reference',
              description: 'Select the page you want to promote',
              type: 'reference',
              to: [...routes, Flags.HAS_MAGAZINE && { type: 'magazine' }].filter((e) => e),
              options: {
                filter: topicPromotionFilter,
                disableNew: true,
              },
            },
            {
              name: 'ingress',
              title: 'Ingress',
              description: 'A short and catchy introduction text for this topic content card (max. 215 chars)',
              type: 'array',
              inputComponent: CharCounterEditor,
              of: [introBlockContentType],
              validation: (Rule: Rule) => Rule.custom((value: any) => validateCharCounterEditor(value, 215)),
            },
          ],
          preview: {
            select: {
              topicTitle: 'reference.content.title',
              topicMedia: 'reference.content.heroFigure.image',
              topicVideo: 'reference.content.heroLoopingVideo.thumbnail',
              topicHeroType: 'reference.content.heroType',
              magazineTitle: 'reference.title',
              magazineMedia: 'reference.heroFigure.image',
              magazineVideo: 'reference.heroLoopingVideo.thumbnail',
              magazineHeroType: 'reference.heroType',
            },
            prepare({
              topicTitle,
              topicMedia,
              topicVideo,
              topicHeroType,
              magazineTitle,
              magazineMedia,
              magazineVideo,
              magazineHeroType,
            }: {
              topicTitle: Block[]
              topicMedia: Image
              topicVideo: Image
              topicHeroType: HeroTypes
              magazineTitle: Block[]
              magazineMedia: Image
              magazineVideo: Image
              magazineHeroType: HeroTypes
            }) {
              const title = topicTitle || magazineTitle || ''
              const plainTitle = title ? blocksToText(title) : ''
              const isVideo = topicHeroType === HeroTypes.LOOPING_VIDEO || magazineHeroType === HeroTypes.LOOPING_VIDEO

              return {
                title: plainTitle,
                media: isVideo ? topicVideo || magazineVideo : topicMedia || magazineMedia,
              }
            },
          },
        },
      ],
      validation: (Rule: Rule) => Rule.unique(),
    },
  ],
  preview: {
    select: {
      references: 'references',
      // Annoyingly, the select lines below are needed to resolve the references in the references object above
      reference1: 'references.0.reference.content.title',
      reference2: 'references.1.reference.content.title',
      reference3: 'references.2.reference.content.title',
      magazineRef1: 'references.0.reference.title',
      magazineRef2: 'references.1.reference.title',
      magazineRef3: 'references.2.reference.title',
    },
    prepare({ references }: { references: any[] }) {
      const titles = Object.entries(references)
        .map((reference) => {
          if (reference[1]?.reference) {
            const ref = reference[1].reference
            if (ref?.title) {
              return blocksToText(ref.title)
            }

            if (ref?.content?.title) {
              return blocksToText(ref.content.title)
            }
          }
        })
        .filter(Boolean)
      return {
        title: titles.join(', '),
        subtitle: `Topic promotions.`,
      }
    },
  },
}
