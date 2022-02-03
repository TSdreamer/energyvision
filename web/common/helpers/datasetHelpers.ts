const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET

// What is the dataset name for global production site
const EQUINOR_COM_NAME = 'global'
const EQUINOR_COM_DEV = 'production' || 'global_development'

export const getDataset = () => dataset

export const isGlobal = dataset === EQUINOR_COM_NAME || dataset === EQUINOR_COM_DEV

export const hasNews = dataset === EQUINOR_COM_NAME || dataset === EQUINOR_COM_DEV || dataset === 'germany'

export const hasArchivedNews = dataset === EQUINOR_COM_NAME || dataset === EQUINOR_COM_DEV
