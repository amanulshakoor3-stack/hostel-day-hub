import { ScheduleEvent } from '../types';

export const HOSTEL_DAY_SCHEDULE: ScheduleEvent[] = [
  {
    id: 'ev-1',
    time: '04:30 PM - 05:00 PM',
    title: 'Inauguration & Lamp Lighting',
    location: 'Main Auditorium Courtyard',
    description: 'Welcome speech by Hostel Warden, Chief Guest address, and traditional inauguration ceremony.',
    category: 'Ceremony'
  },
  {
    id: 'ev-2',
    time: '05:00 PM - 06:30 PM',
    title: 'Inter-Hostel Cultural Gala',
    location: 'Open Air Theatre Stage',
    description: 'Dance face-offs, musical band performances, standalone skits, and department mashups.',
    category: 'Cultural'
  },
  {
    id: 'ev-3',
    time: '06:30 PM - 07:30 PM',
    title: 'Fun Games & Tug-Of-War Finals',
    location: 'Central Ground',
    description: 'Inter-block Tug of War, Arm Wrestling finals, and spot quiz competitions.',
    category: 'Games'
  },
  {
    id: 'ev-4',
    time: '07:30 PM - 09:30 PM',
    title: 'Grand Banquet Dinner',
    location: 'Hostel Main Dining Hall & Lawn',
    description: 'Feast time! Enjoy the buffet dinner including student-voted food items and desserts.',
    category: 'Dinner'
  },
  {
    id: 'ev-5',
    time: '09:30 PM - 11:00 PM',
    title: 'DJ Night & Celebration',
    location: 'Main Lawn Stage',
    description: 'High energy music, laser light show, memory slideshow, and open floor dance party.',
    category: 'DJ Night'
  }
];
