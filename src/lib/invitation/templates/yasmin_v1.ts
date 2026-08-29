import { InvitationTemplate } from '../types'

export const yasmin_v1: InvitationTemplate = {
  id: 'yasmin',
  name: 'Yasmin',
  slug: 'yasmin-floral',
  category: 'Floral',
  style: 'Elegant Floral',
  thumbnail: 'https://images.unsplash.com/photo-1592125661285-79820f2fdf7a?w=400&h=520&fit=crop&auto=format',
  version: '1.0',
  status: 'published',
  price: 150000,
  description: 'Template undangan dengan nuansa bunga mawar putih dan aksen emas champagne yang mewah.',
  keyFeatures: ['White Floral Aesthetic', 'Smooth Reveal Animations', 'Parallax Scrolling', 'Masonry Gallery'],
  experience: 'Mewah, bersih, dan romantis. Cocok untuk pernikahan dengan tema garden atau indoor yang elegan.',
  theme: {
    colors: {
      primary: '#B8966E', // Champagne Gold
      secondary: '#8C6B3A', // Gold Dark
      accent: '#D4B896', // Gold Light
      background: '#FFFDF8', // Ivory
      text: '#2C1F0E', // Ink
      card: '#FAF7F1', // Surface
    },
    fonts: {
      heading: 'Playfair Display',
      body: 'Lato',
    },
    borderRadius: '0px',
  },
  sections: [
    {
      id: 'cover',
      type: 'cover',
      title: 'Cover',
      enabled: true,
      config: {
        couplePhoto: 'https://images.unsplash.com/photo-1772241824154-ce6e7c985ff9?w=800&h=1000&fit=crop&auto=format',
        tagline: 'The Wedding of',
        dateText: '12 December 2026',
        locationText: 'Banda Aceh'
      },
      elements: [],
      widgets: [],
      editableProperties: ['couplePhoto', 'dateText', 'locationText'],
    },
    {
      id: 'quran',
      type: 'quote',
      title: 'Ayat Quran',
      enabled: true,
      config: {
        verse: '"And among His signs is that He created for you spouses from among yourselves so that you may find tranquility in them; and He placed between you affection and mercy."',
        reference: 'QS. Ar-Rum : 21',
      },
      elements: [],
      widgets: [],
      editableProperties: ['verse', 'reference'],
    },
    {
      id: 'couple',
      type: 'couple',
      title: 'Mempelai',
      enabled: true,
      config: {
        tagline: 'Together in Love',
        title: 'The Bride & Groom',
      },
      elements: [],
      widgets: [],
      editableProperties: [],
    },
    {
      id: 'story',
      type: 'story',
      title: 'Cerita Kita',
      enabled: true,
      config: {
        tagline: 'Perjalanan Kami',
        title: 'Our Story',
        items: [
          { year: '2019', title: 'First Meeting', desc: 'Bertemu untuk pertama kalinya di sebuah acara kampus yang tak terduga.' },
          { year: '2021', title: 'A New Chapter', desc: 'Persahabatan yang tumbuh perlahan menjadi sesuatu yang bermakna.' },
          { year: '2025', title: 'The Proposal', desc: 'Rafi melamar Zahra dengan penuh cinta di bawah langit senja.' },
          { year: '2026', title: 'The Beginning of Forever', desc: 'Kami memulai babak baru kehidupan bersama.' },
        ]
      },
      elements: [],
      widgets: [],
      editableProperties: ['items'],
    },
    {
      id: 'countdown',
      type: 'countdown',
      title: 'Countdown',
      enabled: true,
      config: {
        tagline: 'Menghitung Hari',
        title: 'Counting Down to Our Day',
        targetDate: '2026-12-12T08:00:00',
      },
      elements: [],
      widgets: [],
      editableProperties: ['targetDate'],
    },
    {
      id: 'event',
      type: 'event',
      title: 'Acara',
      enabled: true,
      config: {
        tagline: 'Save the Date',
        title: 'Wedding Events',
        events: [
          {
            name: 'Akad Nikah',
            date: 'Saturday, 12 December 2026',
            time: '08:00 – 10:00 WIB',
            venue: 'Masjid Al-Hikmah',
            address: 'Banda Aceh',
            mapsLink: 'https://maps.google.com'
          },
          {
            name: 'Walimatul Ursy',
            date: 'Saturday, 12 December 2026',
            time: '11:00 – 15:00 WIB',
            venue: 'Grand Ballroom Hermes Palace',
            address: 'Banda Aceh',
            mapsLink: 'https://maps.google.com'
          }
        ]
      },
      elements: [],
      widgets: [],
      editableProperties: ['events'],
    },
    {
      id: 'gallery',
      type: 'gallery',
      title: 'Galeri',
      enabled: true,
      config: {
        tagline: 'Momen Berharga',
        title: 'Our Gallery',
        images: [
          'https://images.unsplash.com/photo-1772241824154-ce6e7c985ff9?w=600&h=800&fit=crop&auto=format',
          'https://images.unsplash.com/photo-1670014235502-08593dc092b4?w=600&h=500&fit=crop&auto=format',
          'https://images.unsplash.com/photo-1658243862459-145b453dd74e?w=600&h=700&fit=crop&auto=format',
          'https://images.unsplash.com/photo-1485700281629-290c5a704409?w=600&h=500&fit=crop&auto=format',
          'https://images.unsplash.com/photo-1644337111604-aa1816b542a1?w=600&h=700&fit=crop&auto=format',
          'https://images.unsplash.com/photo-1592125661285-79820f2fdf7a?w=600&h=800&fit=crop&auto=format',
        ]
      },
      elements: [],
      widgets: [],
      editableProperties: ['images'],
    },
    {
      id: 'gift',
      type: 'gift',
      title: 'Kado',
      enabled: true,
      config: {
        tagline: 'Hadiah Pernikahan',
        title: 'Wedding Gift',
        description: 'Kehadiran dan doa restu Anda adalah hadiah terbesar bagi kami.',
        accounts: [
          { type: 'Bank Transfer', bank: 'BCA', number: '1234567890', holder: 'Zahra Aulia Putri' },
          { type: 'Digital Wallet', bank: 'DANA', number: '081234567890', holder: 'Zahra Aulia Putri' },
        ]
      },
      elements: [],
      widgets: [],
      editableProperties: ['accounts'],
    },
    {
      id: 'rsvp',
      type: 'rsvp',
      title: 'RSVP',
      enabled: true,
      config: {
        tagline: 'Konfirmasi Kehadiran',
        title: 'Will You Join Us?',
      },
      elements: [],
      widgets: [],
      editableProperties: [],
    },
    {
      id: 'closing',
      type: 'closing',
      title: 'Penutup',
      enabled: true,
      config: {
        message: '"Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu."',
        date: '12 · 12 · 2026',
      },
      elements: [],
      widgets: [],
      editableProperties: ['message'],
    },
  ]
}
