import styled, { css } from 'styled-components'
import type { CardData, PeopleCardData, EventCardData, PromotionType } from '../../types/types'
import NewsCard from '../cards/NewsCard'
import TopicPageCard from '../cards/TopicPageCard'
import PeopleCard from '../cards/PeopleCard/PeopleCard'
import EventsCard from '../cards/EventsCard'

const FlexibleWrapper = styled.div`
  --card-minWidth: 250px;
  --row-gap: 2rem;
  --column-gap: 1rem;
  @media (min-width: 1000px) {
    --card-minWidth: 340px;
  }

  padding: 0 var(--layout-paddingHorizontal-small);
  margin: var(--space-xLarge) auto 0 auto;
  max-width: var(--maxViewportWidth);
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, var(--card-minWidth)), 1fr));
  grid-row-gap: var(--row-gap);
  grid-column-gap: var(--column-gap);
`

const CardsWrapper = styled.div`
  width: 100%;
  max-width: calc(var(--card-maxWidth) * 3 + var(--space-large) * 2);
  padding: 0 var(--space-xxLarge);
  margin: auto;
  margin-top: var(--space-xLarge);
  display: flex;
  gap: var(--space-large);
  justify-content: center;
  align-content: center;
  flex-wrap: wrap;
  flex-direction: column;

  @media (min-width: 750px) {
    flex-direction: row;
  }
`

const CardStyle = css`
  min-width: var(--card-minWidth);
  max-width: var(--card-maxWidth);
  flex-basis: 0;
  flex-grow: 1;
`

const StyledNewsCard = styled(NewsCard)`
  ${CardStyle}
`
const StyledTopicPageCard = styled(TopicPageCard)`
  ${CardStyle}
`
const StyledPeopleCard = styled(PeopleCard)`
  ${CardStyle}
  /* Not the best approach, should be improved */
  --card-maxWidth: 300px;
`

type CardProps = CardData | PeopleCardData | EventCardData

const MultiplePromotions = ({
  data,
  variant,
  hasSectionTitle,
}: {
  data: CardData[] | PeopleCardData[] | EventCardData[]
  variant: PromotionType
  hasSectionTitle: boolean
}) => {
  const getCard = (data: CardProps) => {
    switch (data.type) {
      case 'news':
        return <StyledNewsCard data={data as CardData} key={data.id} />
      case 'topics':
        return <StyledTopicPageCard data={data as CardData} key={data.id} />
      case 'people':
        return <StyledPeopleCard data={data as PeopleCardData} hasSectionTitle={hasSectionTitle} key={data.id} />
      case 'events':
        return <EventsCard data={data as EventCardData} hasSectionTitle={hasSectionTitle} key={data.id} />
      default:
        return console.warn('Missing card type for ', data)
    }
  }
  return (
    <>
      {variant === 'promoteEvents' ? (
        <FlexibleWrapper>
          {data.map((item) => {
            return getCard(item)
          })}
        </FlexibleWrapper>
      ) : (
        <CardsWrapper>
          {data.map((item) => {
            return getCard(item)
          })}
        </CardsWrapper>
      )}
    </>
  )
}

export default MultiplePromotions
