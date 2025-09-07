# Social Media Platform

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app), built as a modern social media platform with advanced features.

## Key Features

### ✅ Completed
- **User Authentication**: Optimized login and registration system
- **Post Management**: Create posts, comments, and likes functionality
- **Advanced Search**: Search with infinite scroll pagination
- **Responsive Design**: Optimized for all devices

### 🔧 In Development
- **Enhanced Security**: Encryption for login and registration data
- **Real-time Chat**: Live messaging system
- **Real-time Notifications**: Instant updates
- **Groups & Communities**: Social community features

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm/yarn/pnpm/bun

### Local Development

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

### Testing

Run the test suite:

```bash
npm test
```

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Backend API**: [Backend Documentation](https://test-beincom-be.onrender.com/api)
- **Database**: Supabase
- **Styling**: Tailwind CSS (assumed)
- **Font Optimization**: [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) with Inter Google Font

## Deployment

### Vercel (Recommended)
The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## API Integration

- **Backend API**: https://test-beincom-be.onrender.com/api
- **Database**: Supabase for data storage and real-time features

## Project Structure

```
├── app/
│   ├── page.tsx          # Home page
│   ├── auth/             # Authentication pages
│   ├── posts/            # Post-related pages
│   └── search/           # Search functionality
├── components/           # Reusable components
├── lib/                 # Utilities and configurations
└── public/              # Static assets
```

## Development Roadmap

### Phase 1: Core Features ✅
- [x] User authentication
- [x] Post creation and management
- [x] Comment system
- [x] Like functionality
- [x] Search with pagination

### Phase 2: Enhanced Security 🔧
- [ ] Advanced encryption for user data
- [ ] Two-factor authentication
- [ ] Password strength validation
- [ ] Rate limiting

### Phase 3: Real-time Features 🔧
- [ ] Live chat system
- [ ] Real-time notifications
- [ ] Live post updates
- [ ] Online status indicators

### Phase 4: Community Features 🔧
- [ ] Groups creation and management
- [ ] Community forums
- [ ] Event planning
- [ ] User roles and permissions

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial
- [Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.