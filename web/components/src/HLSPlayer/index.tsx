/* eslint-disable import/no-named-as-default-member */
/* eslint-disable jsx-a11y/media-has-caption */
import { useRef, HTMLProps, useEffect, useState, useCallback } from 'react'
import Hls from 'hls.js'
import { Icon } from '@equinor/eds-core-react'
import { play_circle } from '@equinor/eds-icons'
import styled from 'styled-components'

type Props = Omit<HTMLProps<HTMLVideoElement>, 'src'> & {
  src: string
  playButton?: boolean
}

const Wrapper = styled.div`
  position: relative;
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
`

const StyledButton = styled.button`
  position: absolute;
  margin: auto;
  z-index: 1;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  background: none;
  border: none;
  cursor: pointer;
`

export const HLSPlayer: React.FC<Props> = ({
  src,
  controls = false,
  playButton = false,
  autoPlay = false,
  ...props
}) => {
  const videoRef = useRef<HTMLVideoElement>(null)

  const [showPlayButton, setShowPlayButton] = useState(playButton)
  const [showControls, setShowControls] = useState(controls)

  const handlePlayButton = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.play()
      setShowPlayButton(false)
      setShowControls(true)
    }
  }, [])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    if (Hls.isSupported()) {
      const hls = new Hls()
      hls.loadSource(src)
      hls.attachMedia(video)
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = src
    }

    return () => {
      if (video) {
        video.removeAttribute('src')
      }
    }
  }, [src])

  useEffect(() => {
    playButton && setShowControls(false)
  }, [playButton])

  if (playButton)
    return (
      <Wrapper>
        <video playsInline ref={videoRef} controls={showControls} {...props} />
        {showPlayButton && (
          <StyledButton onClick={handlePlayButton}>
            <Icon size={48} color="white" style={{ opacity: 0.8 }} data={play_circle} />
          </StyledButton>
        )}
      </Wrapper>
    )

  return <video playsInline ref={videoRef} controls={controls} autoPlay={autoPlay} {...props} />
}
