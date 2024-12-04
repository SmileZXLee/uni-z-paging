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
ZPInterceptor.handleQuery((pageNo, pageSize, from)=>{
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

// 若不使用:fetch无需进行下方配置
// 可以对全局:fetch的请求参数和响应进行拦截和统一处理，默认请求参数为{ pageNo, pageSize }，将响应结果直接当作分页数组。如非默认情况，请使用下方示例处理
import ZPInterceptor from '@/uni_modules/z-paging/components/z-paging/js/z-paging-interceptor'
// 处理z-paging fetch写法拦截，handleFetchParams用于拦截请求入参，返回最终入参对象。handleFetchResult用于拦截请求结果，自行处理请求结束后操作，务必调用complete或complete相关方法
// 支持链式调用
ZPInterceptor.handleFetchParams((parmas, extraParams) => {
	return { pageNo: parmas.pageNo, pageSize: parmas.pageSize, ...extraParams };
}).handleFetchResult((fetchResult, paging) => {
	fetchResult.then(res => {
		paging.complete(res.data.list);
	}).catch(err => {
		paging.complete(false);
	})
})

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



