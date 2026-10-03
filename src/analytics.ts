import { inject } from '@vercel/analytics'

// Vercel serves /_vercel/insights only on its own deployments. A local build or
// `vite preview` would 404 the script and trip the e2e console-error checks.
const host = location.hostname
if (host === 'valentorassa.com' || host.endsWith('.valentorassa.com') || host.endsWith('.vercel.app')) {
  inject()
}
