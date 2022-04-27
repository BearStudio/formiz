/* eslint-disable react/jsx-one-expression-per-line */

import React from 'react';
import classnames from 'classnames';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './styles.module.css';

const features = [
  {
    title: <>🧙‍ Built-in multi steps</>,
    description: (
      <>
        Multi steps form logic available out of the box! No more pain to build
        perfect UX for complex forms.
      </>
    ),
  },
  {
    title: <>✅ Composable validations</>,
    description: (
      <>
        Don&apos;t duplicate your logic between display and validation.
        Validation is enabled only if the field is displayed.
      </>
    ),
  },
  {
    title: <>💅 Headless, build your own UX!</>,
    description: (
      <>
        Choose how to render validations, form buttons, and navigation between
        steps (wizard, tabs, other). It&apos;s your choice!
      </>
    ),
  },
  {
    title: <>📋 Turn everything into fields</>,
    description: (
      <>
        Turn everything into a custom field with full validation! Create forms
        in React with full validations without the pain.
      </>
    ),
  },
  {
    title: <>⚛️ Built with Typescript &amp; hooks</>,
    description: (
      <>
        Typescript give you nice types out of the box. Hooks cut the complexity
        to create custom fields. Use complex logic without even thinking of it.
      </>
    ),
  },
  {
    title: <>📱 React Native compatible</>,
    description: (
      <>
        You can use it with{' '}
        <a href="https://facebook.github.io/react-native/">React Native</a>.
        Just use the <code>as=&#123;View&#125;</code> property on{' '}
        <code>&lt;FormizStep&gt;</code> component to replace the{' '}
        <code>div</code>.
      </>
    ),
  },
];

const BearStudio = () => (
  <div className="my-16 sm:my-24">
    <a
      href="https://www.bearstudio.fr/en"
      target="_blank"
      className="group relative block rounded-2xl rounded-lg overflow-hidden shadow-xl px-12 py-10"
      style={{ background: '#00404c', textDecoration: 'none' }}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 -mt-72 sm:-mt-32 md:mt-0"
      >
        <svg
          className="absolute inset-0 h-full w-full"
          preserveAspectRatio="xMidYMid slice"
          fill="none"
          viewBox="0 0 1463 360"
        >
          <path
            style={{ color: '#14677e', opacity: 0.2 }}
            fill="currentColor"
            d="M-82.673 72l1761.849 472.086-134.327 501.315-1761.85-472.086z"
          />
          <path
            style={{ color: '#00141d', opacity: 0.2 }}
            fill="currentColor"
            d="M-217.088 544.086L1544.761 72l134.327 501.316-1761.849 472.086z"
          />
        </svg>
      </div>
      <div className="relative">
        <div className="sm:text-center">
          <h2 className="text-2xl font-extrabold text-white tracking-tight sm:text-3xl">
            <span
              className="group-hover:underline group-focus:underline"
              style={{ color: '#ffc10e' }}
            >
              BearStudio
            </span>{' '}
            supports the development of Formiz
          </h2>
          <p className="mt-4 mb-0 mx-auto max-w-2xl text-lg text-white">
            <span className="group-hover:underline group-focus:underline">
              BearStudio
            </span>{' '}
            is a french agency that supports project holders in their digital
            development process, with a team and/or CTO for rent.
          </p>
          <span
            class="inline-flex items-center justify-center mt-4 px-4 py-2 border border-transparent text-base font-medium rounded-md"
            style={{ background: '#ffc10e', color: '#00404c' }}
          >
            Visit BearStudio Website
            <svg
              class="-mr-1 ml-3 h-5 w-"
              style={{ color: '#00404c' }}
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
              <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
            </svg>
          </span>
        </div>
      </div>
    </a>
  </div>
);

function Home() {
  const context = useDocusaurusContext();
  const { siteConfig = {} } = context;
  return (
    <Layout
      title={`${siteConfig.title} | React multi steps forms`}
      description="Create custom multi steps forms with full validation without the pain."
    >
      <header className={classnames('hero hero--primary', styles.heroBanner)}>
        <div className="container">
          <h1 className="hero__title">{siteConfig.title}</h1>
          <p className="hero__subtitle">{siteConfig.tagline}</p>
          <div className={styles.buttons}>
            <Link
              className={classnames(
                'button button--secondary button--lg',
                styles.getStarted,
              )}
              to={useBaseUrl('docs/getting-started')}
            >
              Get Started
            </Link>
            <Link
              className={classnames(
                'button button--secondary button--lg',
                styles.getStarted,
              )}
              to={useBaseUrl('docs/demos/wizard')}
            >
              Demos
            </Link>
          </div>
          <Link
            className={classnames(
              'button button--link button--md text-white underline transition duration-700 ease-in-out hover:no-underline hover:text-green-100',
              styles.getStarted,
            )}
            to={useBaseUrl('https://github.com/ivan-dalmet/formiz/issues/116')}
          >
            Formiz v2 is under construction !
          </Link>
        </div>
      </header>
      <main>
        {features && features.length && (
          <section className={styles.features}>
            <div className="container" style={{ maxWidth: '60rem' }}>
              <h2 style={{ margin: '1em 0 2em 0', textAlign: 'center' }}>
                Why Formiz?
              </h2>
              <div className="row" style={{ justifyContent: 'center' }}>
                {features.map(({ title, description }, idx) => (
                  <div
                    key={idx} // eslint-disable-line react/no-array-index-key
                    className={classnames('col col--4', styles.feature)}
                  >
                    <h3>{title}</h3>
                    <p>{description}</p>
                  </div>
                ))}
              </div>
              <BearStudio />
            </div>
          </section>
        )}
      </main>
    </Layout>
  );
}

export default Home;
