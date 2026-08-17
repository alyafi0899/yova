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
            address: 'Jl. Masjid Raya, Banda Aceh',
          },
          {
            name: 'Resepsi',
            date: 'Sabtu, 10 Jan 2027',
            time: '11:00 - 16:00 WIB',
            venue: 'Hotel Hermes Palace',
            address: 'Jl. T. Nyak Arief, Banda Aceh',
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
    }
  ]
}
