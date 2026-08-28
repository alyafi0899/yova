# Wedding E-Invitation System Reconstruction Plan

This plan outlines the complete removal of the existing legacy e-invitation system and the implementation of a new, premium **Wedding E-Invitation Template Marketplace** with advanced interactive and 3D parallax features.

## User Review Required

- **Cleanup Confirmation**: I will be deleting files in `src/pages/invitation`, `src/components/invitation`, and `src/lib/invitation`. Confirm if any specific logic from the old system needs to be salvaged (otherwise, all will be removed).
- **Interactive Features**: The new system will focus heavily on mobile-first interactive storytelling.

## Proposed Changes

### 1. Cleanup Phase (RESET)

#### [App.tsx](file:///D:/Code/yova/src/App.tsx)
- Remove all invitation-related routes.
- Remove "Undangan Digital" links from Navbar and Footer temporarily until the new landing page is ready.

#### [DELETE] invitation pages
- `src/pages/invitation/` (All files: Landing, Templates, Auth, Dashboard, Builder, PublicInvitation, Publish, RSVPDashboard, Admin)

#### [DELETE] invitation components
- `src/components/invitation/` (All files and subdirectories)

#### [DELETE] invitation libraries
- `src/lib/invitation/` (All files and subdirectories)

---

### 2. Remake Phase (NEW SYSTEM)

### [Data Architecture]
- **Tiers**: Define `FREE`, `INTERACTIVE`, `PARALLAX`, `CUSTOM`.
- **Schema**: Create a new flexible schema for multi-layer parallax sections and interactive triggers.

### [Marketplace UI]
- **New Marketplace**: A high-end editorial-style gallery in `src/pages/invitation/Marketplace.tsx`.
- **Tiered Badging**: Distinct visual treatments for each pricing category.

### [Advanced Editor]
- **Canva-like Interface**: Three-panel layout (Tools, Canvas, Properties).
- **Layer Manager**: Dedicated UI for managing 3D depths and animation speeds.

### [Interactive Renderer]
- **Motion Engine**: Using Framer Motion for high-performance parallax and transitions.
- **Mobile-First**: The renderer will be optimized for the 9:16 aspect ratio typically seen on mobile devices.

## Verification Plan

### Automated Tests
- `npm run build` to ensure no broken references remain after cleanup.

### Manual Verification
- Verify the `App.tsx` loads correctly without invitation routes.
- Step-by-step verification of the new Marketplace UI and Editor as they are implemented.
