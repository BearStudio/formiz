import { useColorMode } from '@chakra-ui/core';

export const useDarkTheme = () => {
  const { colorMode } = useColorMode();

  return colorMode === 'dark';
};
