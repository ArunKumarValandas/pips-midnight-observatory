export type Theme = 'observatory' | 'midnight';

export interface WorkflowStage {
  id: string;
  stepNumber: number;
  title: string;
  subtitle: string;
  summary: string;
  tools: string[];
  pipNote: string;
  craftingTip: string;
  potencyMetric: {
    label: string;
    value: string;
    percentage: number;
  };
}

export interface DeliveryStop {
  id: string;
  name: string;
  x: number;
  y: number;
  recipient: string;
  dreamType: string;
  windSpeed: string;
  altitude: string;
  deliveryStatus: 'Delivered' | 'In Flight' | 'Pending Soft Landing';
  description: string;
  specialNote: string;
}

export interface StoryScene {
  id: string;
  sceneNumber: number;
  title: string;
  subtitle: string;
  text: string;
  extendedText?: string;
  pipQuote: string;
  moral: string;
  tag: string;
}

export interface StableStar {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  delay: number;
  duration: number;
}
