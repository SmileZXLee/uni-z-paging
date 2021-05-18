import Vue from 'vue'
import App from './App'
import request from '@/http/request.js'
// ----------------------全局引入z-paging的mixin示例(使用页面滚动时需要引入)-------------------------
//如果需要全局引入z-paging的mixin，请使用下方注释掉的代码，当大多数页面都使用z-paging并使用页面滚动时，可进行全局mixin注册，此mixin仅对使用页面滚动时的z-paging有效
/*
import ZPagingMixin from '@/uni_modules/z-paging/components/z-paging/js/z-paging-mixin'
Vue.mixin(ZPagingMixin)
*/


// ----------------------全局配置z-paging默认的属性值方案：第①步：引入z-paging-config-----------------------
//注意：这里的全局配置不是全局引入组件，全局配置是指统一配置z-paging默认的属性值，z-paging遵循easycom组件规范，无需注册即可使用。
//关于easycom组件规范，可查阅https://uniapp.dcloud.io/component/README?id=easycom组件规范
/*
import zConfig from '@/uni_modules/z-paging/components/z-paging/js/z-paging-config'
*/

Vue.config.productionTip = false
Vue.prototype.$request = request
App.mpType = 'app'

// ----------------------全局配置z-paging默认的属性值方案：第②步：设置配置信息-----------------------
//注意，如果调用过setConfig进行配置，后期又需要取消配置，则需要设置zConfig.setConfig(null)。需要将配置置空，因为setConfig是将配置设置在缓存中，直接删除配置代码将导致原先缓存的配置无法清空。
/*
zConfig.setConfig({
	//配置分页默认pageSize为15
	'default-page-size': '15',
	//配置空数据图默认描述文字为：空空如也~~
	'empty-view-text': '空空如也~~',
	//...
})
*/


const app = new Vue({
	...App
})
app.$mount()


