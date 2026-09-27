import { MenuItem } from '../types';

export const STARTERS_MENU: MenuItem[] = [
  { id: '1', name: 'Paneer Tikka Grill', category: 'Starter', isVeg: true, description: 'Cottage cheese cubes marinated in spiced yogurt and grilled' },
  { id: '2', name: 'Chicken 65 Crispy', category: 'Starter', isVeg: false, description: 'Spiced deep-fried chicken cubes with curry leaves and chillies' },
  { id: '3', name: 'Crispy Corn & Pepper Salt', category: 'Starter', isVeg: true, description: 'Golden fried sweetcorn tossed with crushed black pepper' },
  { id: '4', name: 'Mutton Sukka Fry', category: 'Starter', isVeg: false, description: 'Tender mutton cooked with aromatic roasted spices' }
];

export const MAIN_COURSE_MENU: MenuItem[] = [
  { id: '5', name: 'Special Chicken Biryani', category: 'Main Course', isVeg: false, description: 'Long-grain basmati rice cooked with succulent chicken and aromatic herbs' },
  { id: '6', name: 'Paneer Butter Masala & Naan', category: 'Main Course', isVeg: true, description: 'Rich tomato gravy served with butter naan bread' },
  { id: '7', name: 'Dal Makhani & Jeera Rice', category: 'Main Course', isVeg: true, description: 'Slow-cooked black lentils in cream served with cumin rice' },
  { id: '8', name: 'Fish Curry South-Indian Style', category: 'Main Course', isVeg: false, description: 'Tangy coconut curry with fresh fish fillets' }
];

export const DESSERT_DRINKS_MENU: MenuItem[] = [
  { id: '9', name: 'Hot Gulab Jamun with Vanilla Ice Cream', category: 'Dessert', isVeg: true, description: 'Classic sweet dumplings served warm with cold ice cream' },
  { id: '10', name: 'Ice Cream Sundae Bar', category: 'Dessert', isVeg: true, description: 'Chocolate, Mango & Strawberry scoops with nuts and syrup' },
  { id: '11', name: 'Chilled Rose Milk & Badam Milk', category: 'Drink', isVeg: true, description: 'Refreshing hostel special cold beverages' }
];
