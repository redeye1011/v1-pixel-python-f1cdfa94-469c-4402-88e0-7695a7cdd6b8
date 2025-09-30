# Pixel Python

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/redeye1011/pixphy)

A retro-themed, timed snake game with strategic power-ups and a high-score challenge.

Pixel Python is a timed, retro-style snake game that challenges players to achieve the highest score within a 3-minute limit. The gameplay revolves around classic snake mechanics—eating food to grow longer while avoiding collisions—but with a strategic layer of powerful boosts. The game features a distinct 'Retro' aesthetic, characterized by pixel art, a neon color palette on a dark background, glitch effects, and 8-bit sound effects, evoking the feel of 90s arcade games.

## Key Features

-   **Timed Challenge:** Race against a 180-second clock to maximize your score.
-   **Retro Aesthetics:** A nostalgic experience with pixel art, a neon color palette, and 8-bit sounds.
-   **Strategic Boosts:** Master five unique, game-altering power-ups:
    -   **Chrono-Brake [S]:** Slows down time for precise movements.
    -   **Pixel Rush [»]:** Doubles speed for high-risk, high-reward point bonuses.
    -   **Glitch Multiplier [x2]:** Doubles all points scored while active.
    -   **Phase Shift [░]:** Become intangible, passing through walls and your own tail.
    -   **Fruit Fiesta [!!!]:** Instantly spawns a cluster of food for quick points.
-   **High Score Ranks:** Climb the ladder from "Pixel Pilot" to "Glitch God".
-   **Responsive Controls:** Simple and intuitive four-directional movement.

## Technology Stack

-   **Framework:** React (with Vite)
-   **State Management:** Zustand
-   **Styling:** Tailwind CSS
-   **Animation:** Framer Motion
-   **Audio:** Howler.js
-   **Icons:** Lucide React
-   **Deployment:** Cloudflare Pages & Workers

## Getting Started

Follow these instructions to get a local copy up and running for development and testing purposes.

### Prerequisites

You need to have [Bun](https://bun.sh/) installed on your machine.

### Installation

1.  Clone the repository to your local machine:
    ```sh
    git clone https://github.com/your-username/pixel_python.git
    ```
2.  Navigate into the project directory:
    ```sh
    cd pixel_python
    ```
3.  Install the dependencies using Bun:
    ```sh
    bun install
    ```

## Development

To run the development server, use the following command. This will start the application on `http://localhost:3000`.

```sh
bun run dev
```

The server supports hot-reloading, so any changes you make to the source code will be reflected in the browser instantly.

## Deployment

This project is configured for seamless deployment to Cloudflare.

1.  **Log in to Cloudflare:**
    If you haven't already, log in to your Cloudflare account through the Wrangler CLI.
    ```sh
    wrangler login
    ```
2.  **Deploy the application:**
    Run the deploy script. This will build the project and deploy it to your Cloudflare account.
    ```sh
    bun run deploy
    ```

Alternatively, you can deploy your own version of this project with a single click.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/redeye1011/pixphy)