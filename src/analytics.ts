import { inject } from '@vercel/analytics'
import { linksAnalyticsUrl } from './linksAnalytics'
import { LINKS_ORIGIN } from './siteContent'

// Vercel serves /_vercel/insights only on its own deployments. A local build or
// `vite preview` would 404 the script and trip the e2e console-error checks.
const host = location.hostname
if (host === new URL(LINKS_ORIGIN).hostname) {
  // The links page has its own host; linksAnalytics.ts says how it is reported.
  inject({ beforeSend: (event) => ({ ...event, url: linksAnalyticsUrl(event.url) }) })
} else if (host === 'valentorassa.com' || host.endsWith('.valentorassa.com') || host.endsWith('.vercel.app')) {
  inject()
}
