// Page de vérification navigateur, sans framework ni dépendance de tests.
import { createApp, h, nextTick } from 'vue'
import { createRouter, createMemoryHistory } from 'vue-router'
import NavBar from '../src/components/NavBar.vue'
import VerticalMenu from '../src/components/VerticalMenu.vue'

const results = []
function check(condition, message) {
  if (!condition) throw new Error(message)
  results.push(message)
}
async function fixture(component, props = {}, slots = {}) {
  const host = document.createElement('div')
  document.querySelector('#app').append(host)
  const router = createRouter({ history: createMemoryHistory(), routes: [
    { path: '/', component: { render: () => h('p', 'accueil') } },
    { path: '/one', component: { render: () => h('p', 'un') } },
    { path: '/two', component: { render: () => h('p', 'deux') } },
  ] })
  await router.push('/')
  const app = createApp({ render: () => h(component, props, slots) })
  app.use(router).mount(host)
  await nextTick()
  return { host, router, dispose() { app.unmount(); host.remove() } }
}
async function settle() {
  await new Promise(resolve => setTimeout(resolve, 30))
  await nextTick()
}

try {
  let f = await fixture(NavBar, { links: [
    { label: 'Un', to: '/one' }, { label: 'Deux', to: '/two', disabled: true },
  ] })
  let buttons = f.host.querySelectorAll('button')
  check(buttons.length === 2 && buttons[0].textContent === 'Un', 'NavBar : ordre et fallback des boutons')
  buttons[0].click(); await settle()
  check(f.router.currentRoute.value.path === '/one', 'NavBar : clic suit sa route')
  buttons[1].click(); await settle()
  check(buttons[1].disabled && f.router.currentRoute.value.path === '/one', 'NavBar : entrée désactivée ne navigue pas')
  f.dispose()
  f = await fixture(NavBar, { links: [{ label: 'Un', to: '/one' }] }, {
    'nav-button': ({ label }) => h('strong', label),
  })
  check(f.host.querySelector('button strong')?.textContent === 'Un', 'NavBar : scoped-slot reçoit label')
  f.dispose()
  f = await fixture(NavBar)
  check(f.host.querySelectorAll('button').length === 0, 'NavBar : liste vide sans contrôle parasite')
  f.dispose()
  f = await fixture(VerticalMenu, { items: [
    { type: 'title', label: 'Titre' }, { type: 'link', label: 'Un', to: '/one' },
    { type: 'inconnu', label: 'Invisible' },
  ] })
  check(f.host.querySelectorAll('button').length === 1 && !f.host.textContent.includes('Invisible'), 'VerticalMenu : seuls les types title/link sont rendus')
  f.host.querySelector('nav > span').click(); await settle()
  check(f.router.currentRoute.value.path === '/', 'VerticalMenu : titre sans navigation')
  f.host.querySelector('button').click(); await settle()
  check(f.router.currentRoute.value.path === '/one', 'VerticalMenu : lien actif suit sa route')
  f.dispose()
  f = await fixture(VerticalMenu, { disabled: true, items: [{ type: 'link', label: 'Un', to: '/one' }] }, {
    'menu-link': ({ label }) => h('button', label),
  })
  f.host.querySelector('button').click(); await settle()
  check(f.router.currentRoute.value.path === '/', 'VerticalMenu : disabled bloque aussi le contenu personnalisé')
  f.dispose()
  f = await fixture(VerticalMenu, { items: [
    { type: 'title', label: 'Titre' }, { type: 'link', label: 'Un', to: '/one' },
  ] }, { 'menu-title': ({ label }) => h('strong', label), 'menu-link': ({ label }) => h('em', label) })
  check(f.host.querySelector('strong')?.textContent === 'Titre' && f.host.querySelector('em')?.textContent === 'Un', 'VerticalMenu : les deux slots reçoivent label')
  f.host.querySelector('[role="link"]').dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }))
  await settle()
  check(f.router.currentRoute.value.path === '/one', 'VerticalMenu : activation clavier du lien personnalisé')
  f.dispose()
  document.body.dataset.testStatus = 'passed'
} catch (error) {
  document.body.dataset.testStatus = 'failed'
  results.push(error.stack)
  console.error(error)
}
document.querySelector('#result').textContent = JSON.stringify({ status: document.body.dataset.testStatus, checks: results }, null, 2)
