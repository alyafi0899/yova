import { InvitationTemplate } from '../types'

export const sakinah_v1: InvitationTemplate = {
  id: 'sakinah',
  name: 'Sakinah',
  slug: 'sakinah-muslim',
  category: 'Islamic',
  style: 'Elegant Islamic',
  thumbnail: 'https://images.unsplash.com/photo-1644337111604-aa1816b542a1?w=400&h=520&fit=crop&auto=format',
  version: '1.2',
  status: 'published',
  price: 150000,
  description: 'Template undangan islami yang elegan dengan nuansa forest green dan emas.',
  keyFeatures: ['Islamic Star Ornaments', 'Personalized Guest Cover', 'Wedding Countdown', 'RSVP & Guestbook'],
  experience: 'Menghadirkan suasana khidmat dan elegan dengan sentuhan ornamen bintang islami dan palet warna yang menenangkan.',
  theme: {
    colors: {
      primary: '#17352F', // Forest Green
      secondary: '#C7A96B', // Gold
      accent: '#C7A96B',
      background: '#F8F4EC', // Ivory
      text: '#252522', // Ink
      card: '#FFFDF8', // Surface
    },
    fonts: {
      heading: 'Playfair Display',
      body: 'DM Sans',
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
        bismillah: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
        bismillahTranslation: 'Bismillahirrahmanirrahim',
        couplePhoto: 'https://images.unsplash.com/photo-1644337111604-aa1816b542a1?w=400&h=520&fit=crop&auto=format',
        tagline: 'The Wedding of',
      },
      elements: [],
      widgets: [],
      editableProperties: ['couplePhoto'],
    },
    {
      id: 'introduction',
      type: 'quote',
      title: 'Pendahuluan',
      enabled: true,
      config: {
        invitationText: '"Dengan memohon rahmat dan ridho Allah SWT, kami mengundang Bapak/Ibu/Saudara/i untuk hadir dalam acara pernikahan kami."',
      },
      elements: [],
      widgets: [],
      editableProperties: ['invitationText'],
    },
    {
      id: 'quran',
      type: 'quote',
      title: 'Quran Verse',
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
        bride: {
          name: 'Zahra Aulia Putri',
          parents: 'Bapak Ahmad Fauzi & Ibu Siti Rahmah',
          image: 'https://images.unsplash.com/photo-1779144999758-4062528dd799?w=350&h=450&fit=crop&crop=top&auto=format',
        },
        groom: {
          name: 'Rafi Maulana',
          parents: 'Bapak Hendra Maulana & Ibu Nur Aisyah',
          image: 'https://images.unsplash.com/photo-1726694064556-c9565e8e81c9?w=350&h=450&fit=crop&crop=top&auto=format',
        }
      },
      elements: [],
      widgets: [],
      editableProperties: ['bride.name', 'bride.parents', 'bride.image', 'groom.name', 'groom.parents', 'groom.image'],
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
      id: 'event',
      type: 'event',
      title: 'Acara Pernikahan',
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
          },
          {
            name: 'Walimatul Ursy',
            date: 'Saturday, 12 December 2026',
            time: '11:00 – 15:00 WIB',
            venue: 'Grand Ballroom Hermes Palace',
            address: '',
          }
        ]
      },
      elements: [],
      widgets: [],
      editableProperties: ['events'],
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
      id: 'gallery',
      type: 'gallery',
      title: 'Galeri Momen',
      enabled: true,
      config: {
        tagline: 'Momen Berharga',
        title: 'Our Gallery',
        images: [
          'https://images.unsplash.com/photo-1772241824154-ce6e7c985ff9?w=600&h=800&fit=crop&auto=format',
          'https://images.unsplash.com/photo-1670014235502-08593dc092b4?w=600&h=500&fit=crop&auto=format',
          'https://images.unsplash.com/photo-1658243862459-145b453dd74e?w=600&h=700&fit=crop&auto=format',
          'https://images.unsplash.com/photo-1485700281629-290c5a704409?w=600&h=500&fit=crop&auto=format',
          'https://images.unsplash.com/photo-1586161659865-2ce93be6b95c?w=600&h=650&fit=crop&auto=format',
          'https://images.unsplash.com/photo-1644337111604-aa1816b542a1?w=600&h=700&fit=crop&auto=format',
        ]
      },
      elements: [],
      widgets: [],
      editableProperties: ['images'],
    },
    {
      id: 'gift',
      type: 'gift',
      title: 'Hadiah Pernikahan',
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
      title: 'Konfirmasi Kehadiran',
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
        names: 'Zahra & Rafi',
        date: '12.12.2026',
      },
      elements: [],
      widgets: [],
      editableProperties: ['message'],
    },
  ]
}
