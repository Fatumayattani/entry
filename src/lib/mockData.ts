import { Pass } from '../types';

const now = Date.now();
const oneDay = 24 * 60 * 60 * 1000;
const oneWeek = 7 * oneDay;
const oneMonth = 30 * oneDay;

const MOCK_ORGANIZER = 'DemoOrg1111111111111111111111111111111111111';

export const MOCK_PASSES: Pass[] = [
  {
    id: 'pass_1_summer_festival',
    mint: '11111111111111111111111111111111',
    name: 'Summer Music Festival 2024',
    description: 'Three-day pass to the hottest music festival of the year featuring top artists from around the world. Includes access to all stages and VIP lounges.',
    price: 0.5,
    currency: 'SOL',
    startTime: now - oneWeek,
    endTime: now + oneMonth,
    maxSupply: 500,
    currentSupply: 347,
    transferable: true,
    organizer: MOCK_ORGANIZER,
    imageUrl: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  {
    id: 'pass_2_gym_membership',
    mint: '22222222222222222222222222222222',
    name: 'Elite Fitness Monthly Pass',
    description: 'Full access to all gym facilities, group classes, pool, and sauna. Valid for 30 days from purchase date.',
    price: 0.15,
    currency: 'SOL',
    startTime: now - oneDay * 2,
    endTime: now + oneMonth * 2,
    maxSupply: 1000,
    currentSupply: 234,
    transferable: false,
    organizer: MOCK_ORGANIZER,
    imageUrl: 'https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  {
    id: 'pass_3_tech_conference',
    mint: '33333333333333333333333333333333',
    name: 'Web3 Builders Conference',
    description: 'Join 5,000+ developers, founders, and investors for the premier Web3 conference. Two days of talks, workshops, and networking.',
    price: 1.2,
    currency: 'SOL',
    startTime: now + oneWeek,
    endTime: now + oneMonth * 2,
    maxSupply: 2000,
    currentSupply: 0,
    transferable: true,
    organizer: MOCK_ORGANIZER,
    imageUrl: 'https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  {
    id: 'pass_4_nft_gallery',
    mint: '44444444444444444444444444444444',
    name: 'Digital Art Gallery Access',
    description: 'Exclusive access to our curated NFT gallery featuring works from renowned digital artists. Virtual and physical gallery access included.',
    price: 0.08,
    currency: 'SOL',
    startTime: now - oneDay * 5,
    endTime: now + oneMonth * 3,
    maxSupply: 300,
    currentSupply: 156,
    transferable: true,
    organizer: MOCK_ORGANIZER,
    imageUrl: 'https://images.pexels.com/photos/1839919/pexels-photo-1839919.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  {
    id: 'pass_5_coworking',
    mint: '55555555555555555555555555555555',
    name: 'Coworking Space Monthly',
    description: 'Premium coworking space in the heart of the city. 24/7 access, high-speed internet, meeting rooms, and free coffee.',
    price: 0.3,
    currency: 'SOL',
    startTime: now - oneDay * 3,
    endTime: now + oneMonth * 6,
    maxSupply: 150,
    currentSupply: 89,
    transferable: false,
    organizer: MOCK_ORGANIZER,
    imageUrl: 'https://images.pexels.com/photos/1181396/pexels-photo-1181396.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  {
    id: 'pass_6_yoga_retreat',
    mint: '66666666666666666666666666666666',
    name: 'Bali Yoga Retreat 2025',
    description: 'Week-long yoga and meditation retreat in beautiful Bali. Includes accommodation, meals, daily yoga sessions, and excursions.',
    price: 2.5,
    currency: 'SOL',
    startTime: now + oneWeek * 2,
    endTime: now + oneMonth * 4,
    maxSupply: 50,
    currentSupply: 0,
    transferable: true,
    organizer: MOCK_ORGANIZER,
    imageUrl: 'https://images.pexels.com/photos/3822906/pexels-photo-3822906.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  {
    id: 'pass_7_exclusive_dinner',
    mint: '77777777777777777777777777777777',
    name: 'Michelin Star Chef Dinner',
    description: 'Intimate 12-course tasting menu experience with world-renowned Chef Martinez. Limited to 20 guests per seating.',
    price: 0.75,
    currency: 'SOL',
    startTime: now - oneWeek,
    endTime: now + oneWeek * 3,
    maxSupply: 20,
    currentSupply: 20,
    transferable: false,
    organizer: MOCK_ORGANIZER,
    imageUrl: 'https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  {
    id: 'pass_8_gaming_tournament',
    mint: '88888888888888888888888888888888',
    name: 'Esports Championship Finals',
    description: 'Watch the best gamers compete for $1M prize pool. VIP pass includes meet & greet with players and exclusive merch.',
    price: 0.25,
    currency: 'SOL',
    startTime: now - oneMonth,
    endTime: now - oneDay,
    maxSupply: 800,
    currentSupply: 673,
    transferable: true,
    organizer: MOCK_ORGANIZER,
    imageUrl: 'https://images.pexels.com/photos/3165335/pexels-photo-3165335.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  {
    id: 'pass_9_wine_tasting',
    mint: '99999999999999999999999999999999',
    name: 'Vineyard Wine Tasting Tour',
    description: 'Guided tour through our award-winning vineyard with professional sommelier. Taste 8 premium wines paired with artisanal cheeses.',
    price: 0.12,
    currency: 'SOL',
    startTime: now - oneDay,
    endTime: now + oneMonth,
    maxSupply: 100,
    currentSupply: 45,
    transferable: true,
    organizer: MOCK_ORGANIZER,
    imageUrl: 'https://images.pexels.com/photos/1407846/pexels-photo-1407846.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  {
    id: 'pass_10_startup_workshop',
    mint: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
    name: 'Startup Accelerator Workshop',
    description: 'Intensive 3-day workshop covering fundraising, product development, and scaling. Learn from successful founders and investors.',
    price: 0.4,
    currency: 'SOL',
    startTime: now - oneDay * 4,
    endTime: now + oneWeek * 6,
    maxSupply: 200,
    currentSupply: 127,
    transferable: false,
    organizer: MOCK_ORGANIZER,
    imageUrl: 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=800'
  }
];

export function initializeMockData(): void {
  const existingData = localStorage.getItem('entry_passes');

  if (!existingData) {
    localStorage.setItem('entry_passes', JSON.stringify(MOCK_PASSES));
    console.log('Mock passes initialized');
  }
}

export function resetMockData(): void {
  localStorage.setItem('entry_passes', JSON.stringify(MOCK_PASSES));

  const keys = Object.keys(localStorage);
  keys.forEach(key => {
    if (key.startsWith('user_passes_')) {
      localStorage.removeItem(key);
    }
  });

  console.log('Mock data reset');
}
