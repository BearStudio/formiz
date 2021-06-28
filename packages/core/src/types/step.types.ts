export interface StepState {
  name: string;
  label?: React.ReactNode;
  order: number;
  isCurrent: boolean;
  isValid: boolean;
  isVisited: boolean;
  isPristine: boolean;
  isValidating: boolean;
  isSubmitted: boolean;
  isEnabled: boolean;
}

export interface Step {
  index: number;
  name: string;
  label?: React.ReactNode;
  isCurrent: boolean;
  isValid: boolean;
  isVisited: boolean;
  isPristine: boolean;
  isValidating: boolean;
  isSubmitted: boolean;
}

export interface FormizStepProps {
  as?: any;
  name: string;
  label?: string;
  children?: React.ReactNode;
  isEnabled?: boolean;
  order?: number;
  style?: object;
  autoHide?: boolean;
}
