interface PotCategory {
  id: string;
  name: string;
  color: string;
  icon: string;
  description?: string;
}

export const POT_CATEGORIES: PotCategory[] = [
  { 
    id: 'holiday', 
    name: 'Holiday', 
    color: '#FF6B6B',
    icon: '🏖️',
    description: 'Save for your dream vacation'
  },
  { 
    id: 'emergency', 
    name: 'Emergency', 
    color: '#4ECDC4',
    icon: '🚨',
    description: 'Build your safety net'
  },
  { 
    id: 'gift', 
    name: 'Gift', 
    color: '#FFD93D',
    icon: '🎁',
    description: 'Save for special occasions'
  },
  { 
    id: 'upcoming', 
    name: 'Upcoming', 
    color: '#6C5CE7',
    icon: '📅',
    description: 'Plan for future expenses'
  },
  { 
    id: 'gold', 
    name: 'Gold', 
    color: '#FFA94D',
    icon: '💍',
    description: 'Invest in precious metals'
  },
  { 
    id: 'gadget', 
    name: 'Gadget', 
    color: '#45B7D1',
    icon: '📱',
    description: 'Save for tech upgrades'
  },
  { 
    id: 'education', 
    name: 'Education', 
    color: '#A8E6CF',
    icon: '📚',
    description: 'Invest in learning'
  },
  { 
    id: 'custom', 
    name: 'Custom', 
    color: '#FF8B94',
    icon: '✨',
    description: 'Create your own goal'
  }
];

export default POT_CATEGORIES;
