import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue' // 导入应用本身
import router from './router' // 导入 Vue Router

// 导入 Element Plus 及本地化设置
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'

// 导入样式表
// 首先是 Element Plus 的
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import '@/assets/styles/border.scss' // 边框
import '@/assets/styles/radius.scss' // 圆角
import '@/assets/styles/shadow.scss' // 圆角

// 然后是自己的
import '@/assets/styles/index.scss' // 全局样式
import '@/assets/styles/font.css' // 字体
import '@/assets/styles/element/index.scss' // 覆盖原本的样式
import '@/assets/styles/media.scss' // 手机和电脑布局处理

// 导入 Font Awesome 图标组件
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import { library } from '@fortawesome/fontawesome-svg-core'

// 导入 Font Awesome 的免费图标
import { fas } from '@fortawesome/free-solid-svg-icons' // 实心
import { far } from '@fortawesome/free-regular-svg-icons' // 普通
import { fab } from '@fortawesome/free-brands-svg-icons' // 品牌

library.add(fas, far, fab) // 把这些导入的图标全塞进去

// 然后是弄好 app 和 pinia
const app = createApp(App)

const pinia = createPinia()

// Element Plus 的本地化设置
app.use(ElementPlus, {
  locale: zhCn,
})

app.component('font-awesome-icon', FontAwesomeIcon) // 把 Font Awesome 的图标作为 <font-awesome-icon /> 塞进去

// 还有两个东西，Pinia 和 Vue Router
app.use(pinia)
app.use(router)

// 最后一步，挂载，大功告成！
app.mount('#app')
