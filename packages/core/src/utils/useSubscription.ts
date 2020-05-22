import { useLayoutEffect, useRef } from 'react';
import { Observable } from 'rxjs';
import { useRefValue } from './useRefValue';

export const useSubscription = ({
  subject,
  action,
  isEnabled = true,
}: {
  subject: Observable<any>;
  action: any;
  isEnabled?: boolean;
}) => {
  const actionRef = useRefValue(action ?? (() => {}));
  const subscriptionRef = useRef<any>(null);

  useLayoutEffect(() => {
    if (subscriptionRef.current || !subject || !isEnabled) {
      return () => {};
    }

    subscriptionRef.current = subject
      .subscribe(actionRef.current);
    return () => subscriptionRef.current.unsubscribe();
  }, [subject, isEnabled]);
};
