import S from '@sanity/desk-tool/structure-builder'
import { FileIcon, TopicDocuments } from '../../../../icons'
import { HAS_NEWSROOM } from '../../datasetHelpers'
import { EmptyItem } from './EmptyItem'

const miscPages = [
  S.listItem()
    .title('404 - Page not found')
    .icon(FileIcon)
    .child(
      S.documentList()
        .id('pageNotFound')
        .title('404')
        .schemaType('pageNotFound')
        .filter('(_id match "*" + $id) && _type == $type')
        .params({
          id: 'pageNotFound',
          type: 'pageNotFound',
        })
        .menuItems([
          {
            title: 'Create new',
            intent: {
              type: 'create',
              params: {
                id: 'pageNotFound',
                type: 'pageNotFound',
                template: 'pageNotFound',
              },
            },
          },
        ]),
    ),
  S.listItem()
    .title('500 - Internal server error')
    .icon(FileIcon)
    .child(
      S.documentList()
        .id('internalServerError')
        .title('500')
        .schemaType('internalServerError')
        .filter('(_id match "*" + $id) && _type == $type')
        .params({
          id: 'internalServerError',
          type: 'internalServerError',
        })
        .menuItems([
          {
            title: 'Create new',
            intent: {
              type: 'create',
              params: {
                id: 'internalServerError',
                type: 'internalServerError',
                template: 'internalServerError',
              },
            },
          },
        ]),
    ),
  HAS_NEWSROOM
    ? S.listItem()
        .title('Newsroom')
        .icon(FileIcon)
        .child(
          S.documentList()
            .id('newsroom')
            .title('Newsroom')
            .schemaType('newsroom')
            .filter('(_id match "*" + $id) && _type == $type')
            .params({
              id: 'newsroom',
              type: 'newsroom',
            })
            .menuItems([
              {
                title: 'Create new',
                intent: {
                  type: 'create',
                  params: {
                    id: 'newsroom',
                    type: 'newsroom',
                    template: 'newsroom',
                  },
                },
              },
            ]),
        )
    : EmptyItem,
]

export const Misc = S.listItem()
  .title('Misc')
  .icon(TopicDocuments)
  .child(S.list('misc').id('misc').title('Misc').items(miscPages))
