import React, { forwardRef } from 'react'
import { Dialog } from '@sanity/ui'
import styled from 'styled-components'

export const Content = styled.div`
  margin: 2em;
`

export const StyledIframe = styled.iframe`
  display: block;
  width: 100%;
  height: 100%;
  min-height: 80vh;
  border: none;
`

export const LoadingContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  grid-gap: 1rem;
`

/**
 * Yes, the z-index value is ridiculous.
 * Yes, the important! is annoying.
 * Unfortunately, it's the only way to override the default styling and get the desired result.
 */
export const FullScreenDialog = styled(Dialog)`
  position: fixed !important;
  padding: 2rem;
  background: rgba(0, 0, 0, 0.6);
  z-index: 99999999 !important;
`

type ErrorMessageProps = {
  onClose: any
  ref: any
  children?: React.ReactNode
}

export const ErrorMessage = forwardRef<HTMLDivElement, ErrorMessageProps>((props, ref) => {
  const { onClose, children } = props

  return (
    <Dialog id="fotowareAssetSource" header="Error loading Fotoware plugin" onClose={onClose} ref={ref}>
      <Content>{children}</Content>
    </Dialog>
  )
})

type FotowareWidgetProps = {
  onClose: any
  url: string
  iframeRef: any
}

export const FotowareWidget = forwardRef<HTMLDivElement, FotowareWidgetProps>((props, ref) => {
  const { url, onClose, iframeRef } = props

  return (
    <FullScreenDialog
      width={1000}
      id="fotowareAssetSource"
      header="Select image from Fotoware"
      onClose={onClose}
      ref={ref}
    >
      <Content>
        <StyledIframe src={url} title="Fotoware" frameBorder="0" ref={iframeRef}></StyledIframe>
      </Content>
    </FullScreenDialog>
  )
})
