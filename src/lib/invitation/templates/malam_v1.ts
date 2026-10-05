import { InvitationTemplate } from '../types'

export const malam_v1: InvitationTemplate = {
  id: 'malam',
  name: 'Malam',
  slug: 'malam-noir',
  category: 'Modern',
  style: 'Dark Luxury',
  thumbnail: 'https://images.unsplash.com/photo-1487528742387-d53d4f12488d?w=400&h=520&fit=crop&auto=format',
  version: '1.0',
  status: 'published',
  price: 200000,
  description: 'Template undangan mewah dengan tema gelap (noir), aksen emas yang bercahaya, dan efek kelopak bunga yang berguguran.',
  keyFeatures: ['Dark Mode Aesthetic', 'Gold Floral Animation', 'Floating Petals FX', 'Interactive 3D Envelope'],
  experience: 'Misterius, intim, dan sangat mewah. Memberikan kesan eksklusif dan mendalam bagi para tamu undangan Anda.',
  theme: {
    colors: {
      primary: '#E0B394',    // Rose Gold
      secondary: '#3D1217',  // Deep Wine
      accent: '#F7D7C4',     // Soft Rose Gold
      background: '#2D0B0F', // Deep Burgundy
      text: '#F7E7E8',       // Warm Ivory
      card: '#4A181D',       // Rich Maroon
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
      title: 'Envelope',
      enabled: true,
      config: {
        tagline: 'You are Invited',
      },
      elements: [],
      widgets: [],
      editableProperties: ['tagline'],
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
            address: '',
            mapsLink: 'https://maps.google.com'
          },
          {
            name: 'Walimatul Ursy',
            date: 'Saturday, 12 December 2026',
            time: '11:00 – 15:00 WIB',
            venue: 'Grand Ballroom Hermes Palace',
            address: '',
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
          'https://images.unsplash.com/photo-1647496087770-be3541b9a468?w=600&h=800&fit=crop&auto=format',
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
