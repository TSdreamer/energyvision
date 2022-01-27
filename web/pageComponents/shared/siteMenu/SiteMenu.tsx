import { useEffect, useCallback, useState } from 'react'
import styled from 'styled-components'
import { useRouter } from 'next/router'
import { useWindowSize } from '@reach/window-size'
import { RemoveScroll } from 'react-remove-scroll'
import FocusLock from 'react-focus-lock'
import NextLink from 'next/link'
import { Menu, MenuButton, Link } from '@components'
import { MenuGroup } from './MenuGroup'
import { TopbarDropdown } from './TopbarDropdown'
import { MenuContainer } from './MenuContainer'
import { NavTopbar } from './NavTopbar'
import { useCompare } from './hooks/useCompare'

import { LogoLink } from '../LogoLink'

import type { MenuData, SubMenuData } from '../../../types/types'

const AllSitesLink = styled(Link)`
  text-decoration: none;
  @media (max-width: 699px) {
    width: 100%;
    margin: var(--space-small) 0 0 0;
  }
  @media (min-width: 700px) and (max-width: 1299px) {
    margin: var(--space-small) 0 0 var(--menu-paddingHorizontal);
    width: var(--minViewportWidth);
  }
  @media (max-width: 1299px) {
    &:hover {
      background-color: var(--grey-10);
    }
    padding: calc(var(--space-small) + var(--space-xSmall)) 0;
    color: var(--grey-80);
  }
  @media (min-width: 1300px) {
    display: inline-flex;
    border-left: 2px solid var(--white-100);
    padding: var(--space-large) var(--space-large);
  }
`

export type MenuProps = {
  data?: MenuData
}

const SiteMenu = ({ data, ...rest }: MenuProps) => {
  const router = useRouter()
  const { width } = useWindowSize()
  const [isOpen, setIsOpen] = useState(false)
  const [indices, setIndices] = useState<number[]>([])
  const hasWidthChanged = useCompare(width)
  const DESKTOP_MIN_WIDTH = 1300

  const handleRouteChange = useCallback(() => {
    setIsOpen(false)
    //setIndices([])
  }, [])
  const menuItems = (data && data.subMenus) || []

  useEffect(() => {
    router.events.on('routeChangeComplete', handleRouteChange)
    return () => router.events.off('routeChangeComplete', handleRouteChange)
  }, [router.events, handleRouteChange])

  useEffect(() => {
    /* This code is to solve the issue where somebody open multiple menu items on a smaller
  device and then resize their window size to above the breakpoint for the desktop
  version where only one items is allowed */
    if (hasWidthChanged) {
      if (width >= DESKTOP_MIN_WIDTH && indices.length > 1) setIndices([])
    }
  }, [width, indices.length, hasWidthChanged])

  function onMenuButtonClick() {
    setIsOpen(!isOpen)
  }

  function toggleItem(toggledIndex: number) {
    // @TODO Mobile or desktop first
    if (width && width >= DESKTOP_MIN_WIDTH) {
      // This menu item is  open, so let's close the menu by removing it from the list
      if (indices[0] === toggledIndex) {
        return setIndices([])
      }
      // Otherwise let's swap the current one with the new
      setIndices([toggledIndex])
    } else {
      // Small devices version
      if (indices.includes(toggledIndex)) {
        // This menu item is already open, so let's close it by removing it from the list
        const expandedItems = indices.filter((currentIndex) => currentIndex !== toggledIndex)
        return setIndices(expandedItems)
      }
      // Otherwise add it to the list
      setIndices([...indices, toggledIndex])
    }
  }

  return (
    <>
      <MenuButton title="Menu" aria-expanded={isOpen} onClick={onMenuButtonClick} {...rest} />
      <FocusLock disabled={!isOpen} returnFocus>
        <RemoveScroll enabled={isOpen}>
          <TopbarDropdown isOpen={isOpen} className={RemoveScroll.classNames.zeroRight}>
            <nav>
              <NavTopbar>
                <LogoLink />
                {/*  @TODO: Translations of string */}
                <MenuButton title="Menu" aria-expanded={true} expanded onClick={() => setIsOpen(false)}></MenuButton>
              </NavTopbar>
              <MenuContainer>
                <Menu index={indices} onChange={toggleItem}>
                  {menuItems.map((topLevelItem: SubMenuData, idx) => {
                    return <MenuGroup key={topLevelItem.id} index={idx} topLevelItem={topLevelItem} />
                  })}
                </Menu>
                <NextLink href="/" passHref>
                  {/* @TODO Language strings */}
                  <AllSitesLink>All sites</AllSitesLink>
                </NextLink>
              </MenuContainer>
            </nav>
          </TopbarDropdown>
        </RemoveScroll>
      </FocusLock>
    </>
  )
}
export default SiteMenu
