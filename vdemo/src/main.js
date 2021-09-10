// 这是应用的入口文件。目前它会初始化 Vue 应用并且制定将应用挂载到  index.html 文件中的哪个 HTML 元素上。
// 通常还会做一些注册全局组件或者添额外的 Vue 库的操作。
import Vue from 'vue'
import App from './App.vue'

// 接下来，在您的src/main.js文件中，如下导入reset.css文件：
import './assets/reset.css';

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
