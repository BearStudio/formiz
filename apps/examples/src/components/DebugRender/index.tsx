import { useEffect, useRef } from 'react';

import { Code, CodeProps } from '@chakra-ui/react';

export const DebugRender: React.FC<CodeProps> = (props) => {
  const renderCountRef = useRef(0);

  useEffect(() => {
    renderCountRef.current = renderCountRef.current + 1;
  });

  return <Code {...props}>{renderCountRef.current}</Code>;
};
