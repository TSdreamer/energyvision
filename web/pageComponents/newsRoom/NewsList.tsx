import styled from 'styled-components'
import Hit from './Hit'
import { Hits } from './Hits'
import { Heading } from '@components'
import { Pagination } from '../../pageComponents/search/Pagination'
import { FormattedMessage } from 'react-intl'

const StyledNewsList = styled.div`
  padding: 0 var(--space-large);
`

const StyledPagination = styled(Pagination)`
  padding-top: var(--space-medium);
`

const NewsList = ({ ...rest }) => {
  return (
    <StyledNewsList {...rest}>
      <Heading level="h2" size="lg">
        <FormattedMessage id="newsroom_newslist_header" defaultMessage="News" />
      </Heading>
      <Hits hitComponent={Hit} />
      <StyledPagination padding={1} hitsPerPage={20} />
    </StyledNewsList>
  )
}

export default NewsList