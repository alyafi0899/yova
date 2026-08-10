# PROMPT — YOVA SEWA BAJU AKAD BLANGKEJEREN

## Phase 1 — Customer-Facing Rental Website MVP

Build a modern, elegant, premium customer-facing website for **YOVA — Sewa Baju Akad Blangkejeren**.

The website is for a local bridal/akad outfit rental business. Its primary purpose is to let customers:

1. Discover available dress collections.
2. Understand each dress in detail before visiting.
3. Check rental availability.
4. Understand pricing, deposit, rental duration, and rental rules.
5. Schedule a fitting appointment.
6. Contact Yova through WhatsApp.

The website must feel like a **real premium bridal rental studio**, not a generic ecommerce store.

---

## 1. DESIGN DIRECTION

Create a sophisticated, minimal, elegant visual identity.

Style:

* Modern bridal boutique
* Premium but approachable
* Clean
* Warm
* Elegant
* Soft luxury
* Local Indonesian wedding context
* Strong photography focus

Avoid:

* Generic ecommerce appearance
* Excessive gradients
* Overuse of animations
* Cartoonish illustrations
* Excessive rounded cards
* Cheap-looking template aesthetics
* Too much text above the fold
* Dark luxury aesthetics that make the dresses difficult to see

The dress photography must remain the visual focus.

Use generous whitespace, refined typography, subtle borders, elegant hover states, and smooth transitions.

The website must be fully responsive:

* Desktop
* Tablet
* Mobile

Mobile experience is especially important because customers will likely access the website from WhatsApp links on their phones.

---

# 2. WEBSITE STRUCTURE

Create the following pages:

### Main Navigation

* Home
* Collection
* How It Works
* Check Rental
* FAQ
* Contact

Primary CTA:

**Jadwalkan Fitting**

Secondary CTA:

**Lihat Koleksi**

Keep the navigation simple and sticky.

---

# 3. HOME PAGE

The homepage should immediately communicate:

**What:** Rental baju akad
**Where:** Blangkejeren
**For whom:** Couples preparing for their akad/wedding
**What customers can do:** Browse, check availability, and schedule fitting

### Hero Section

Use a large, premium bridal image.

Headline:

**Baju Akad untuk Hari yang Berarti.**

Supporting text:

**Temukan koleksi baju akad, lihat detail ukuran dan kelengkapannya, cek ketersediaan, lalu jadwalkan fitting sebelum hari istimewa Anda.**

Buttons:

**Lihat Koleksi**

**Jadwalkan Fitting**

---

# 4. FEATURED COLLECTION

Show several featured dress cards.

Each card should contain:

* Dress image
* Collection code
* Dress name
* Category
* Rental price
* Availability status
* CTA: Lihat Detail

Example:

**PR-01**
Baju Akad Wanita
Rp XXX.000 / rental

Status:

🟢 Available

Do not invent final prices. Use clearly marked placeholder values until the actual pricing is configured.

---

# 5. COLLECTION PAGE

Create a complete catalog.

Allow filtering by:

### Category

* Semua
* Wanita
* Pria
* Couple

### Availability

* Available
* Booked
* Rented
* Maintenance

### Style

The style filter can remain hidden or disabled until actual style categories are defined.

Each product card must show:

* High-quality image
* Collection code
* Product name
* Price
* Current availability
* "Lihat Detail"

Do not expose private customer information.

---

# 6. DRESS DETAIL PAGE

This is one of the most important pages.

The customer should be able to understand almost everything necessary before deciding to come for fitting.

Create a premium product-detail layout.

## Image Gallery

Support:

* Front view
* Back view
* Side view
* Close-up fabric/detail
* Accessories
* Dress worn by model/customer when available

Features:

* Large hero image
* Thumbnail gallery
* Fullscreen image viewer
* Zoom
* Smooth image transitions

Photography must dominate the layout.

---

# 7. PRODUCT INFORMATION

