/* eslint-disable react/jsx-one-expression-per-line */

import React from 'react';
import classnames from 'classnames';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import withBaseUrl from '@docusaurus/withBaseUrl';
import styles from './styles.module.css';

const features = [
  {
    title: <>Easy form validation</>,
    description: (
      <>
        Create custom forms in React with full validation without the pain.
      </>
    ),
  },
  {
    title: <>No more logic duplication</>,
    description: (
      <>
        Don&apos;t duplicate your logicbetween display and validation.
        Validation is enabled only if the field is displayed.
      </>
    ),
  },
  {
    title: <>Multi steps forms</>,
    description: (
      <>
        Multi steps forms logic available out of the box!
        No more pain to build perfect UX for complexe forms.
      </>
    ),
  },
  {
    title: <>Custom fields with your own UX</>,
    description: (
      <>
        Turn everything into a form field with full validation!
      </>
    ),
  },
  {
    title: <>React hooks</>,
    description: (
      <>
        Use hooks &amp; cut the complexity to create custom fields :)
      </>
    ),
  },
];

function Home() {
  const context = useDocusaurusContext();
  const { siteConfig = {} } = context;
  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />"
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
          </div>
        </div>
      </header>
      <main>
        {features && features.length && (
          <section className={styles.features}>
            <div className="container">
              <h2 style={{ margin: '1em 0 2em 0', textAlign: 'center' }}>
                Why Formiz?
              </h2>
              <div className="row">
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
