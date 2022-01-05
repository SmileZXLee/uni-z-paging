<script>
	import { version } from '@/uni_modules/z-paging/package.json'
	export default {
		onLaunch: function() {
			console.log('App Launch')
			// #ifdef APP-PLUS
			plus.screen.lockOrientation("portrait-primary");
			// #endif
			
			// #ifndef APP-APP-PLUS
			console.log(`%c z-paging %c v${version} `,'background:#35495e ; padding: 1px; border-radius: 3px 0 0 3px;  color: #fff','background:#007AFF ;padding: 1px; border-radius: 0 3px 3px 0;  color: #fff; font-weight: bold;')
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
