import styles from "@/components/Home/index.module.css";
import Link from "next/link";

export const Home = () => (
  <div>
    <div className={styles.titleContainer}>
      <h1 className={styles.title}>Formiz</h1>
      <h2 className={styles.subtitle}>
        React forms with ease! Composable, headless & with built-in multi steps
      </h2>
      <div>
        <Link href="/getting-started">
          <button className={styles.button}>Get started </button>
        </Link>
        <Link href="https://formiz-examples.vercel.app">
          <button className={styles.button}>Examples</button>
        </Link>
      </div>
    </div>
    <div className={styles.featuresContainer}>
      <p className={styles.featuresTitle}>Why Formiz ?</p>
      <div className={styles.featuresGrid}>
        <FeatureBlock
          title="🧙‍ Built-in multi steps"
          description="Multi steps form logic available out of the box! No more pain to build perfect UX for complex forms."
        />
        <FeatureBlock
          title="✅ Composable validations"
          description="Don't duplicate your logic between display and validation. Validation is enabled only if the field is displayed."
        />
        <FeatureBlock
          title="💅 Headless, build your own UX!"
          description="Choose how to render validations, form buttons, and navigation between steps (wizard, tabs, other). It's your choice!"
        />
        <FeatureBlock
          title="📋 Turn everything into fields"
          description="Turn everything into a custom field with full validation! Create forms in React with full validations without the pain."
        />
        <FeatureBlock
          title="⚛️ Built with Typescript & hooks"
          description="Typescript give you nice types out of the box. Hooks cut the complexity to create custom fields. Use complex logic without even thinking of it."
        />
        <FeatureBlock
          title="📱 React Native compatible"
          description="You can use it with React Native. Just use the as={View} property on <FormizStep> component to replace the div."
        />
      </div>
    </div>
  </div>
);

const FeatureBlock = ({ title, description }) => {
  return (
    <div className={styles.feature}>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
};
