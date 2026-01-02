export default function sitemap() {
  const baseUrl = 'https://daplink.online';

  return [
    // 1. Home Page (Highest Priority)
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    
    // 2. Pricing Page
    {
      url: `${baseUrl}/Pricing`, // Must match your folder name exactly!
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },

    // 3. Products Page
    {
      url: `${baseUrl}/Products`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },

    // 4. Templates Page
    {
      url: `${baseUrl}/Templates`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },

    // 5. Login Page (Lower priority, but good for users finding the login button)
    {
      url: `${baseUrl}/login`, // Note: Your folder was lowercase "login" in the screenshot
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
  ];
}