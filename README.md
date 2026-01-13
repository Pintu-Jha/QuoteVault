# QuoteVault 🔐

A beautiful, dark-themed React Native app for managing and discovering quotes.

## � Quick Start

1.  **Clone & Install**
    ```bash
    git clone https://github.com/Pintu-Jha/QuoteVault.git
    cd QuoteVault
    npm install
    ```

2.  **Environment Setup**
    Create a `.env` file in the root directory (copied from `.env.example` if available) and add your Supabase keys:
    ```env
    SUPABASE_URL=your_supabase_url
    SUPABASE_ANON_KEY=your_supabase_anon_key
    ```

3.  **Run the App**
    *   **Android**: `npm run android`
    *   **iOS**: `npm run ios`

## 🌟 Key Features

*   **Discover**: Browse quotes by category (Motivation, Wisdom, etc.) and get a "Quote of the Day".
*   **Organize**: Save favorites and create custom collections.
*   **Seed Database**: Easily populate your app with initial data via **Settings > Developer > Seed Database**.
*   **Offline First**: Works seamlessly without internet.

## 🛠 Tech Stack

*   React Native (CLI)
*   Supabase (Backend)
*   Redux Toolkit (State)
*   TypeScript

## ⚠️ Troubleshooting

If you see `@env` resolution errors, clear the cache:
```bash
npm start -- --reset-cache
```
