import React, { forwardRef, ForwardRefRenderFunction, ReactNode } from 'react'
import NextLink from 'next/link'
import MuiLink from '@material-ui/core/Link'

interface NextLinkWithAnchorProps {
  href: string
  children: ReactNode
  as?: string
  className?: string
  passHref?: boolean
  replace?: boolean
  scroll?: boolean
  shallow?: boolean
}

const NextLinkWithAnchor: ForwardRefRenderFunction<
  HTMLAnchorElement,
  NextLinkWithAnchorProps
> = (
  { href, as, passHref, replace, scroll, shallow, className, children },
  ref,
) => (
  <NextLink
    href={href}
    as={as}
    passHref={passHref}
    replace={replace}
    scroll={scroll}
    shallow={shallow}
  >
    <a ref={ref} className={className}>
      {children}
    </a>
  </NextLink>
)

export interface LinkProps {
  href: string
  children: ReactNode
  as?: string
  passHref?: boolean
  replace?: boolean
  scroll?: boolean
  shallow?: boolean
  className?: string
  underline?: 'none' | 'always' | 'hover'
}

const Link: ForwardRefRenderFunction<HTMLAnchorElement, LinkProps> = (
  {
    href,
    children,
    as,
    passHref,
    replace,
    scroll,
    shallow,
    className,
    underline = 'none',
  },
  ref,
) => (
  <MuiLink
    underline={underline}
    component={forwardRef(NextLinkWithAnchor)}
    ref={ref}
    className={className}
    href={href}
    as={as}
    passHref={passHref}
    replace={replace}
    scroll={scroll}
    shallow={shallow}
  >
    {children}
  </MuiLink>
)

export default forwardRef(Link)
