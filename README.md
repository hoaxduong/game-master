# Game Master

A modern web application for managing party games, with a primary focus on the popular social deduction game **Werewolf**.

## Features

- **Werewolf Game Module**:
  - Comprehensive role management (Seer, Witch, Hunter, Cupid, Village Idiot, etc.)
  - Automated Night Phase logic and resolution
  - Dynamic player management and role assignment
  - smart suggestions for role distribution based on player count
- **Session Management**: Seamlessly resume game sessions with URL-based routing and local storage persistence.
- **Internationalization (i18n)**: Full support for English and Vietnamese languages.
- **Modern UI/UX**: A responsive, mobile-first design featuring dark mode, built with Shadcn UI and TailwindCSS.

## Tech Stack

- **Framework**: [Astro](https://astro.build/) - For fast, content-focused web applications.
- **UI Library**: [React](https://react.dev/) - For interactive UI components.
- **Styling**: [TailwindCSS](https://tailwindcss.com/) - For utility-first CSS styling.
- **Components**: [Shadcn UI](https://ui.shadcn.com/) - For accessible and customizable components.
- **State Management**: [Nanostores](https://github.com/nanostores/nanostores) - For lightweight and framework-agnostic state management.
- **Database/ORM**: [Drizzle ORM](https://orm.drizzle.team/) - For type-safe database interactions (configured for Cloudflare D1).
- **Deployment**: Optimized for Cloudflare Pages.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [pnpm](https://pnpm.io/) (Variable package manager)

### Installation

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   cd game-master
   ```

2. **Install dependencies:**

   ```bash
   pnpm install
   ```

3. **Start the development server:**

   ```bash
   pnpm dev
   ```

4. **Open the app:**
   Navigate to `http://localhost:4321` in your browser.

## Database Management

The project uses Drizzle ORM. To manage your database schema:

- **Generate migrations:**
  ```bash
  pnpm drizzle-kit generate
  ```
- **Push schema changes:**
  ```bash
  pnpm drizzle-kit push
  ```

## Deployment

This project is configured for deployment on **Cloudflare Pages**.

1. **Connect to Cloudflare Pages:**
   - Log in to your Cloudflare dashboard.
   - Go to **Workers & Pages** > **Create Application** > **Pages** > **Connect to Git**.
   - Select your repository.

2. **Configure Build Settings:**
   - **Framework Preset:** Astro
   - **Build Command:** `pnpm build`
   - **Build Output Directory:** `dist`

3. **Environment Variables:**
   - Add any necessary environment variables in the Cloudflare Pages settings (e.g., database credentials if not using D1 binding directly).

4. **Clouflare D1 Database Binding:**
   - Ensure your Cloudflare Pages project is bound to your D1 database.
   - In your Pages project settings, go to **Settings** > **Functions** > **D1 Database Bindings**.
   - Bind `DB` to your D1 database ID.

## Project Structure

- `src/modules/werewolf`: Contains all logic, components, and state specific to the Werewolf game.
- `src/layouts`: Application layout components (e.g., `Layout.astro`).
- `src/pages`: File-based routing for the Astro application.
- `src/components`: Shared UI components.
- `src/i18n`: Internationalization configuration and translation files.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
