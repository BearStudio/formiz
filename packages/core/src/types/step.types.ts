export interface StepState {
  name: string;
  label?: React.ReactNode;
  order: number;
  isValid: boolean;
  isVisited: boolean;
  isSubmitted: boolean;
  isEnabled: boolean;
}

export interface Step {
  index: number;
  name: string;
  label?: React.ReactNode;
  isValid: boolean;
  isVisited: boolean;
  isSubmitted: boolean;
}

export interface FormizStepProps {
  as?: any;
  name: string;
  children?: React.ReactNode;
  isEnabled?: boolean;
  order?: number;
  style?: object;
}
