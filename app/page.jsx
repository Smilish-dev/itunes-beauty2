import { sb } from '../lib/supabase'
import { DEFAULTS, SEED_PHOTOS, SEED_SERVICES, SEED_PRODUCTS } from '../lib/defaults'
import Ring from './Ring'
export const dynamic = 'force-dynamic'
export default async function Home() {
  const [s, g, c, pr] = await Promise.all([sb.from('ib_services').select('*').order('sort').order('created_at'), sb.from('ib_gallery').select('*').order('created_at', { ascending: false }), sb.from('ib_settings').select('*'), sb.from('ib_products').select('*').order('sort').order('created_at')])
  const cfg = { ...DEFAULTS, ...Object.fromEntries((c.data || []).filter(r => r.value).map(r => [r.key, r.value])) }
  const photos = g.data && g.data.length ? g.data : SEED_PHOTOS
  const services = s.data && s.data.length ? s.data : SEED_SERVICES
  const products = pr.data && pr.data.length ? pr.data : SEED_PRODUCTS
  const wa = cfg.whatsapp.replace(/\D/g, '')
  const book = wa ? `https://wa.me/${wa}?text=${encodeURIComponent('Hi, I want to book an appointment at Itunes Beauty.')}` : cfg.tiktok
  return (<>
    <header className="hero"><div className="wrap">
      <div>{cfg.owner_photo && <div className="me"><img className="avatar" src={cfg.owner_photo} alt={cfg.owner_name || 'Your stylist'} /><span>{cfg.owner_name ? `Hi, I'm ${cfg.owner_name}` : 'Meet your stylist'}</span></div>}<div className="brand">Itunes Beauty</div><h1>{cfg.hero_title}</h1><p className="lead">{cfg.hero_lead}</p>
        <a className="btn" href={book} target="_blank" rel="noopener">{wa ? 'Book on WhatsApp' : 'Book on TikTok'}</a>
        {wa && <a className="btn alt" href={cfg.tiktok} target="_blank" rel="noopener">TikTok</a>}</div>
      <Ring images={photos.map(p => p.image_url)} />
    </div></header>
    <main className="wrap">
      {(cfg.owner_photo || cfg.about) && <section id="about"><div className="about">{cfg.owner_photo && <img src={cfg.owner_photo} alt={cfg.owner_name || 'Your stylist'} />}<div><h2>{cfg.owner_name ? `About ${cfg.owner_name}` : 'About us'}</h2><p className="bio">{cfg.about}</p></div></div></section>}
      <section id="services"><h2>Our services</h2><p className="sub">Pick a style, or send us a photo of what you want.</p>
        <div className="svc">{services.map((x, i) => (<div className="s" key={x.id || i}>{x.image_url && <img loading="lazy" alt={x.name} src={x.image_url} />}<div><h3>{x.name}</h3><p>{x.description}</p>{x.price && <b className="price">{x.price}</b>}<div><a className="btn" href={wa ? `https://wa.me/${wa}?text=${encodeURIComponent('Hi, I want to book: ' + x.name)}` : cfg.tiktok} target="_blank" rel="noopener">Book</a></div></div></div>))}</div></section>
      <section id="products"><h2>Hair care products</h2><p className="sub">Made for your braids and your scalp. Message us to order.</p>
        <div className="prods">{products.map((x, i) => (<div className="prod" key={x.id || i}>{x.image_url ? <img loading="lazy" alt={x.name} src={x.image_url} /> : <div className="pimg" />}<div className="pb"><h3>{x.name}</h3><p>{x.description}</p>{x.price && <b className="price">{x.price}</b>}
          <a className="btn" href={wa ? `https://wa.me/${wa}?text=${encodeURIComponent('Hi, I want to order: ' + x.name)}` : cfg.tiktok} target="_blank" rel="noopener">Order</a></div></div>))}</div></section>
      <section id="how"><h2>How booking works</h2><p className="sub">Simple and quick.</p><div className="steps">
        <div className="st"><b>1</b><h3>Pick a style</h3><p>Choose from our services and photos, or send us a picture of what you want.</p></div>
        <div className="st"><b>2</b><h3>Message us</h3><p>Send us a message on {wa ? 'WhatsApp' : 'TikTok'} and we will confirm your slot.</p></div>
        <div className="st"><b>3</b><h3>Come in</h3><p>Visit us in {cfg.location.split(',')[0]} and leave with your new look.</p></div></div></section>
      <section id="work"><h2>Recent styles</h2><p className="sub">Real work from our chair.</p>
        <div className="gal">{photos.map((p, i) => <div className="card" key={p.id || i}><img loading="lazy" alt={p.caption || 'Braid style'} src={p.image_url} /></div>)}</div></section>
      <section><div className="info"><div className="box"><h3>Find us</h3><p>{cfg.location}</p>{cfg.hours && <><h3 className="h2">Opening hours</h3><p className="bio">{cfg.hours}</p></>}</div>
        <div className="box"><h3>Ready to book?</h3><p>Message us the style you want and we will reply with the next open slot.</p>
          <a className="btn" href={book} target="_blank" rel="noopener">{wa ? 'Message us on WhatsApp' : 'Message us on TikTok'}</a>
          {wa && <a className="btn alt" href={cfg.tiktok} target="_blank" rel="noopener">TikTok</a>}
          {cfg.instagram && <a className="btn alt" href={cfg.instagram} target="_blank" rel="noopener">Instagram</a>}</div></div></section>
    </main><footer>© 2026 Itunes Beauty · {cfg.location.split(',')[0]}</footer></>)
}
