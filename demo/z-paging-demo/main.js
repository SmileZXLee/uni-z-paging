import App from './App'
import request from '@/http/request.js'
// ----------------------全局引入z-paging的mixin示例(使用页面滚动时需要引入)-------------------------
//如果需要全局引入z-paging的mixin，请使用下方注释掉的代码，当大多数页面都使用z-paging并使用页面滚动时，可进行全局mixin注册，此mixin仅对使用页面滚动时的z-paging有效
/*
import ZPMixin from '@/uni_modules/z-paging/components/z-paging/js/z-paging-mixin'
Vue.mixin(ZPMixin)
*/

// ----------------------全局引入z-paging@query拦截器-------------------------
/*
import ZPInterceptor from '@/uni_modules/z-paging/components/z-paging/js/z-paging-interceptor'
ZPInterceptor.handleQuery((pageNo, pageSize, from, lastItem)=>{
	//这里可以对pageNo, pageSize, from进行一些处理后return，请注意需要return一个数组，数组中0、1、2的元素就代表@query中绑定方法获取到的参数，数组长度不一定为3，数组长度为多少，@query中的参数就有多少个
	return [pageNo, pageSize, from];
})
*/

// --------------------------全局配置z-paging属性---------------------------
// 【方案1】(推荐)在main.js中添加z-paging配置(具体位置没有要求，确保初始化项目执行到即可)
/*
uni.$zp = {
	config: {
		//配置分页默认pageSize为15
		'default-page-size': '15',
		//配置空数据图默认描述文字为：空空如也~~
		'empty-view-text': '空空如也~~',
		//...
	}
}

// 【方案二】 在文件 z-paging/config/index.js中进行配置，但是需要注意更新插件时要避免被覆盖。
*/


// #ifndef VUE3
import Vue from 'vue'
Vue.config.productionTip = false
App.mpType = 'app'
Vue.prototype.$request = request
const app = new Vue({
    ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  app.config.globalProperties.$request = request
  return {
    app
  }
}
// #endif



