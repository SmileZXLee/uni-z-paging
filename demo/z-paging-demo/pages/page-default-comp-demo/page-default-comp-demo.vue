<!-- 使用页面滚动且在子组件内使用z-paging示例(vue) -->
<template>
	<view class="content">
		<!-- 注意注意！！这里的ref必须设置且必须等于"paging"，否则mixin方法无效 -->
		
		<!-- 子组件中必须实现mixins中的相应方法，具体代码请看page-default-list组件代码 -->
		<page-default-list ref="paging"/>
	</view>
</template>

<script>
	// 使用页面滚动时引入此mixin，用于监听和处理onPullDownRefresh等页面生命周期方法(如果全局引入了，就不要这一步，全局引入示例见main.js)
	import ZPMixin from '@/uni_modules/z-paging/components/z-paging/js/z-paging-mixin'
	export default {
		// 注意这一步不要漏掉，必须注册mixins(如果全局引入了，就不要这一步，全局引入示例见main.js)
		mixins: [ZPMixin],
		data() {
			return {
				
			}
		},
		methods: {
			
		}
	}
</script>

<style>

</style>
