import { InvitationTemplate } from '../types'

export const noura_v1: InvitationTemplate = {
  id: 'noura',
  name: 'Noura',
  slug: 'noura-elegant',
  category: 'Islamic',
  style: 'Elegant Gold',
  thumbnail: 'photo-1625038032128-54ed70feb167',
  version: '1.0',
  status: 'published',
  price: 120000,
  description: 'Nuansa emas yang hangat dengan tipografi klasik dan sentuhan kaligrafi islami.',
  keyFeatures: ['Full Customization', 'Countdown Timer', 'RSVP & Guestbook', 'Responsive Design'],
  experience: 'Template ini menghadirkan palet navy dan emas yang mewah, dilengkapi transisi lembut yang nyaman dilihat di perangkat mobile maupun desktop.',
  theme: {
    colors: {
      primary: '#1B3A4B',
      secondary: '#C9A84C',
      accent: '#C9A84C',
      background: '#FAF8F4',
      text: '#2C2416',
      card: '#FFFFFF',
    },
    fonts: {
      heading: 'Playfair Display',
      body: 'DM Sans',
    },
    borderRadius: '8px',
  },
  sections: [
    {
      id: 'cover',
      type: 'cover',
      title: 'Cover',
      enabled: true,
      config: {
        groomName: 'Al Yafi',
        brideName: 'Yova',
        date: '10 Januari 2027',
        backgroundImage: 'https://images.unsplash.com/photo-1625038032128-54ed70feb167',
      },
      elements: [
        {
          id: 'ornament-top',
          type: 'svg',
          content: '<svg viewBox="0 0 100 100">...</svg>', // sample
          style: {
            position: { x: 50, y: 10 },
            size: { width: 100, height: 100 },
            rotation: 0,
            opacity: 1,
            zIndex: 1,
          },
          locked: true,
        }
      ],
      widgets: [],
      editableProperties: ['groomName', 'brideName', 'date', 'backgroundImage'],
    },
    {
      id: 'couple',
      type: 'couple',
      title: 'Mempelai',
      enabled: true,
      config: {
        groom: {
          name: 'Muhammad Al Yafi',
          parents: 'Putra dari Bapak Rizal & Ibu Mariana',
          image: 'https://images.unsplash.com/photo-1779501678407-c212cd23af9f',
        },
        bride: {
          name: 'Yova Rahmadani',
          parents: 'Putri dari Bapak Hendra & Ibu Sari',
          image: 'https://images.unsplash.com/photo-1779501678407-c212cd23af9f',
        }
      },
      elements: [],
      widgets: [],
      editableProperties: ['groom.name', 'groom.parents', 'bride.name', 'bride.parents'],
    },
    {
      id: 'event',
      type: 'event',
      title: 'Acara',
      enabled: true,
      config: {
        events: [
          {
            name: 'Akad Nikah',
            date: 'Sabtu, 10 Jan 2027',
            time: '08:00 - 10:00 WIB',
            venue: 'Masjid Raya Baiturrahman',
            address: 'Jl. Masjid Raya, .',
          },
          {
            name: 'Resepsi',
            date: 'Sabtu, 10 Jan 2027',
            time: '11:00 - 16:00 WIB',
            venue: 'Hotel Hermes Palace',
            address: 'Jl. T. Nyak Arief, .',
          }
        ]
      },
      elements: [],
      widgets: [
        {
          id: 'maps-akad',
          type: 'maps',
          config: { lat: 5.553, lng: 95.317 },
        }
      ],
      editableProperties: ['events'],
    },
    {
      id: 'gallery',
      type: 'gallery',
      title: 'Galeri',
      enabled: true,
      config: {
        images: [
          'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format',
          'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=800&auto=format',
          'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&auto=format',
          'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&auto=format',
        ],
      },
      elements: [],
      widgets: [],
      editableProperties: ['images'],
    },
    {
      id: 'rsvp',
      type: 'rsvp',
      title: 'RSVP',
      enabled: true,
      config: {},
      elements: [],
      widgets: [],
      editableProperties: [],
    },
    {
      id: 'wishes',
      type: 'wishes',
      title: 'Ucapan',
      enabled: true,
      config: {},
      elements: [],
      widgets: [],
      editableProperties: [],
    },
  ]
}
