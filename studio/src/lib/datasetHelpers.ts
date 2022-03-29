/* eslint-disable import/no-unresolved */
import client from 'part:@sanity/base/client'

export const dataset = client.clientConfig.dataset

/** @TODO Replicate logic inside GROQ queries for the web */
const GLOBAL = ['global', 'global-development']

const NEWS = [...GLOBAL, 'poland', 'argentina', 'brazil', 'germany', 'japan', 'southkorea']
const NEWS_SUBSCRIPTION = [...GLOBAL]
const LOCAL_NEWS = [...GLOBAL]
const SEARCH = [...GLOBAL]
const EVENT = [...GLOBAL]
const FORMS = [...GLOBAL]
const FANCY_MENU = [...GLOBAL]
/* LANDING_PAGE requires FANCY_MENU to work */
const LANDING_PAGE = [...GLOBAL]

export const HAS_NEWS = NEWS.includes(dataset)
export const HAS_NEWS_SUBSCRIPTION = NEWS_SUBSCRIPTION.includes(dataset)
export const HAS_LOCAL_NEWS = LOCAL_NEWS.includes(dataset)
export const HAS_SEARCH = SEARCH.includes(dataset)
export const HAS_EVENT = EVENT.includes(dataset)
export const HAS_FORMS = FORMS.includes(dataset)
export const HAS_FANCY_MENU = FANCY_MENU.includes(dataset)
export const HAS_LANDING_PAGE = HAS_FANCY_MENU && LANDING_PAGE.includes(dataset)