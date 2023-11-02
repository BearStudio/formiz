module.exports = {
  title: 'Formiz v1',
  tagline:
    'React forms with ease! Composable, headless & with built-in multi steps',
  url: 'https://v1.formiz-react.com',
  baseUrl: '/',
  favicon: 'img/favicon.ico',
  organizationName: 'ivan-dalmet', // Usually your GitHub org/user name.
  projectName: 'formiz-v1', // Usually your repo name.
  themeConfig: {
    image: 'img/social.jpg',
    prism: {
      // eslint-disable-next-line global-require
      theme: require('prism-react-renderer/themes/nightOwl'),
    },
    navbar: {
      logo: {
        alt: 'Formiz',
        src: 'img/logo.svg',
      },
      items: [
        { to: 'docs/getting-started', label: 'Docs', position: 'left' },
        { to: 'docs/demos/wizard', label: 'Demos', position: 'left' },
        {
          href: 'https://github.com/ivan-dalmet/formiz',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      copyright:
        'Coded with ❤️ in Normandy by Ivan Dalmet - Logotype by David Endico - Documentation powered by Docusaurus (v2)',
    },
    googleAnalytics: {
      trackingID: 'UA-137797247-2',
    },
    algolia: {
      apiKey: '65e00a07bf4d341582d20602b7aa9f72',
      indexName: 'formiz-react',
    },
    announcementBar: {
      id: 'formiz_v2',
      content:
        'Formiz v2 is available! 🐜 <a rel="noopener noreferrer" href="https://formiz-react.com">The documentation is here!</a>.',
      backgroundColor: '#69B97E',
      textColor: '#000',
      isCloseable: false,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl:
            'https://github.com/ivan-dalmet/formiz/edit/master/documentation/',
        },
        // blog: {
        //   showReadingTime: true,
        //   editUrl:
        //     'https://github.com/facebook/docusaurus/edit/master/documentation/blog/',
        // },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
