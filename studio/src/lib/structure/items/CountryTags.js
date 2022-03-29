import S from '@sanity/desk-tool/structure-builder'
import { EdsIcon } from '../../../../icons'
import { tag_more } from '@equinor/eds-icons'
import { HAS_NEWS } from '../../datasetHelpers'
import { EmptyItem } from './EmptyItem'

export const CountryTags = HAS_NEWS
  ? S.listItem()
      .icon(() => EdsIcon(tag_more))
      .title('Country tags')
      .schemaType('countryTag')
      .child(S.documentTypeList('countryTag').title('Country tag'))
  : EmptyItem