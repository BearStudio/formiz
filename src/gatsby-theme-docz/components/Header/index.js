/** @jsx jsx */
import {
  jsx, Box, Flex,
} from 'theme-ui';
import { useConfig, useCurrentDoc } from 'docz';
import 'bootstrap/dist/css/bootstrap.css';

import * as styles from 'gatsby-theme-docz/src/components/Header/styles';
import { Edit, Github } from 'gatsby-theme-docz/src/components/Icons';
import { Logo } from 'gatsby-theme-docz/src/components/Logo';

export const Header = () => {
  const config = useConfig();
  const { edit = true, ...doc } = useCurrentDoc();

  return (
    <div sx={styles.wrapper}>
      <div sx={styles.innerContainer}>
        <Logo />
        <Flex sx={{ paddingLeft: 3 }}>
          {config.repository && (
            <Box sx={{ mr: 2, flex: 'none' }}>
              <a
                href={config.repository}
                sx={styles.headerButton}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github size={15} />
              </a>
            </Box>
          )}
        </Flex>
        {edit && doc.link && (
          <a
            sx={styles.editButton}
            href={doc.link}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Edit width={14} />
            <Box sx={{ pl: 2 }}>Edit page</Box>
          </a>
        )}
      </div>
    </div>
  );
};
