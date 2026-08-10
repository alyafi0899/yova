export const WHATSAPP_NUMBER = '6282225191311' // Ganti dengan nomor WhatsApp Yova
export const DEPOSIT_AMOUNT = 150000

export type DressStatus = 'available' | 'booked' | 'rented' | 'maintenance'
export type DressCategory = 'Wanita' | 'Pria' | 'Couple'

export interface Measurements {
  lingkarDada?: string
  lebarDada?: string
  lebarBahu?: string
  lingkarPinggang?: string
  lingkarPinggul?: string
  panjangBaju?: string
  panjangLengan?: string
  lingkarLengan?: string
  tinggiBadan?: string
}

export interface Dress {
  id: string
  collectionCode: string
  name: string
  category: DressCategory
  description: string
  price: number
  deposit: number
  status: DressStatus
  estimatedAvailable?: string
  images: string[]
  measurements: Measurements
  includedItems: string[]
  resizeAvailable: boolean
  fitNotes: string
  recommendedHeight: string
}

export const DRESSES: Dress[] = [
  {
    id: 'pr-01',
    collectionCode: 'PR-01',
    name: 'Baju Akad Wanita Classic',
    category: 'Wanita',
    description:
      'Gaun akad elegan dengan siluet modern dan sentuhan tradisional. Bahan berkualitas tinggi yang nyaman dipakai sepanjang hari. Detail bordir halus pada bagian kerah dan lengan memberikan kesan mewah yang anggun.',
    price: 500000,
    deposit: DEPOSIT_AMOUNT,
    status: 'available',
    images: [
      'https://images.unsplash.com/photo-1771808022279-cf15a2a9eaca?w=800&h=1000&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1603796846900-d61a14c890ef?w=800&h=1000&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1524048269000-9949b9a70cb0?w=800&h=1000&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1771495307120-dd557e4db001?w=800&h=1000&fit=crop&auto=format',
    ],
    measurements: {
      lingkarDada: '88 cm',
      lebarDada: '35 cm',
      lebarBahu: '38 cm',
      lingkarPinggang: '72 cm',
      lingkarPinggul: '96 cm',
      panjangBaju: '145 cm',
      panjangLengan: '58 cm',
      lingkarLengan: '30 cm',
      tinggiBadan: '158 – 168 cm',
    },
    includedItems: ['Dress', 'Veil', 'Bros', 'Garment Bag'],
    resizeAvailable: true,
    fitNotes:
      'Potongan A-line yang fleksibel untuk berbagai bentuk tubuh. Kain memiliki sedikit stretch pada area pinggang. Sangat disarankan untuk melakukan fitting sebelum hari acara.',
    recommendedHeight: '158 – 168 cm',
  },
  {
    id: 'pr-02',
    collectionCode: 'PR-02',
    name: 'Baju Akad Wanita Songket',
    category: 'Wanita',
    description:
      'Perpaduan baju akad modern dengan aksen songket khas Aceh yang memukau. Cocok untuk pasangan yang menginginkan sentuhan budaya lokal dalam hari istimewa mereka.',
    price: 600000,
    deposit: DEPOSIT_AMOUNT,
    status: 'booked',
    estimatedAvailable: '25 Agustus 2026',
    images: [
      'https://images.unsplash.com/photo-1650377509428-11e7fe8614a9?w=800&h=1000&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1779619011908-cc586d6b1191?w=800&h=1000&fit=crop&auto=format',
    ],
    measurements: {
      lingkarDada: '90 cm',
      lebarDada: '36 cm',
      lebarBahu: '38 cm',
      lingkarPinggang: '74 cm',
      lingkarPinggul: '98 cm',
      panjangBaju: '148 cm',
      panjangLengan: '60 cm',
      lingkarLengan: '31 cm',
      tinggiBadan: '160 – 170 cm',
    },
    includedItems: ['Dress', 'Veil', 'Songket', 'Bros', 'Pashmina', 'Garment Bag'],
    resizeAvailable: true,
    fitNotes:
      'Desain longgar di area pinggang memudahkan penyesuaian saat fitting. Songket dipakai sebagai selendang atau kain bawah sesuai preferensi.',
    recommendedHeight: '160 – 170 cm',
  },
  {
    id: 'pr-03',
    collectionCode: 'PR-03',
    name: 'Baju Akad Pria Classic',
    category: 'Pria',
    description:
      'Setelan akad pria dengan potongan modern dan bahan premium. Desain sederhana namun berkesan yang cocok dipadukan dengan berbagai koleksi wanita kami.',
    price: 400000,
    deposit: DEPOSIT_AMOUNT,
    status: 'available',
    images: [
      'https://images.unsplash.com/photo-1650377509454-1bbd8392e122?w=800&h=1000&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1650377509488-724221735c19?w=800&h=1000&fit=crop&auto=format',
    ],
    measurements: {
      lingkarDada: '96 cm',
      lebarBahu: '44 cm',
      lingkarPinggang: '82 cm',
      panjangBaju: '72 cm',
      panjangLengan: '62 cm',
      tinggiBadan: '165 – 175 cm',
    },
    includedItems: ['Kemeja Akad', 'Peci', 'Garment Bag'],
    resizeAvailable: false,
    fitNotes: 'Potongan slim fit modern. Penyesuaian ukuran tidak tersedia untuk koleksi pria.',
    recommendedHeight: '165 – 175 cm',
  },
  {
    id: 'pr-04',
    collectionCode: 'PR-04',
    name: 'Paket Couple Akad',
    category: 'Couple',
    description:
      'Paket lengkap baju akad couple dengan koordinasi warna yang harmonis. Tersedia untuk pasangan yang ingin tampil serasi di hari bersejarah mereka.',
    price: 850000,
    deposit: DEPOSIT_AMOUNT,
    status: 'available',
    images: [
      'https://images.unsplash.com/photo-1779619023694-be6bfdd18290?w=800&h=1000&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1650377509454-1bbd8392e122?w=800&h=1000&fit=crop&auto=format',
    ],
    measurements: {
      tinggiBadan: 'Wanita 155–168 cm / Pria 163–175 cm',
      lingkarDada: 'Disesuaikan saat fitting',
    },
    includedItems: ['Dress Wanita', 'Baju Pria', 'Veil', 'Peci', 'Bros', 'Garment Bag (x2)'],
    resizeAvailable: true,
    fitNotes:
      'Fitting wajib untuk kedua pasangan. Ukuran disesuaikan penuh saat sesi fitting bersama.',
    recommendedHeight: 'Wanita 155–168 cm / Pria 163–175 cm',
  },
]

export const MOCK_RENTALS = [
  {
    bookingId: 'YV-0012',
    dress: DRESSES[0],
    eventDate: '18 Agustus 2026',
    pickupDate: '17 Agustus 2026',
    returnDate: '19 Agustus 2026',
    status: 'confirmed',
    completedSteps: ['fitting', 'booking', 'payment', 'prepared'],
  },
]

export function formatPrice(amount: number): string {
  return `Rp${new Intl.NumberFormat('id-ID').format(amount)}`
}

export function getWhatsAppLink(message: string): string {
  return `https://wa.me/${6282225191311}?text=${encodeURIComponent(message)}`
}
