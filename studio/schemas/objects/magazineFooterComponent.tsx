/* eslint-disable react/display-name */
import React from 'react'
import { configureBlockContent, configureTitleBlockContent } from '../editors'
import CharCounterEditor from '../components/CharCounterEditor'
import { RadioIconSelector } from '../components'
import { Colors } from '../../helpers/ColorListValues'
import blocksToText from '../../helpers/blocksToText'
import { LeftAlignedImage, RightAlignedImage } from '../../icons'
import CompactBlockEditor from '../components/CompactBlockEditor'
import { validateCharCounterEditor } from '../validations/validateCharCounterEditor'

import type { Rule, Block, Reference } from '@sanity/types'
import type { ImageWithAlt } from './imageWithAlt'
import type { ColorListValue } from 'sanity-plugin-color-list'
import type { LinkSelector } from './linkSelector'
import type { DownloadableFile } from './files'
import type { DownloadableImage } from './downloadableImage'

const titleContentType = configureTitleBlockContent()

const imageAlignmentOptions = [
  { value: 'left', icon: LeftAlignedImage },
  { value: 'right', icon: RightAlignedImage },
]

const blockContentType = configureBlockContent({
  h1: false,
  h2: false,
  h3: false,
  h4: false,
  internalLink: false,
  externalLink: false,
  attachment: false,
  lists: false,
})

export type Teaser = {
  _type: 'teaser'
  title?: Block[]
  text?: Block[]
  action?: (LinkSelector | DownloadableFile | DownloadableImage)[]
  image: ImageWithAlt
  imagePosition?: string
  background?: ColorListValue
}

export default {
  name: 'footerComponent',
  title: 'Footer component',
  description:
    'This component will display at the bottom of each magazine article as well as on the magazine landing page.',
  type: 'object',
  localize: true,
  fieldsets: [
    {
      name: 'link',
      title: 'Link',
      description: 'Select either an internal link or external URL.',
    },
    {
      name: 'design',
      title: 'Design options',
    },
  ],
  fields: [
    {
      name: 'title',
      type: 'array',
      inputComponent: CompactBlockEditor,
      of: [titleContentType],
    },
    {
      name: 'text',
      title: 'Text content',
      type: 'array',
      inputComponent: CharCounterEditor,
      of: [blockContentType],
      validation: (Rule: Rule) => Rule.custom((value: Block[]) => validateCharCounterEditor(value, 600)).warning(),
    },
    {
      name: 'action',
      title: 'Link/action',
      description: 'Select the link or downloadable file for the teaser',
      type: 'array',
      of: [
        { type: 'linkSelector', title: 'Link' },
        { type: 'downloadableImage', title: 'Downloadable image' },
        { type: 'downloadableFile', title: 'Downloadable file' },
      ],
      validation: (Rule: Rule) => Rule.max(1).error('Only one action is permitted'),
    },
    {
      name: 'image',
      title: 'Image',
      type: 'imageWithAlt',
      validation: (Rule: Rule) => Rule.required(),
    },
    {
      name: 'imagePosition',
      title: 'Image position',
      description: 'Select which side the image should be displayed at on larger screens.',
      type: 'string',
      fieldset: 'design',
      inputComponent: function ({ type, onChange, value }: { type: any; onChange: any; value: string }) {
        return (
          <RadioIconSelector
            name="imageAlignmentSelector"
            options={imageAlignmentOptions}
            defaultValue="left"
            currentValue={value}
            type={type}
            onChange={onChange}
          />
        )
      },
    },
    {
      title: 'Background',
      description: 'Pick a colour for the background. Default is white.',
      name: 'background',
      type: 'colorlist',
      options: {
        borderradius: {
          outer: '100%',
          inner: '100%',
        },
        tooltip: false,
        list: Colors,
      },
      fieldset: 'design',
      initialValue: Colors[0],
    },
  ],
  preview: {
    select: {
      title: 'title',
      image: 'image.asset',
    },
    prepare({ title, image }: { title: Block[]; image: Reference }) {
      const plainTitle = title ? blocksToText(title) : undefined

      return {
        title: plainTitle || 'Missing title!',
        subtitle: 'Teaser component',
        media: image,
      }
    },
  },
}
