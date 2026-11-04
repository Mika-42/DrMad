import { createApp, nextTick } from 'vue'
import { createPinia } from 'pinia'
import App from '../src/App.vue'
import router from '../src/router/index.js'

const results = []
function check(condition, message) {
  if (!condition) throw Error(message)
  results.push(message)
}
try {
  await router.push('/')
  createApp(App).use(createPinia()).use(router).mount('#app')
  await router.isReady(); await nextTick()
  check(document.querySelector('#app').textContent.includes('Bienvenue DrMad'), 'Accueil global')
  const routes = [
    ['/shop', 'Bienvenue à la boutique'], ['/shop/home', 'Bienvenue à la boutique'],
    ['/shop/login', 'Connexion à la boutique'], ['/shop/buy', 'Acheter'],
    ['/shop/orders', 'Mes commandes'], ['/shop/pay', 'Payer une commande'],
    ['/shop/pay/reference-test', 'Référence de commande : reference-test'],
  ]
  for (const [path, text] of routes) {
    // force permet de contrôler aussi les deux URL alias, sinon dédupliquées.
    await router.push({ path, force: true }); await nextTick()
    check(location.pathname === path && document.querySelector('main').textContent.includes(text), path)
    if (document.querySelector('h2')?.textContent !== 'Boutique') throw Error('Cadre boutique perdu')
  }
  await router.push('/shop/pay/autre-reference'); await nextTick()
  check(document.querySelector('main').textContent.includes('autre-reference') && !document.querySelector('main').textContent.includes('reference-test'), 'Props orderUuid mise à jour')
  await router.push('/shop/pay'); await nextTick()
  check(!document.querySelector('main').textContent.includes('Référence de commande'), 'Paramètre absent correctement effacé')
  check(document.querySelectorAll('nav').length === 2, 'Navigation boutique distincte de la globale')
  document.body.dataset.testStatus = 'passed'
} catch (error) {
  document.body.dataset.testStatus = 'failed'
  results.push(error.stack)
  console.error(error)
}
document.querySelector('#result').textContent = JSON.stringify({ status: document.body.dataset.testStatus, checks: results }, null, 2)
