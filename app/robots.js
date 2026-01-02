export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/private/', // Block admin routes if you have any
    },
    sitemap: 'https://daplink.online/sitemap.xml',
  }
}