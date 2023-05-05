<!-- 使用页面滚动且在子组件内使用z-paging示例(vue3) -->
<template>
	<view class="content">
		
		<!-- 子组件中必须实现mixins中的相应方法，具体代码请看page-default-list-vue3组件代码 -->
		<page-default-list-vue3 ref="paging"/>
	</view>
</template>

<script setup>
	import { ref } from 'vue';
	import { onPageScroll, onReachBottom } from '@dcloudio/uni-app';
	import useZPaging from "@/uni_modules/z-paging/components/z-paging/js/hooks/useZPaging.js";
	
	const paging = ref(null)
	
	useZPaging(paging);
</script>

<style>

</style>
