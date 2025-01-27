import { defaultLanguage, languages } from '../../languages'
import { TagIcon } from '../../icons'
import type { Rule } from 'sanity'

//takes every allowed language and makes a string field for each
const localeStrings = languages.map((lang) => ({
  name: lang.name,
  type: 'string',
  title: lang.title,
  validation: (Rule: Rule) => Rule.required(),
}))

const title = `title.${defaultLanguage.name}`

export default {
  type: 'document',
  name: 'eventTag',
  title: 'Event Tag',
  fields: [
    {
      type: 'object',
      name: 'title',
      title: 'Title',
      fields: localeStrings,
    },
    {
      title: 'Key',
      name: 'key',
      type: 'slug',
      description: "This is a data point, no need to alter it beyond 'generate'",
      validation: (Rule: Rule) => Rule.required(),

      options: {
        source: title,
        slugify: (input: string) => input.toLowerCase().replace(/\s+/g, '-'),
      },
    },
  ],
  orderings: [
    {
      title: 'Title descending',
      name: 'titleDesc',
      by: [{ field: title, direction: 'desc' }],
    },
    {
      title: 'Title ascending',
      name: 'titleDesc',
      by: [{ field: title, direction: 'asc' }],
    },
  ],

  preview: {
    select: {
      title: title,
    },
    prepare(selection: { title: string }) {
      const { title } = selection
      // For debugging purposes
      return {
        title: title,
        media: TagIcon,
      }
    },
  },
}
