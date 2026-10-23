const site = 'https://ananthareddy2468.github.io';
const requestedBase = process.env.SITE_BASE ?? '/Anantha-profile';
const base = requestedBase === '/' ? '/' : `/${requestedBase.replace(/^\/+|\/+$/g, '')}`;

export { base, site };
