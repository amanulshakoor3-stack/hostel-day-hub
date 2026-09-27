import { ProgrammeItem } from '../types';

export const PROGRAMME_SCHEDULE: ProgrammeItem[] = [
  { id: 1, time: '3:30 – 3:40 PM', programme: 'Introduction / Welcome', category: 'ceremony' },
  { id: 2, time: '3:40 – 3:50 PM', programme: 'CEO Sir Speech', category: 'ceremony' },
  { id: 3, time: '3:50 – 4:00 PM', programme: 'Detractor Sir Speech', category: 'ceremony' },
  { id: 4, time: '4:00 – 4:10 PM', programme: 'Principal Sir Speech', category: 'ceremony' },
  { id: 5, time: '4:10 – 4:20 PM', programme: 'DH Sir Speech', category: 'ceremony' },
  { id: 6, time: '4:20 – 4:30 PM', programme: 'Hostel Warden Speech', category: 'ceremony' },
  { id: 7, time: '4:30 – 4:50 PM', programme: 'Refreshment', category: 'refreshment' },
  { id: 8, time: '4:50 – 5:20 PM', programme: 'Dress Distribution', category: 'special' },
  { id: 9, time: '5:20 – 5:50 PM', programme: 'Senior Speech + Group Photo', category: 'special' },
  { id: 10, time: '5:50 – 6:10 PM', programme: 'Solo Singer', category: 'cultural' },
  { id: 11, time: '6:10 – 6:30 PM', programme: 'Solo Dance', category: 'cultural' },
  { id: 12, time: '6:30 – 7:00 PM', programme: 'Extra Performances', category: 'cultural' },
  { id: 13, time: '7:00 – 7:03 PM', programme: 'Dinner Announcement / Gathering', category: 'food' },
  { id: 14, time: '7:03 – 9:00 PM', programme: 'Dinner', category: 'food' },
  { id: 15, time: '9:00 – 9:15 PM', programme: 'DJ Setup / Stage Preparation', category: 'party' },
  { id: 16, time: '9:15 – 10:15 PM', programme: 'Group Dance', category: 'cultural' },
  { id: 17, time: '10:15 PM – 1:00 AM', programme: 'DJ Party', category: 'party' },
  { id: 18, time: '1:00 AM', programme: 'Function Ends', category: 'end' }
];

export const SCHEDULE_ENDING_MESSAGE = "Function Ends: 1:00 AM";
