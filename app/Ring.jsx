'use client'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'
export default function Ring({ images }) {
  const ref = useRef()
  useEffect(() => {
    const st = ref.current; let raf, R
    try {
      const reduce = matchMedia('(prefers-reduced-motion:reduce)').matches
      R = new THREE.WebGLRenderer({ antialias: true, alpha: true }); R.setPixelRatio(Math.min(devicePixelRatio, 2)); st.appendChild(R.domElement)
      const S = new THREE.Scene(), C = new THREE.PerspectiveCamera(40, 1, .1, 100), G = new THREE.Group(); S.add(G)
      const N = Math.min(8, images.length), W = 1.5, H = 2, ld = new THREE.TextureLoader(); ld.setCrossOrigin('anonymous')
      images.slice(0, N).forEach((src, k) => {
        const t = ld.load(src, tx => { const a = tx.image.width / tx.image.height, q = W / H; if (a < q) { tx.repeat.y = a / q; tx.offset.y = (1 - tx.repeat.y) / 2 } else { tx.repeat.x = q / a; tx.offset.x = (1 - tx.repeat.x) / 2 } })
        const an = k / N * Math.PI * 2, p = new THREE.Vector3(Math.sin(an) * 3.4, 0, Math.cos(an) * 3.4)
        const m = new THREE.Mesh(new THREE.PlaneGeometry(W, H), new THREE.MeshBasicMaterial({ map: t, side: THREE.DoubleSide }))
        const f = new THREE.Mesh(new THREE.PlaneGeometry(W + .12, H + .12), new THREE.MeshBasicMaterial({ color: 0xe8b04a, side: THREE.DoubleSide }))
        ;[m, f].forEach(o => { o.position.copy(p); o.rotation.y = an; G.add(o) }); f.translateZ(-.01)
      })
      const pa = new Float32Array(900).map(() => (Math.random() - .5) * 14), pg = new THREE.BufferGeometry(); pg.setAttribute('position', new THREE.BufferAttribute(pa, 3))
      const pts = new THREE.Points(pg, new THREE.PointsMaterial({ color: 0xe8b04a, size: .05, transparent: true, opacity: .8 })); S.add(pts); G.rotation.x = .12
      const size = () => { const w = st.clientWidth, h = st.clientHeight; R.setSize(w, h); C.aspect = w / h; C.position.set(0, .2, w / h < 1 ? 10.5 : 8.2); C.lookAt(0, 0, 0); C.updateProjectionMatrix() }
      size(); addEventListener('resize', size)
      const base = reduce ? 0 : .004; let vel = base, drag = false, lx = 0
      st.onpointerdown = e => { drag = true; lx = e.clientX; st.setPointerCapture(e.pointerId) }
      st.onpointermove = e => { if (!drag) return; G.rotation.y += (e.clientX - lx) * .008; vel = (e.clientX - lx) * .0008; lx = e.clientX }
      st.onpointerup = st.onpointercancel = () => { drag = false }
      const loop = t => { raf = requestAnimationFrame(loop); if (!drag) { G.rotation.y += vel; vel += (base - vel) * .02 } G.position.y = reduce ? 0 : Math.sin(t * .001) * .12; pts.rotation.y = reduce ? 0 : t * .00003; R.render(S, C) }
      loop(0)
    } catch (e) { st.innerHTML = `<img alt="" src="${images[0]}" style="width:100%;height:100%;object-fit:cover;border-radius:24px">` }
    return () => { cancelAnimationFrame(raf); R && R.dispose() }
  }, [images])
  return <div id="stage" ref={ref} aria-label="Rotating 3D gallery of braid styles"><div className="hint">Drag to spin</div></div>
}
