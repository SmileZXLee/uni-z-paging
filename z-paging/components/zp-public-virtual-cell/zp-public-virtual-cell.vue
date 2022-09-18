<!-- 当虚拟列表兼容模式渲染的时候，列表中实际上渲染的是这个组件，并且会把当前的item，index和extraData(附加数据)通过props传给这个组件 -->
<!-- 如果有多个不同的虚拟列表，它们会共用这个组件，这时候可以通过extraData来区分不同的页面 -->
<template>
	<view>
		<!-- 这里的extraData.id在virtual-list-compatibility-demo设置的是test1 -->
		<virtual-list-test-cell v-if="extraData.id==='test1'" :item="item" :index="index" :extraData="extraData" />
	</view>
</template>

<script>
	export default {
		name:"zp-virtual-cell",
		props: {
			item: null,
			index: 0,
			// 这里的extraData是在页面中通过:extraData给z-paging组件传的对象
			extraData: null
		},
		data() {
			return {
				
			};
		}
	}
</script>

<style>

</style>