<script>
	import { version } from '@/uni_modules/z-paging/package.json'
	export default {
		onLaunch: function() {
			console.log('App Launch')
			let vueVersion = 'vue2';
			// #ifdef VUE3
			vueVersion = 'vue3';
			const notice = '请注意，此demo写法是基于vue2的，因此在vue3上展示会有异常，尤其是slot="top"部分。z-paging插件本身支持vue3，从vue2迁移到vue3请查阅文档：https://z-paging.zxlee.cn/start/migration-to-vue3.html';
			// #ifdef H5
			console.log(notice);
			// #endif
			// #ifndef H5
			console.warn(notice);
			// #endif
			// #endif
			
			// #ifdef APP-PLUS
			plus.screen.lockOrientation("portrait-primary");
			console.log(`z-paging v${version} (${vueVersion})`)
			// #endif
			
			// #ifndef APP-PLUS
			console.log(`%c z-paging %c v${version} %c ${vueVersion} `,'background:#35495e ; padding: 1px; border-radius: 3px 0 0 3px;  color: #fff','background:#007AFF ;padding: 1px; color: #fff; font-weight: bold;','background:#3eaf7c ;padding: 1px; border-radius: 0 3px 3px 0;  color: #fff; font-weight: bold;')
			// #endif
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */
	/* #ifndef APP-NVUE */
	page {
		background-color: white;
	}
	/* #endif */
	.content{
		background-color: white;
	}
</style>
