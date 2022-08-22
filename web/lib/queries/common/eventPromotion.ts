export const eventPromotionFields = `
    "type": "events",
    "id": _id,
    "slug": slug.current,
    "title": content->title,
    "location": content->location,
    "eventDate": content->eventDate,
    `

/* Unable to pass end time along with the date to sort. So using hard coded timestamp*/
export const pastEventsQuery = `
    *[_type match "route_" + $lang + "*" 
    && content->_type == "event"  
    && content->eventDate.date < $date 
    && !(_id in path("drafts.**")) ]
    | order(dateTime(content->eventDate.date+"T00:00:00.00Z") desc)[0...50]`
