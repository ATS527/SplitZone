# SplitZone

SplitZone is a modern React Native application designed for splitting group expenses. Built with Expo and powered by Convex for the backend, it offers a seamless experience for managing shared costs.

## 🚀 Tech Stack

- **Framework:** [React Native](https://reactnative.dev/) with [Expo](https://expo.dev/) (SDK 54)
- **Routing:** [Expo Router](https://docs.expo.dev/router/introduction/) (v6) - File-based routing
- **Backend & Database:** [Convex](https://www.convex.dev/) - Real-time backend as a service
- **Styling:** [NativeWind](https://www.nativewind.dev/) (Tailwind CSS)
- **Authentication:** Convex Auth
- **Icons:** Lucide React Native
- **Linting & Formatting:** Biome, ESLint

## 🛠️ Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (LTS recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Expo Go](https://expo.dev/client) app on your mobile device (iOS/Android) or an emulator.

## 📦 Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd SplitZone
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Setup Convex Backend:**
   Initialize and sync your Convex backend project:
   ```bash
   npx convex dev
   ```
   Follow the prompts to log in and configure your project.

## 🏃‍♂️ Running the App

1. **Start the development server:**
   ```bash
   npm start
   # or
   npx expo start
   ```

2. **Open the app:**
   - **Mobile:** Scan the QR code with the Expo Go app (Android) or Camera app (iOS).
   - **Emulator:** Press `a` for Android or `i` for iOS simulator (requires setup).
   - **Web:** Press `w` to run in the browser.

## 📂 Project Structure

```
SplitZone/
├── app/                  # Expo Router file-based routes
│   ├── (authed)/         # Protected routes (Home, Groups, Settings)
│   ├── (public)/         # Public routes (Login, etc.)
│   └── _layout.tsx       # Root layout
├── components/           # Reusable UI components
├── convex/               # Backend functions (queries, mutations) and schema
├── assets/               # Images and fonts
├── global.css            # Global Tailwind CSS styles
└── package.json          # Dependencies and scripts
```

## ✨ Features

- **User Authentication:** Secure login and session management via Convex Auth.
- **Group Management:** Create new groups or join existing ones using invite codes.
- **Real-time Updates:** Instant improvements and data syncing powered by Convex.
- **Modern UI:** Clean and responsive interface built with NativeWind.

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.
