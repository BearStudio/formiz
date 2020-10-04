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
        Multi steps form logic available out of the box!
        No more pain to build perfect UX for complex forms.
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
        Choose how to render validations, form buttons, and navigation
        between steps (wizard, tabs, other).
        It&apos;s your choice!
      </>
    ),
  },
  {
    title: <>📋 Turn everything into fields</>,
    description: (
      <>
        Turn everything into a custom field with full validation!
        Create forms in React with full validations without the pain.
      </>
    ),
  },
  {
    title: <>⚛️ Built with Typescript &amp; hooks</>,
    description: (
      <>
        Typescript give you nice types out of the box.
        Hooks cut the complexity to create custom fields.
        Use complex logic without even thinking of it.
      </>
    ),
  },
  {
    title: <>📱 React Native compatible</>,
    description: (
      <>
        You can use it with <a href="https://facebook.github.io/react-native/">React Native</a>.
        Just use the <code>as=&#123;View&#125;</code> property on
        {' '}
        <code>&lt;FormizStep&gt;</code>
        {' '}
        component to replace the
        {' '}
        <code>div</code>.
      </>
    ),
  },
];

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
            </div>
          </section>
        )}
      </main>
    </Layout>
  );
}

export default Home;
