import React from 'react'

type Props = {
  children: React.ReactNode
}

export const ExternalLinkRenderer = ({ children }: Props) => <span>{children}</span>

export const SubScriptRenderer = ({ children }: Props) => <sub>{children}</sub>

export const SuperScriptRenderer = ({ children }: Props) => <sup>{children}</sup>

export const StrikeThroughRenderer = ({ children }: Props) => <s>{children}</s>
