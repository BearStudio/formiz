import React from "react";

import { isDeepEqual } from "@/utils/global";

export const deepMemo = <Props extends unknown = unknown>(
  component: (props: Props) => JSX.Element
) =>
  React.memo(component, (oldProps, newProps) =>
    isDeepEqual(oldProps, newProps)
  ) as typeof component;