Every dress detail page must contain:

### Basic Information

* Collection code
* Dress name
* Category
* Description
* Rental price
* Deposit
* Rental period
* Current availability

Example:

**PR-01 — Baju Akad Wanita**

**Rental:** Rp XXX.000
**Deposit:** Rp150.000

Clearly explain:

> Deposit adalah uang jaminan dan bukan biaya sewa. Deposit dikembalikan setelah barang diperiksa, selama tidak terdapat kerusakan, noda permanen, atau kehilangan kelengkapan.

Do not change the deposit amount from Rp150.000 unless configured by the business owner.

---

# 8. INCLUDED ITEMS

Clearly display everything included with the rental.

Possible items:

* Dress
* Veil
* Bros / pin
* Songket
* Pashmina
* Peci
* Garment bag

Do not claim an item is included for a particular collection unless it is actually configured for that collection.

Use a visual checklist.

Example:

✓ Dress
✓ Veil
✓ Bros
✓ Songket
✓ Garment Bag

---

# 9. SIZE & FIT INFORMATION

This section is extremely important.

Show detailed measurements when available:

* Lingkar dada
* Lebar dada
* Lebar bahu
* Lingkar pinggang
* Lingkar pinggul
* Panjang baju
* Panjang lengan
* Lingkar lengan
* Tinggi badan

Create a clean measurement table.

Also provide:

### Fit Notes

Examples:

* Recommended height
* Recommended body range
* Fit type
* Minor resize availability

Do not invent measurements.

Use placeholder data where real measurements have not yet been provided.

---

# 10. RESIZE INFORMATION

Clearly explain whether minor resizing is available.

Example:

### Penyesuaian Ukuran

**Minor resize tersedia berdasarkan hasil fitting.**

Possible adjustments can include:

* Length
* Sleeve
* Waist
* Shoulder

Do not promise major alterations unless explicitly configured by the business owner.

The fitting process must remain the final confirmation of whether the dress fits.

---

# 11. AVAILABILITY

Every dress must have an availability section.

Create a visual calendar.

The customer can select an intended event date.

The interface should show:

🟢 Available
🔴 Unavailable
🟡 Maintenance / preparation

When unavailable, show useful information such as:

**Sedang disewa**

**Diperkirakan tersedia kembali: 19 Agustus 2026**

Do not reveal the identity or personal information of the current renter.

Important:

A dress being available today does NOT automatically mean it is available for the customer's event date.

Availability must be date-based.

---

# 12. RENTAL PERIOD

Clearly explain the current rental policy:

### Pengambilan

Paling cepat **H-1 sebelum acara**

### Acara

Hari H

### Pengembalian

Paling lambat **H+1 setelah acara**

Visualize this as a timeline:

**H-1 → Hari Acara → H+1**

Do not invent additional rental days.

---

# 13. HOW IT WORKS PAGE

Create a dedicated page explaining the entire rental process.

Use a clear 9–10 step visual timeline.

### 01 — Pilih Koleksi

Browse the available collections.

### 02 — Cek Jadwal

Check whether the dress is available for the intended event date.

### 03 — Jadwalkan Fitting

Choose an available fitting date/time.

### 04 — Fitting

Try the selected collection.

### 05 — Konfirmasi

Choose the final collection after fitting.

### 06 — Pembayaran + Deposit

Complete the rental payment and Rp150.000 deposit.

### 07 — Booking Locked

The rental booking is confirmed after the required payment process is completed.

### 08 — Pickup

The outfit can be collected starting H-1.

### 09 — Return

Return the outfit no later than H+1.

### 10 — Inspection & Deposit Refund

The outfit is inspected. The deposit is returned according to the rental agreement if the outfit and accessories are returned properly.

The flow should visually communicate:

**Browse → Fitting → Booking → Rental → Return**

---

# 14. FITTING BOOKING PAGE

Create a simple appointment form.

Fields:

