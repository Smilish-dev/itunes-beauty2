'use client'
import { useEffect, useState } from 'react'
import { sb } from '../../lib/supabase'
import { DEFAULTS, SEED_PHOTOS, SEED_SERVICES, SEED_PRODUCTS } from '../../lib/defaults'
const up = async file => { const path = `${Date.now()}-${file.name.replace(/[^\w.]/g, '_')}`; const { error } = await sb.storage.from('ib-photos').upload(path, file); if (error) throw error; return sb.storage.from('ib-photos').getPublicUrl(path).data.publicUrl }
const chk = r => { if (r.error) throw r.error }
function Manager({ table, title }) {
  const [items, setItems] = useState([]), [n, setN] = useState({ name: '', description: '', price: '', file: null }), [m, setM] = useState('')
  const load = async () => { const r = await sb.from(table).select('*').order('created_at'); setItems(r.data || []) }
  useEffect(() => { load() }, [])
  const run = async (f, done) => { setM('Working...'); try { await f(); await load(); setM(done) } catch (e) { setM('Error: ' + (e.message || e)) } }
  const set = k => e => setN({ ...n, [k]: e.target.value })
  return (<section><h3>{title}</h3><p className="msg">{m}</p>
    {items.map(x => <div className="row" key={x.id}>{x.image_url && <img src={x.image_url} alt="" />}<span><b>{x.name}</b> {x.price}{x.sold_out ? ' (SOLD OUT)' : ''}</span>{table === 'ib_products' && <button className="btn alt" onClick={() => run(async () => chk(await sb.from(table).update({ sold_out: !x.sold_out }).eq('id', x.id)), x.sold_out ? 'Back in stock' : 'Marked sold out')}>{x.sold_out ? 'In stock' : 'Sold out'}</button>}<button className="btn alt" onClick={() => confirm('Delete?') && run(async () => chk(await sb.from(table).delete().eq('id', x.id)), 'Deleted')}>Delete</button></div>)}
    <p className="sub">Add new</p><input placeholder="Name" value={n.name} onChange={set('name')} /><input placeholder="Description" value={n.description} onChange={set('description')} /><input placeholder="Price (e.g. ₦5,000)" value={n.price} onChange={set('price')} /><input type="file" accept="image/*" onChange={e => setN({ ...n, file: e.target.files[0] })} />
    <button className="btn" onClick={() => n.name && run(async () => { const image_url = n.file ? await up(n.file) : null; chk(await sb.from(table).insert({ name: n.name, description: n.description, price: n.price, image_url })); setN({ name: '', description: '', price: '', file: null }) }, 'Added')}>Add</button></section>)
}
export default function Admin() {
  const [ok, setOk] = useState(null), [em, setEm] = useState(''), [pw, setPw] = useState(''), [msg, setMsg] = useState('')
  const [cfg, setCfg] = useState(DEFAULTS), [svc, setSvc] = useState([]), [ver, setVer] = useState(0), [gal, setGal] = useState([]), [n, setN] = useState({ name: '', description: '', price: '', file: null })
  const load = async () => { const [a, b, c] = await Promise.all([sb.from('ib_settings').select('*'), sb.from('ib_services').select('*').order('created_at'), sb.from('ib_gallery').select('*').order('created_at', { ascending: false })])
    setCfg({ ...DEFAULTS, ...Object.fromEntries((a.data || []).map(r => [r.key, r.value])) }); setSvc(b.data || []); setGal(c.data || []) }
  useEffect(() => { sb.auth.getSession().then(({ data }) => { setOk(!!data.session); data.session && load() }) }, [])
  const run = async (f, done = 'Saved') => { setMsg('Working...'); try { await f(); await load(); setMsg(done) } catch (e) { setMsg('Error: ' + (e.message || e)) } }
  const login = async e => { e.preventDefault(); const { error } = await sb.auth.signInWithPassword({ email: em, password: pw }); if (error) return setMsg(error.message); setOk(true); load() }
  if (ok === null) return <p className="wrap">Loading...</p>
  if (!ok) return (<main className="wrap adm"><h2>Admin login</h2><form onSubmit={login}><input type="email" placeholder="Email" value={em} onChange={e => setEm(e.target.value)} required /><input type="password" placeholder="Password" value={pw} onChange={e => setPw(e.target.value)} required /><button className="btn">Log in</button></form><p>{msg}</p></main>)
  const F = ([k, label]) => <label key={k}>{label}{['about', 'hours', 'hero_lead'].includes(k) ? <textarea value={cfg[k] || ''} onChange={e => setCfg({ ...cfg, [k]: e.target.value })} /> : <input value={cfg[k] || ''} onChange={e => setCfg({ ...cfg, [k]: e.target.value })} />}</label>
  return (<main className="wrap adm">
    <div className="row"><h2>Admin</h2><a href="/">View site</a><button className="btn alt" onClick={async () => { await sb.auth.signOut(); setOk(false) }}>Log out</button></div><p className="msg">{msg}</p>
    <section><h3>Owner photo</h3><div className="row me">{cfg.owner_photo && <img className="avatar" src={cfg.owner_photo} alt="" />}<span>Profile picture shown in the top section and About</span></div><input type="file" accept="image/*" onChange={e => e.target.files[0] && run(async () => { const url = await up(e.target.files[0]); chk(await sb.from('ib_settings').upsert({ key: 'owner_photo', value: url })) }, 'Photo updated')} /></section>
    <section><h3>Site details</h3>{[['hero_title', 'Headline'], ['hero_lead', 'Intro text'], ['owner_name', 'Owner name'], ['about', 'About text (a short story about you and your work)'], ['hours', 'Opening hours (one line per day)'], ['tiktok', 'TikTok link'], ['whatsapp', 'WhatsApp number (e.g. 2348012345678)'], ['instagram', 'Instagram link (optional)'], ['location', 'Location']].map(F)}
      <button className="btn" onClick={() => run(async () => chk(await sb.from('ib_settings').upsert(Object.entries(cfg).map(([key, value]) => ({ key, value })))))}>Save details</button></section>
    <section><h3>Starter content</h3><p className="sub">Adds the sample services, products and photos so you can edit or delete them. Only fills sections that are empty, so it never makes duplicates.</p><button className="btn alt" onClick={() => confirm('Add starter content?') && run(async () => { let added = 0; for (const [t, rows] of [['ib_services', SEED_SERVICES], ['ib_products', SEED_PRODUCTS], ['ib_gallery', SEED_PHOTOS]]) { const c = await sb.from(t).select('id', { count: 'exact', head: true }); chk(c); if (!c.count) { chk(await sb.from(t).insert(rows)); added++ } } setVer(v => v + 1); if (!added) throw new Error('Starter content already added') }, 'Starter content added')}>Add starter content</button></section>
    <Manager key={'s' + ver} table="ib_services" title="Services" />
    <Manager key={'p' + ver} table="ib_products" title="Products (delete when sold out)" />
    <section><h3>Gallery photos</h3><input type="file" accept="image/*" multiple onChange={e => run(async () => { for (const f of e.target.files) chk(await sb.from('ib_gallery').insert({ image_url: await up(f) })) }, 'Photos added')} />
      <div className="agal">{gal.map(p => <div key={p.id}><img src={p.image_url} alt="" /><button className="btn alt" onClick={() => confirm('Delete?') && run(async () => chk(await sb.from('ib_gallery').delete().eq('id', p.id)), 'Deleted')}>Delete</button></div>)}</div></section>
  </main>)
}
