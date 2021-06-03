<!-- 基于z-paging封装自定义分页组件演示，可减少大量重复代码 -->
<template>
	<z-paging ref="paging" fixed auto-show-back-to-top refresher-threshold="160rpx" @query="queryList"
		@listChange="listChange" :loading-more-loading-text="{'en':'英文的加载中','zh-cn':'中文的加载中','zh-hant-cn':'繁体的加载中'}">
		<slot v-if="$slots.top" name="top" slot="top"></slot>
		<slot />
		<!-- 自定义下拉刷新view(如果use-custom-refresher为true且不设置下面的slot="refresher"，此时不用获取refresherStatus，会自动使用z-paging自带的下拉刷新view) -->
		<custom-refresher slot="refresher" slot-scope="{refresherStatus}" :status="refresherStatus"></custom-refresher>
		<!-- 自定义没有更多数据view -->
		<custom-nomore slot="loadingMoreNoMore"></custom-nomore>
	</z-paging>
</template>

<script>
	export default {
		name: "my-paging",
		data() {
			return {

			};
		},
		methods: {
			queryList(pageNo, pageSize) {
				this.$emit('query', pageNo, pageSize);
			},
			listChange(newVal) {
				this.$emit('update:list', newVal);
			},
			reload(data) {
				this.$refs.paging.reload(data);
			},
			complete(data) {
				this.$refs.paging.complete(data);
			}
		}
	}
</script>

<style>

</style>
