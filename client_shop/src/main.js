import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import 'normalize.css/normalize.css'
import {
  Container,
  Header,
  Main,
  Menu,
  MenuItem,
  Col,
  Row,
  Input,
  Button,
  Table,
  TableColumn,
  Pagination,
  Drawer,
  InputNumber,
  Descriptions,
  DescriptionsItem,
  Form,
  FormItem,
  Message,
  Dialog,
  Loading
} from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.component(Container.name, Container)
Vue.component(Header.name, Header)
Vue.component(Main.name, Main)
Vue.component(Menu.name, Menu)
Vue.component(MenuItem.name, MenuItem)
Vue.component(Col.name, Col)
Vue.component(Row.name, Row)
Vue.component(Input.name, Input)
Vue.component(InputNumber.name, InputNumber)
Vue.component(Button.name, Button)
Vue.component(Table.name, Table)
Vue.component(TableColumn.name, TableColumn)
Vue.component(Pagination.name, Pagination)
Vue.component(Drawer.name, Drawer)
Vue.component(Descriptions.name, Descriptions)
Vue.component(DescriptionsItem.name, DescriptionsItem)
Vue.component(Form.name, Form)
Vue.component(FormItem.name, FormItem)
Vue.component(Dialog.name, Dialog)
Vue.prototype.$message = Message
Vue.prototype.$loading = Loading.service

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
