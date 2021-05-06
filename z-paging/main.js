import Vue from 'vue'
import App from './App'
import request from '@/http/request.js'

//如果需要全局引入z-paging的mixin，请使用下方注释掉的代码，当大多数页面都使用z-paging并使用页面滚动时，可进行全局mixin注册，此mixin仅对使用页面滚动时的z-paging有效
/*
import ZPagingMixin from '@/uni_modules/z-paging/components/z-paging/z-paging-mixin'
Vue.mixin(ZPagingMixin)
*/

Vue.config.productionTip = false
Vue.prototype.$request = request
App.mpType = 'app'

const app = new Vue({
	...App
})
app.$mount()

//全局配置z-paging的props默认值，无需在每个页面重复配置
/*
module.exports = {
	//key必须为z-paging-config
	'z-paging-config': {
		//配置分页默认pageSize为15
		'default-page-size': '15',
		//配置空数据图默认描述文字为：空空如也~~
		'empty-view-text': '空空如也~~',
		//...
	}
}
*/

