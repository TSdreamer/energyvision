import S from '@sanity/desk-tool/structure-builder'
// eslint-disable-next-line import/no-unresolved
import documentStore from 'part:@sanity/base/datastore/document'
import { map } from 'rxjs/operators'
import { TagIcon } from '../../icons'

export default function tagFilters() {
  return S.listItem().title('Filter files by tag').icon(TagIcon).child(tagFilterList)
}

const tagFilterList = () => {
  const documentName = 'assetFile'

  return () =>
    documentStore.listenQuery(`*[_type == "assetTag"]`).pipe(
      map((tags) =>
        S.list()
          .title('All tags')
          .items([
            ...tags.map((tag) =>
              S.listItem(`${tag._id}`)
                // Fix to avoid multiple list items with the same id
                .id(`${tag._id}`)
                .title(`${tag.title}`)
                .icon(TagIcon)
                .child(() =>
                  S.documentList()
                    .title(`Results for: ${tag.title}`)
                    .schemaType(documentName)
                    .filter(`_type == "${documentName}" && references($tagId)`)
                    .params({ tagId: tag._id })
                    .canHandleIntent(S.documentTypeList(documentName).getCanHandleIntent()),
                ),
            ),
          ]),
      ),
    )
}
