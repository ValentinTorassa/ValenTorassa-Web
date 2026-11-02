import { bioRefs } from './linksContent'

/**
 * Web Analytics has no host dimension, so the links page's "/" on its own host
 * (docs/links-domain.md) would count as the home page. Report it as /links and
 * /en/links instead, with the bio tag as utm_source so the dashboard can split
 * visits by network. Unknown tags and any other query data are dropped.
 */
export function linksAnalyticsUrl(url: string): string {
  const source = new URL(url)
  const path = source.pathname.replace(/\/+$/, '')
  const page = path === '' ? '/links' : path === '/en' ? '/en/links' : source.pathname
  const target = new URL(page, source.origin)
  for (const [key, value] of source.searchParams) {
    if (key.startsWith('utm_')) target.searchParams.set(key, value)
  }
  const ref = source.searchParams.get('ref')?.toLowerCase()
  if (ref && !target.searchParams.has('utm_source') && (bioRefs as readonly string[]).includes(ref)) {
    target.searchParams.set('utm_source', ref)
  }
  return target.toString()
}
