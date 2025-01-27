import { CheckmarkCircleIcon } from '@sanity/icons'
import { useState } from 'react'
import { sanityClient } from '../sanity.client'
import { useToast } from '@sanity/ui'

const client = sanityClient.withConfig({
  apiVersion: '2023-01-01',
  projectId: process.env.SANITY_STUDIO_API_PROJECT_ID || 'h61q9gi9',
  token: process.env.SANITY_STUDIO_MUTATION_TOKEN,
})

const token = {
  _id: 'secrets.CrossDatasetDuplicator',
  _type: 'pluginSecrets',
  secrets: {
    bearerToken: process.env.SANITY_STUDIO_MUTATION_TOKEN,
  },
}

export const ResetCrossDatasetToken = () => {
  const [reseting, setReseting] = useState(false)
  const toast = useToast()
  const onHandle = async () => {
    setReseting(true)
    await client
      .createOrReplace(token)
      .then(() => {
        toast.push({
          status: 'success',
          title: 'Token successfully reset!',
        })
      })
      .catch(() => {
        toast.push({
          status: 'error',
          title: 'Token reset failed!',
        })
      })
      .finally(() => setReseting(false))
  }

  return {
    disabled: reseting,
    label: reseting ? 'Reseting token...' : 'Reset Cross Dataset Token',
    icon: CheckmarkCircleIcon,
    onHandle: onHandle,
  }
}
