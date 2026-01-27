/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: process.env.SITE_URL || 'https://instantinvoice.ng',
    generateRobotsTxt: true,
    generateIndexSitemap: false,
    exclude: ['/api/*', '/dashboard/preview/*'],
    robotsTxtOptions: {
        policies: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/api/', '/dashboard/preview/'],
            },
        ],
    },
    transform: async (config, path) => {
        // Set priority and change frequency based on path
        let priority = 0.7;
        let changefreq = 'weekly';

        if (path === '/') {
            priority = 1.0;
            changefreq = 'daily';
        } else if (path === '/dashboard') {
            priority = 0.9;
            changefreq = 'daily';
        } else if (path.includes('/dashboard/new')) {
            priority = 0.8;
            changefreq = 'daily';
        } else if (path.includes('/dashboard/settings')) {
            priority = 0.6;
            changefreq = 'monthly';
        } else if (path.includes('/onboarding')) {
            priority = 0.8;
            changefreq = 'monthly';
        }

        return {
            loc: path,
            changefreq,
            priority,
            lastmod: new Date().toISOString(),
        };
    },
};
