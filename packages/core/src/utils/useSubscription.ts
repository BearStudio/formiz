import { useLayoutEffect } from 'react';
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
  useLayoutEffect(() => {
    if (!subject || !isEnabled) {
      return () => {};
    }

    const subscription = subject
      .subscribe(actionRef.current);
    return () => subscription.unsubscribe();
  }, []);
};
