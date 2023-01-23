import React from "react";

import { isDeepEqual } from "@/utils/global";

export function deepMemo<Props = unknown>(
  component: (props: Props) => JSX.Element
) {
  return React.memo(component, (oldProps, newProps) =>
    isDeepEqual(oldProps, newProps)
  );
}
