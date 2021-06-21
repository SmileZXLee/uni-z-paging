<template>
	<view>
		<z-paging-swiper ref="pagingS" :tabsList="list" @query="queryList" @transition="transition" @animationfinish="animationfinish">
			<view style="height: 80rpx;" slot="top">
				<u-tabs-swiper ref="uTabs" :list="list" :current="current" @change="tabsChange" :is-scroll="false"
					swiperWidth="750"></u-tabs-swiper>
			</view>
			<view>123</view>
		</z-paging-swiper>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list: [{
					name: '测试1'
				}, {
					name: '测试2'
				}, {
					name: '测试3'
				}, {
					name: '测试4'
				}],
				current: 0, // tabs组件的current值，表示当前活动的tab选项
			}
		},
		methods: {
			// tabs通知swiper切换
			tabsChange(index) {
				//this.current = index;
				this.$refs.pagingS.setCurrent(index);
			},
			// swiper-item左右移动，通知tabs的滑块跟随移动
			transition(e) {
				let dx = e.detail.dx;
				this.$refs.uTabs.setDx(dx);
			},
			// 由于swiper的内部机制问题，快速切换swiper不会触发dx的连续变化，需要在结束时重置状态
			// swiper滑动结束，分别设置tabs和swiper的状态
			animationfinish(e) {
				let current = e.detail.current;
				this.$refs.uTabs.setFinishCurrent(current);
				this.current = current;
			},
			queryList(page){
				this.$request.queryList(page.pageNo, page.pageSize, page.current + 1, (data) => {
					this.$refs.pagingS.complete(data);
				})
			}
		}
	}
</script>

<style>

</style>
