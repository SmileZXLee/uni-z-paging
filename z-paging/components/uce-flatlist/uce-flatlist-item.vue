<template>
	<view>
		<slot :data="data" :index="index"></slot>
	</view>
</template>

<script>
	// 方便扩展
	export default {
		props: {
			index: {
				type: Number,
				default: 0
			},
			data: {}
		},
		methods: {}
	}
</script>

<style>
</style>
