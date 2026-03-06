import type { Service, Master, Review, TimeSlot, ContactInfo } from '../types';

export const services: Service[] = [
  {
    id: 'sug-1',
    name: 'Шугарінг ніг повністю',
    category: 'sugaring',
    price: 350,
    duration: 60,
    description: 'Цукрова депіляція ніг повністю. Ніжна шкіра та тривалий результат до 4 тижнів.',
    image: '/images/sugaring.jpg',
  },
  {
    id: 'sug-2',
    name: 'Шугарінг бікіні',
    category: 'sugaring',
    price: 300,
    duration: 45,
    description: 'Класичне або глибоке бікіні. Мінімальний дискомфорт завдяки спеціальній техніці.',
    image: '/images/sugaring.jpg',
  },
  {
    id: 'sug-3',
    name: 'Шугарінг рук',
    category: 'sugaring',
    price: 250,
    duration: 30,
    description: 'Цукрова депіляція рук повністю.',
    image: '/images/sugaring.jpg',
  },
  {
    id: 'sug-4',
    name: 'Шугарінг пахв',
    category: 'sugaring',
    price: 150,
    duration: 20,
    description: 'Швидка та ефективна депіляція пахв.',
    image: '/images/sugaring.jpg',
  },
  {
    id: 'man-1',
    name: 'Класичний манікюр',
    category: 'manicure',
    price: 350,
    duration: 60,
    description: 'Класичний манікюр з покриттям гель-лаком. Стильний дизайн та стійке покриття.',
    image: '/images/manicure.jpg',
  },
  {
    id: 'man-2',
    name: 'Апаратний манікюр',
    category: 'manicure',
    price: 400,
    duration: 75,
    description: 'Апаратний манікюр з покриттям. Ідеальна обробка кутикули без порізів.',
    image: '/images/manicure.jpg',
  },
  {
    id: 'man-3',
    name: 'Нарощення нігтів',
    category: 'manicure',
    price: 600,
    duration: 120,
    description: 'Нарощення нігтів гелем. Природний або яскравий вигляд на ваш вибір.',
    image: '/images/manicure.jpg',
  },
  {
    id: 'ped-1',
    name: 'Класичний педикюр',
    category: 'pedicure',
    price: 400,
    duration: 75,
    description: 'Повний догляд за стопами та нігтями з покриттям гель-лаком.',
    image: '/images/pedicure.jpg',
  },
  {
    id: 'ped-2',
    name: 'Апаратний педикюр',
    category: 'pedicure',
    price: 500,
    duration: 90,
    description: 'Апаратний педикюр з покриттям. Глибокий догляд за стопами.',
    image: '/images/pedicure.jpg',
  },
  {
    id: 'ped-3',
    name: 'SPA-педикюр',
    category: 'pedicure',
    price: 600,
    duration: 90,
    description: 'Розкішний SPA-педикюр з масажем, пілінгом та маскою для ніг.',
    image: '/images/pedicure.jpg',
  },
  {
    id: 'brow-1',
    name: 'Корекція брів',
    category: 'brows',
    price: 200,
    duration: 30,
    description: 'Професійна корекція форми брів. Підбір ідеальної форми під тип обличчя.',
    image: '/images/brows.jpg',
  },
  {
    id: 'brow-2',
    name: 'Фарбування брів',
    category: 'brows',
    price: 250,
    duration: 30,
    description: 'Фарбування брів стійкою фарбою. Насичений колір до 3 тижнів.',
    image: '/images/brows.jpg',
  },
  {
    id: 'brow-3',
    name: 'Ламінування брів',
    category: 'brows',
    price: 400,
    duration: 45,
    description: 'Ламінування для ідеальної укладки та блиску. Ефект до 6 тижнів.',
    image: '/images/brows.jpg',
  },
];

