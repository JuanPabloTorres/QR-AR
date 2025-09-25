# QR → AR Admin Panel

A modern Next.js application for managing augmented reality experiences with QR code generation.

## Features

- ✨ **Modern UI**: Glass morphism design with dark mode support
- 🎯 **AR Experiences**: Create and manage Video, Image, 3D Model, and Message experiences
- 📱 **QR Code Generation**: Automatic QR code generation and download
- 🔄 **Real-time Preview**: Live AR preview on mobile devices
- 📊 **Experience Management**: Full CRUD operations for AR experiences
- 🎨 **Responsive Design**: Optimized for desktop and mobile
- 🚀 **Performance**: Optimized with Next.js 14 and App Router

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: .NET 9 Minimal API with EF Core
- **AR**: A-Frame, MindAR
- **QR Codes**: qrcode library
- **UI**: Glass morphism design with smooth animations

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- .NET 9 SDK
- Modern browser with camera support (for AR)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd qr-ar-admin
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment setup**
   ```bash
   cp .env.example .env.local
   ```
   
   Configure your environment variables:
   ```env
   API_BASE_URL=http://localhost:5028
   NEXT_PUBLIC_API_URL=http://localhost:5028
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Start the .NET API server** (in separate terminal)
   ```bash
   # Navigate to your .NET API project
   dotnet run
   ```

### Usage

1. **Create Experience**: Navigate to `/experiences/new` to create a new AR experience
2. **Manage Experiences**: View all experiences at `/experiences`
3. **Generate QR Codes**: Download QR codes directly from the experience list or detail page
4. **Preview AR**: Use the generated QR codes to preview experiences on mobile devices

## API Integration

The frontend integrates with a .NET 9 Minimal API backend through Next.js API routes as proxies:

- `GET /api/experiences` - List all experiences
- `GET /api/experiences/{id}` - Get experience by ID
- `POST /api/experiences` - Create new experience
- `PUT /api/experiences/{id}` - Update experience
- `DELETE /api/experiences/{id}` - Delete experience

## AR Experience Types

- **Video** 📹: Display video content anchored to image targets
- **Image** 🖼️: Show images in augmented reality
- **3D Model** 🎯: Render 3D models (GLB/GLTF format)
- **Message** 💬: Display text messages in AR space

## QR Code Workflow

1. Create an AR experience with content URL
2. System automatically generates QR code pointing to `/ar/{experienceId}`
3. Users scan QR code with mobile camera
4. AR experience loads with camera permissions
5. Content appears when image target is detected

## Architecture

```
src/
├── app/                 # Next.js App Router pages
│   ├── api/            # API routes (proxy to .NET backend)
│   ├── ar/[id]/        # AR experience viewer
│   ├── experiences/    # Experience management
│   └── layout.tsx      # Root layout
├── components/         # React components
│   ├── ar/            # AR-specific components
│   ├── ui/            # Reusable UI components
│   └── layout/        # Layout components
├── hooks/             # Custom React hooks
├── lib/               # API client and utilities
├── types/             # TypeScript type definitions
└── utils/             # Helper functions
```

## Development

### Code Style

- **TypeScript**: Strict mode enabled
- **Naming**: Descriptive variable names, no abbreviations
- **Components**: Functional components with hooks
- **Styling**: Tailwind CSS with glass morphism design

### Authentication (Prepared)

The project includes prepared authentication hooks in `src/hooks/useAuth.tsx` ready for JWT implementation:

```typescript
// Future JWT integration
const { user, login, logout, isAuthenticated } = useAuth();
```

### Future Enhancements

- [ ] JWT Authentication implementation
- [ ] File upload for media assets
- [ ] Analytics and usage tracking
- [ ] Bulk QR code generation
- [ ] Experience templates
- [ ] Multi-language support

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes following the established patterns
4. Test thoroughly on both desktop and mobile
5. Submit a pull request

## License

This project is licensed under the MIT License.
