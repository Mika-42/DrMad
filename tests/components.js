// Page de vérification navigateur, sans framework ni dépendance de tests.
import { createApp, h, nextTick } from 'vue'
import { createRouter, createMemoryHistory } from 'vue-router'
import NavBar from '../src/components/NavBar.vue'
import VerticalMenu from '../src/components/VerticalMenu.vue'
import CheckedList from '../src/components/CheckedList.vue'

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
  const rows = [{ _id: 'a', first: 'alpha', second: 'un', hidden: 'secret' }, { _id: 'b', first: 'beta', second: 'deux' }]
  const checked = [true, false]
  let selectionEvent, itemEvent, listEvent
  f = await fixture(CheckedList, { data: rows, fields: ['second', 'first'], itemCheck: true, checked,
    itemButton: { show: true, text: 'Ajouter' }, listButton: { show: true, text: 'Grouper' }, itemAmount: true,
    onCheckedChanged: index => { selectionEvent = index }, onItemButtonClicked: value => { itemEvent = value }, onListButtonClicked: value => { listEvent = value },
  })
  check(f.host.querySelectorAll('li').length === 2 && f.host.querySelector('li').textContent.trim().startsWith('unalpha'), 'CheckedList : lignes et ordre des seuls champs demandés')
  check(!f.host.textContent.includes('secret'), 'CheckedList : champ non demandé masqué')
  f.host.querySelectorAll('input[type="checkbox"]')[1].click()
  check(selectionEvent === 1 && checked[1] === false, 'CheckedList : indice de changement et props intactes')
  const number = f.host.querySelector('input[type="number"]')
  number.value = '3'; number.dispatchEvent(new Event('input', { bubbles: true })); await nextTick()
  f.host.querySelector('li button').click()
  check(itemEvent?.index === 0 && itemEvent.amount === 3, 'CheckedList : indice et quantité de ligne émis')
  f.host.querySelector('div > button').click()
  check(listEvent?.length === 1 && listEvent[0].index === 0 && listEvent[0].amount === 3, 'CheckedList : payload groupé des seules cases contrôlées cochées')
  number.value = '0'; number.dispatchEvent(new Event('input', { bubbles: true })); await nextTick()
  check(f.host.querySelector('li button').disabled && f.host.querySelector('div > button').disabled, 'CheckedList : quantité invalide bloque ajout individuel et groupé')
  number.value = '1.5'; number.dispatchEvent(new Event('input', { bubbles: true })); await nextTick()
  check(f.host.querySelector('li button').disabled, 'CheckedList : quantité fractionnaire refusée')
  f.dispose()
  f = await fixture(CheckedList)
  check(f.host.querySelectorAll('li,input,button').length === 0, 'CheckedList : zéro ligne et aucune option, aucun contrôle parasite')
  f.dispose()
  f = await fixture(CheckedList, { data: [rows[0]], fields: ['first'], itemButton: { show: true, text: 'Retirer' }, onItemButtonClicked: value => { itemEvent = value } })
  f.host.querySelector('button').click()
  check(itemEvent === 0 && f.host.querySelectorAll('input').length === 0, 'CheckedList : une ligne sans quantité émet son indice')
  f.dispose()
  document.body.dataset.testStatus = 'passed'
} catch (error) {
  document.body.dataset.testStatus = 'failed'
  results.push(error.stack)
  console.error(error)
}
document.querySelector('#result').textContent = JSON.stringify({ status: document.body.dataset.testStatus, checks: results }, null, 2)