export const masters: Master[] = [
  {
    id: 'master-1',
    name: 'Анна',
    photo: '/images/masters/anna.jpg',
    rating: 5.0,
    reviewsCount: 124,
    specializations: ['manicure', 'pedicure'],
    experience: '5 років',
    description: 'Майстер манікюру та педикюру. Спеціалізується на складних дизайнах та нарощенні.',
  },
  {
    id: 'master-2',
    name: 'Марина',
    photo: '/images/masters/marina.jpg',
    rating: 5.0,
    reviewsCount: 98,
    specializations: ['sugaring', 'brows'],
    experience: '4 роки',
    description: 'Майстер шугарінгу та оформлення брів. Делікатний підхід та чудовий результат.',
  },
  {
    id: 'master-3',
    name: 'Олена',
    photo: '/images/masters/olena.jpg',
    rating: 5.0,
    reviewsCount: 156,
    specializations: ['manicure', 'pedicure', 'brows'],
    experience: '7 років',
    description: 'Топ-майстер салону. Манікюр, педикюр, оформлення брів — все на найвищому рівні.',
  },
  {
    id: 'master-4',
    name: 'Ірина',
    photo: '/images/masters/irina.jpg',
    rating: 5.0,
    reviewsCount: 87,
    specializations: ['sugaring', 'manicure'],
    experience: '3 роки',
    description: 'Молодий та перспективний майстер. Шугарінг та манікюр з увагою до деталей.',
  },
];

export const reviews: Review[] = [
  {
    id: 'rev-1',
    author: 'Оксана М.',
    rating: 5,
    text: 'Чудовий салон! Анна зробила неймовірний манікюр, я в захваті. Обов\'язково повернусь!',
    date: '2026-02-15',
    masterId: 'master-1',
  },
  {
    id: 'rev-2',
    author: 'Катерина Л.',
    rating: 5,
    text: 'Марина — найкращий майстер шугарінгу! Швидко, майже не боляче, результат тримається довго.',
    date: '2026-02-20',
    masterId: 'master-2',
  },
  {
    id: 'rev-3',
    author: 'Наталія К.',
    rating: 5,
    text: 'Олена чарівниця! Брови ідеальні, саме те що хотіла. Атмосфера в салоні дуже приємна.',
    date: '2026-02-25',
    masterId: 'master-3',
  },
  {
    id: 'rev-4',
    author: 'Юлія С.',
    rating: 5,
    text: 'Педикюр у Олени — це щось! Ноги як після SPA-курорту. Рекомендую всім подругам.',
    date: '2026-03-01',
    masterId: 'master-3',
  },
  {
    id: 'rev-5',
    author: 'Вікторія Д.',
    rating: 5,
    text: 'Ірина зробила шугарінг дуже акуратно. Я задоволена результатом і ціною!',
    date: '2026-03-03',
    masterId: 'master-4',
  },
];

export function generateTimeSlots(date: string): TimeSlot[] {
  const slots: TimeSlot[] = [];
  const startHour = 9;
  const endHour = 20;

  for (let hour = startHour; hour < endHour; hour++) {
    for (const minutes of ['00', '30']) {
      const time = `${hour.toString().padStart(2, '0')}:${minutes}`;
      slots.push({
        id: `${date}-${time}`,
        time,
        available: Math.random() > 0.3,
      });
    }
  }
  return slots;
}

export const contactInfo: ContactInfo = {
  address: 'м. Київ, вул. Хрещатик, 10',
  phone: '+380 (67) 123-45-67',
  schedule: 'ПН–СБ 9:00 — 20:00',
  telegram: 'https://t.me/beautyroom_kyiv',
  instagram: 'https://instagram.com/beautyroom_kyiv',
};

export const categoryNames: Record<string, string> = {
  sugaring: 'Шугарінг',
  manicure: 'Манікюр',
  pedicure: 'Педикюр',
  brows: 'Брови',
};

export const categoryMinPrices: Record<string, number> = {
  sugaring: 150,
  manicure: 350,
  pedicure: 400,
  brows: 200,
};
