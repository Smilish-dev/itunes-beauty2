import './globals.css'
export const metadata = { title: 'Itunes Beauty | Hair braiding in Oye Ekiti', description: 'Braids, cornrows and Fulani styles in Oye Ekiti. Book on TikTok.' }
export default function Layout({ children }) {
  return (<html lang="en"><head><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,700;9..144,800&family=DM+Sans:wght@400;500;700&display=swap" /></head><body>{children}</body></html>)
}
