/** @jsx jsx */
import { jsx } from 'theme-ui';
import { Link, useConfig } from 'docz';
import logo from './logo.svg';

import * as styles from './styles';

export const Logo = () => {
  const config = useConfig();
  return (
    <div sx={styles.logo}>
      <Link to="/" sx={styles.link}>
        <img src={logo} alt={config.title} />
      </Link>
      <div sx={styles.description}>
        {config.description}
      </div>
    </div>
  );
};
