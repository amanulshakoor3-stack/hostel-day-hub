import { DinnerItem } from '../types';

export const DINNER_MENU_ITEMS: DinnerItem[] = [
  {
    id: 'biriyani',
    name: 'Chicken Biriyani with Boiled Egg',
    category: 'Non-Veg',
    badge: 'Grand Feast',
    description: 'Aromatic long-grain basmati rice cooked with authentic spices, tender juicy chicken, and seasoned boiled egg.',
    iconName: 'drumstick'
  },
  {
    id: 'chicken65',
    name: 'Chicken 65',
    category: 'Non-Veg',
    badge: 'Crispy Starter',
    description: 'Crispy, deep-fried spiced chicken marinated in South Indian herbs, curry leaves, and green chillies.',
    iconName: 'flame'
  },
  {
    id: 'paneer',
    name: 'Paneer Butter Masala',
    category: 'Veg',
    badge: 'Vegetarian Special',
    description: 'Melt-in-mouth cottage cheese cubes simmered in a rich, buttery, velvety tomato and cashew nut gravy.',
    iconName: 'sparkles'
  },
  {
    id: 'icecream',
    name: 'Unlimited Ice Cream',
    category: 'Dessert',
    badge: 'Unlimited Treat',
    description: 'Chilled dessert counter with all-you-can-eat scoops of smooth, rich ice cream to end the celebration on a sweet note!',
    iconName: 'icecream'
  }
];
