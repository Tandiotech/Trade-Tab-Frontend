import { Helmet } from 'react-helmet-async';

const SITE_ORIGIN = 'https://www.tradetab.com';

const TITLE = 'TradeTab | Automated trading journal for MT4 & MT5';

const DESCRIPTION =
  'TradeTab is a free automated trading journal designed to enhance your trading edge and market performance. It seamlessly connects with Metatrader 4 and Metatrader 5 accounts in less than 60 seconds.';

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': `${SITE_ORIGIN}/#website`,
      url: SITE_ORIGIN,
      name: 'TradeTab',
      description: DESCRIPTION,
      publisher: { '@id': `${SITE_ORIGIN}/#organization` },
      inLanguage: 'en',
    },
    {
      '@type': 'Organization',
      '@id': `${SITE_ORIGIN}/#organization`,
      name: 'TradeTab',
      url: SITE_ORIGIN,
    },
  ],
};

export default function WelcomeHelmet() {
  return (
    <Helmet prioritizeSeoTags>
      <html lang='en' />
      <title>{TITLE}</title>
      <meta name='description' content={DESCRIPTION} />
      <link rel='canonical' href={SITE_ORIGIN} />

      <meta property='og:type' content='website' />
      <meta property='og:url' content={SITE_ORIGIN} />
      <meta property='og:title' content={TITLE} />
      <meta property='og:description' content={DESCRIPTION} />
      <meta property='og:locale' content='en_US' />

      <meta name='twitter:card' content='summary_large_image' />
      <meta name='twitter:title' content={TITLE} />
      <meta name='twitter:description' content={DESCRIPTION} />

      <script type='application/ld+json'>{JSON.stringify(jsonLd)}</script>
    </Helmet>
  );
}
