export default function robots() {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://instantinvoice.vercel.app';

    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/api/', '/dashboard/preview/'],
            },
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}