### Customer Information

* Full name
* WhatsApp number

### Event Information

* Event date
* Event type

### Fitting

* Preferred fitting date
* Preferred fitting time
* Selected dress / collection code

Optional:

* Second-choice collection
* Notes

CTA:

**Ajukan Jadwal Fitting**

After submission, show:

**Permintaan fitting berhasil dikirim.**

Status:

**Menunggu konfirmasi**

Do NOT pretend that the fitting is automatically confirmed unless an actual booking backend is implemented.

---

# 15. FITTING INFORMATION

Before submitting the appointment, show:

### Sebelum Fitting

* Bring the information about your event date.
* Know your approximate measurements if available.
* Arrive according to the confirmed appointment.
* Bring references for your desired look if needed.

Do not invent a fitting duration unless configured later.

---

# 16. CHECK RENTAL PAGE

Create a customer-facing rental tracking page.

Customer can search using:

* Booking ID
* WhatsApp number

Show a timeline such as:

✓ Fitting
✓ Booking
✓ Payment
✓ Prepared
→ Pickup
→ Event
→ Return
→ Inspection
→ Deposit Refund

Example:

**Booking YV-0012**

Dress:
**PR-01**

Event:
**18 August 2026**

Pickup:
**17 August 2026**

Return:
**19 August 2026**

Status:

**Confirmed**

If no backend exists yet, build the UI and mock state only. Clearly structure the code so it can later connect to a real database.

---

# 17. PUBLIC DRESS STATUS

Dress cards and detail pages must show status.

Possible statuses:

### Available

"Available untuk tanggal yang dipilih."

### Booked

"Sudah dipesan untuk tanggal tertentu."

### Rented

"Sedang disewa."

Show:

**Estimated available: [date]**

### Maintenance

"Sedang dalam proses perawatan."

Never expose:

* Customer name
* Customer phone number
* Private booking information

---

# 18. PRICING SECTION

Make the pricing extremely transparent.

Example:

Rental:
**Rp500.000**

Deposit:
**Rp150.000**

Total payment:
**Rp650.000**

Clearly separate:

**Rental Fee**

from

**Refundable Deposit**

Do not call the deposit revenue.

Use configurable values rather than hardcoded pricing throughout the application.

---

# 19. FAQ PAGE

Include questions such as:

### Berapa lama masa sewa?

Pengambilan paling cepat H-1 dan pengembalian paling lambat H+1.

### Berapa deposit?

Rp150.000.

### Kapan deposit dikembalikan?

Maksimal 1×24 jam setelah pemeriksaan kondisi barang.

### Apakah bisa resize?

Minor resize dapat dilakukan berdasarkan hasil fitting.

### Apakah boleh mencuci sendiri?

Tidak, kecuali mendapat izin dari pemilik.

### Bagaimana jika barang rusak?

Kerusakan ringan dapat diperhitungkan dari deposit sesuai biaya perbaikan. Kerusakan berat atau kehilangan dapat dikenakan biaya penggantian sesuai ketentuan sewa.

Do not invent cancellation fees, late fees, or other policies that have not yet been defined.

---

# 20. RENTAL POLICY PAGE

Create a clean policy page containing:

* Rental duration
* Pickup
* Return
* Deposit
* Damage
* Lost accessories
* Cleaning restrictions
* Resize
* Customer responsibilities
* Owner responsibilities

The policy must be consistent with the rental agreement.

Important existing rules:

* Deposit: Rp150.000
* Pickup: earliest H-1
* Return: latest H+1
* Customer must maintain the condition of the outfit.
* Customer must not permanently alter the outfit without permission.
* Customer must not wash the rented outfit without permission.
* All included accessories must be returned.
* Deposit refund occurs after condition inspection.
* Minor damage can be deducted from the deposit.
* Major damage/loss can require additional compensation.

---

# 21. WHATSAPP CTA

Every important customer decision should have an obvious WhatsApp action.

