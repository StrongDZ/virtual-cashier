# Virtual Cashier Kiosk

A high-fidelity wireframe/prototype for a Virtual Cashier Kiosk web application designed for clothing stores. Built with React, TypeScript, and Tailwind CSS, optimized for large touch-screen kiosk displays.

## 🎯 Features

### Core Functionality

1. **Item Scanner** - Simulate scanning items and add them to cart
2. **Clothing Catalogue** - Browse products with filtering by category and size
3. **Multi-Modal Interaction** - Voice command interface (placeholder)
4. **Virtual Try-On** - Visual try-on interface for clothing items
5. **Loyalty Recognition** - Member recognition with personalized recommendations
6. **Loyalty Enrollment** - Simple signup form for new members
7. **Payment & Receipt** - Multiple payment methods with receipt options
8. **Return & Exchange** - Receipt scanning and item return flow
9. **Help & Support** - Chatbot interface with quick questions
10. **Rating & Feedback** - Star rating system with comment submission

## 🛠️ Tech Stack

-   **Framework:** React 19 + Vite + TypeScript
-   **Styling:** Tailwind CSS 3.4 (Mobile-first, optimized for kiosk screens)
-   **Icons:** Lucide React
-   **Routing:** React Router DOM v7
-   **State Management:** React Context API

## 🎨 Design Guidelines

-   **Interface Type:** Kiosk / Touch Screen optimized
-   **UI Style:** Large touch targets (min 60px), high contrast, clean layout
-   **Theme:** Professional Fashion Store
    -   Primary: Deep Navy (#1a1a2e)
    -   Accent: Gold (#d4af37)
    -   High contrast for accessibility

## 🚀 Getting Started

### Prerequisites

-   Node.js 18+ and npm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build

```bash
npm run build
```

## 📁 Project Structure

```
src/
├── components/       # Reusable components
│   ├── Layout.tsx    # Main layout with header/footer
│   ├── HelpModal.tsx # Help chatbot modal
│   ├── VoiceButton.tsx # Voice command button
│   └── VoiceModal.tsx # Voice command modal
├── context/          # React Context for state management
│   └── AppContext.tsx # Global app state (cart, user, receipts)
├── data/            # Mock data
│   └── MockData.ts  # Products, users, helper functions
└── pages/           # Page components
    ├── Home.tsx     # Home screen with loyalty recognition
    ├── Signup.tsx   # Membership enrollment
    ├── Scanner.tsx  # Item scanner
    ├── Catalogue.tsx # Product catalogue
    ├── TryOn.tsx   # Virtual try-on
    ├── Payment.tsx # Payment flow
    └── Return.tsx  # Return & exchange
```

## 🎮 Usage

### Simulating Member Recognition

-   On the Home screen, click "Simulate Member Approach" to see personalized recommendations
-   This simulates FaceID recognition (without actual camera)

### Adding Items to Cart

-   Navigate to "Start Checkout" (Scanner)
-   Click "Simulate Scan Item" to add random products
-   Adjust quantities or remove items
-   Proceed to payment

### Voice Commands

-   On Scanner or Catalogue pages, click the microphone icon (bottom left)
-   This opens the voice command interface (placeholder functionality)

### Testing Payment Flow

-   Add items to cart
-   Click "Pay Now"
-   Select payment method (Credit Card or FaceID)
-   Complete payment to see rating/feedback screen

## 📝 Notes

-   All data is mocked - no backend required
-   FaceID features are simulated with buttons
-   Voice commands are placeholder implementations
-   Optimized for large touch-screen displays (tablet/kiosk size)

## 🎨 Customization

Colors and theme can be customized in:

-   `tailwind.config.js` - Theme colors
-   `src/index.css` - Global styles and utility classes

## 📄 License

This is a prototype/wireframe project for demonstration purposes.
