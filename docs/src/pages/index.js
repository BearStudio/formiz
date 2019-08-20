/* eslint-disable react/jsx-one-expression-per-line */

import React from 'react';
import classnames from 'classnames';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import withBaseUrl from '@docusaurus/withBaseUrl';
import styles from './styles.module.css';
import { Alpha } from '../messages';

const features = [
  {
    title: <>🧙‍ Multi steps forms</>,
    description: (
      <>
        Multi steps forms logic available out of the box!
        No more pain to build perfect UX for complexe forms.
      </>
    ),
  },
  {
    title: <>✅ Easy form validation</>,
    description: (
      <>
        Create forms in React with full validation without the pain.
        Turn everything into a custom field with full validation!
      </>
    ),
  },
  {
    title: <>🐛 No more logic duplication</>,
    description: (
      <>
        Don&apos;t duplicate your logic between display and validation.
        Validation is enabled only if the field is displayed.
      </>
    ),
  },
  {
    title: <>💅 Forms with your own UX</>,
    description: (
      <>
        Choose how to render validations, form buttons
        and navigation between setps (wizard, tabs, other).
        It&apos;s your choice!
      </>
    ),
  },
  {
    title: <>⚛️ Built with hooks</>,
    description: (
      <>
        Use hooks &amp; cut the complexity to create custom fields :)
        Use complexe logic without even thinking of it.
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
      description="Create custom multi steps forms with full validations without the pain."
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
              to={withBaseUrl('docs/getting-started')}
            >
              Get Started
            </Link>
            <Link
              className={classnames(
                'button button--lg',
                styles.getStarted,
              )}
              to={withBaseUrl('docs/demos/wizard')}
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
              <Alpha />
              <h2 style={{ margin: '1em 0 2em 0', textAlign: 'center' }}>
                Why Formiz?
              </h2>
              <div className="row" style={{ justifyContent: 'center' }}>
                {features.map(({ imageUrl, title, description }, idx) => (
                  <div
                    key={idx} // eslint-disable-line react/no-array-index-key
                    className={classnames('col col--4', styles.feature)}
                  >
                    {imageUrl && (
                      <div className="text--center">
                        <img
                          className={styles.featureImage}
                          src={withBaseUrl(imageUrl)}
                          alt={title}
                        />
                      </div>
                    )}
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