Examples:

**Tanya tentang koleksi ini**

**Jadwalkan Fitting**

**Tanya Availability**

Generate a pre-filled WhatsApp message containing:

* Collection code
* Dress name
* Intended event date

Example:

"Hallo Yova, saya tertarik dengan PR-01 untuk acara tanggal [DATE]. Saya ingin mengecek ketersediaan dan jadwal fitting."

Do not invent the actual WhatsApp number. Make it configurable.

---

# 22. CONTACT PAGE

Include:

* Yova
* Blangkejeren
* WhatsApp
* Location
* Operating/fitting hours
* Google Maps link placeholder
* Instagram/social links placeholder

Do not invent address or contact details.

---

# 23. LOOKBOOK

Create a simple section/page for real customer photos.

Structure:

* Customer photo
* Collection code
* Short caption

Only display customer photos when proper permission has been obtained.

If there are no real photos yet, use temporary placeholders and clearly separate them from actual customer content.

---

# 24. UX REQUIREMENTS

The entire website should answer these questions before a customer contacts Yova:

1. What dress options are available?
2. How much does it cost?
3. What is included?
4. What size is it?
5. Will it likely fit me?
6. Can it be resized?
7. Is it available on my event date?
8. How long can I rent it?
9. How much deposit do I need?
10. What happens if I damage it?
11. How do I schedule fitting?
12. Where is the fitting location?
13. What happens after I book?

If the website cannot answer these questions, the information architecture is incomplete.

---

# 25. TECHNICAL ARCHITECTURE

Build the website so it can later evolve into a complete rental management system.

Use a clean data model for:

### Dress

* id
* collectionCode
* name
* category
* description
* price
* deposit
* images
* measurements
* includedItems
* resizeAvailable
* status

### Availability

* dressId
* eventDate
* bookingStatus
* rentalStart
* rentalEnd
* maintenanceEnd

### Fitting

* id
* customerName
* whatsapp
* eventDate
* preferredDate
* preferredTime
* selectedDress
* status

### Rental

* bookingId
* customer
* dress
* eventDate
* pickupDate
* returnDate
* rentalPrice
* deposit
* status

Use mock/local data for Phase 1 if a backend has not yet been selected.

However, structure the components and data models so a backend can be connected later without rebuilding the entire UI.

---

# 26. IMPORTANT BUSINESS RULES

Do not invent business information.

Use these known rules:

* Deposit = Rp150.000
* Pickup earliest = H-1
* Return latest = H+1
* Minor resizing may be available depending on fitting result.
* Deposit is refundable after inspection if conditions are fulfilled.
* Damage/loss can result in deposit deductions or additional compensation.
* Included accessories must be returned.
* Customers cannot wash or permanently alter the rented outfit without permission.

Any information not yet defined must be represented as configurable data or placeholder content.

---

# 27. PHASE 1 SCOPE

DO NOT build these yet:

* Admin dashboard
* Complex authentication
* Online payment gateway
* Automated deposit refund
* Advanced inventory management
* Staff management
* Financial dashboard
* Automated WhatsApp messaging
* Full database synchronization

Those belong to later phases.

Phase 1 is focused on:

**DISCOVERY → PRODUCT INFORMATION → AVAILABILITY → FITTING REQUEST → RENTAL EDUCATION → CUSTOMER CONTACT**

---

# 28. FINAL UX GOAL

The customer journey should feel like this:

**I discover Yova**

↓

**I browse the collection**

↓

**I find a dress I like**

↓

**I see beautiful photos**

↓

**I understand the measurements**

↓

**I know what is included**

↓

**I understand the price and deposit**

↓

**I check my event date**

↓

**I understand the rental timeline**

↓

**I schedule a fitting**

↓

**I know exactly what will happen next**

The website should make the customer feel **prepared and confident before visiting the studio**.

The website is not just an online catalog.

It is the **first step of the Yova rental experience**.
