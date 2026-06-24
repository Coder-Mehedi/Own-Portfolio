import puppeteer from 'puppeteer-core'
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const browser = await puppeteer.launch({
  executablePath: '/usr/bin/chromium',
  headless: 'new',
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
})
const page = await browser.newPage()
await page.setViewport({ width: 1440, height: 900 })
await page.goto('http://localhost:4173/', { waitUntil: 'networkidle0', timeout: 30000 })
await page.evaluate(() => document.querySelector('section[aria-label="Selected Work"]')?.scrollIntoView())
await sleep(1500)
const work = await page.evaluate(() => {
  const sec = document.querySelector('section[aria-label="Selected Work"]')
  const cards = Array.from(sec?.querySelectorAll('article') || [])
  const track = sec?.querySelector('.flex.gap-8')
  return {
    cardCount: cards.length,
    cards: cards.map((c) => { const cs = getComputedStyle(c); const r = c.getBoundingClientRect(); return { opacity: cs.opacity, top: Math.round(r.top), left: Math.round(r.left), w: Math.round(r.width) } }),
    trackTransform: track ? getComputedStyle(track).transform.slice(0, 40) : 'no-track',
  }
})
console.log('WORK:', JSON.stringify(work))
await browser.close()
