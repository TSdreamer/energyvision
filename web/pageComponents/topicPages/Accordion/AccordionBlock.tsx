import { BackgroundContainer } from '@components'
import styled from 'styled-components'
import Image, { Ratios } from '../../shared/SanityImage'
import IngressText from '../../shared/portableText/IngressText'
import TitleText from '../../shared/portableText/TitleText'
import Accordion from './Accordion'

import type { AccordionData } from '../../../types/types'

export const StyledTextBlockWrapper = styled(BackgroundContainer)<{ id: string | undefined }>`
  ${({ id }) =>
    id && {
      scrollMarginTop: 'var(--topbar-height)',
    }}
`

const StyledTextBlock = styled.section`
  padding: var(--space-3xLarge) var(--layout-paddingHorizontal-large);
  max-width: var(--maxViewportWidth);
  margin-left: auto;
  margin-right: auto;
`

const StyledHeading = styled(TitleText)`
  padding: 0 0 var(--space-large) 0;
`
const Img = styled(Image)`
  border-radius: 50%;
`

const ImgContainer = styled.div`
  padding: 0 0 var(--space-large) 0;
  width: 200px;
`

type AccordionBlockProps = {
  data: AccordionData
  anchor?: string
}

const AccordionBlock = ({ data, anchor }: AccordionBlockProps) => {
  const { title, ingress, designOptions, accordion, id, image } = data
  const { background } = designOptions
  return (
    <StyledTextBlockWrapper background={background} id={anchor || data.anchor}>
      <StyledTextBlock>
        {image?.asset && (
          <ImgContainer>
            <Img image={image} maxWidth={200} aspectRatio={Ratios.ONE_TO_ONE} />
          </ImgContainer>
        )}
        {title && <StyledHeading value={title} />}
        {ingress && <IngressText value={ingress} />}
        {accordion && accordion.length > 0 && (
          <Accordion data={accordion} id={id} hasTitle={!!title} queryParamName={id} />
        )}
      </StyledTextBlock>
    </StyledTextBlockWrapper>
  )
}

export default AccordionBlock
