import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ShopView from '../views/ShopView.vue'
import BankView from '../views/BankView.vue'
import ShopHome from '../views/ShopHome.vue'
import ShopLogin from '../views/ShopLogin.vue'
import ShopBuy from '../views/ShopBuy.vue'
import ShopPay from '../views/ShopPay.vue'
import ShopOrders from '../views/ShopOrders.vue'

export default createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    {
      path: '/shop', component: ShopView,
      children: [
        { path: 'home', alias: '/shop', name: 'shop-home', components: { shopmain: ShopHome } },
        { path: 'login', name: 'shop-login', components: { shopmain: ShopLogin } },
        { path: 'buy', name: 'shop-buy', components: { shopmain: ShopBuy } },
        {
          path: 'pay/:orderId?', name: 'shop-pay', components: { shopmain: ShopPay },
          props: { shopmain: route => ({ orderUuid: typeof route.params.orderId === 'string' ? route.params.orderId : '' }) },
        },
        { path: 'orders', name: 'shop-orders', components: { shopmain: ShopOrders } },
      ],
    },
    { path: '/bank', name: 'bank', component: BankView },
  ],
})
