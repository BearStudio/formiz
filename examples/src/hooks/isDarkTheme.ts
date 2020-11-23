import { useColorMode } from '@chakra-ui/react';

export const useDarkTheme = () => {
  const { colorMode } = useColorMode();

  return colorMode === 'dark';
};
