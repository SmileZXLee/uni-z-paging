<!-- 滑动切换选项卡+吸顶演示（待完善） -->
<template>
	<view class="content">
		<z-paging ref="paging" @scrolltolower="scrolltolower" :hide-empty-view="true" :refresher-threshold="80"
			:refresher-status.sync="refresherStatus" @query="queryList" style="height: 100%;"
			:paging-content-style="{height:pagingContentHeight}">
			<!-- 自定义下拉刷新view -->
			<custom-refresher slot="refresher" :status="refresherStatus"></custom-refresher>
			<view class="paging-content"  :style="[{height: swiperHeight}]">
				<view class="banner-view" style="height: 250rpx;">
					<view style="font-size: 40rpx;font-weight: 700;">这是一个banner</view>
					<view style="font-size: 24rpx;margin-top: 5rpx;">下方tab滚动时可吸附在顶部</view>
				</view>
				<!-- 小程序中直接修改组件style为position: sticky;无效，需要在组件外层套一层view -->
				<view style="z-index: 100;position: sticky;top :0;">
					<u-tabs-swiper ref="uTabs" :list="list" :current="current" @change="tabsChange" :is-scroll="false"
						swiperWidth="750"></u-tabs-swiper>
				</view>
				<swiper class="swiper" :current="swiperCurrent" @transition="transition"
					@animationfinish="animationfinish">
					<swiper-item class="swiper-item" v-for="(item, index) in list" :key="index">
						<sticky-and-scroll-tab-item ref="swiperItem"
							@pagingContentHeightChanged="pagingContentHeightChanged" :tabIndex="index"
							:currentIndex="swiperCurrent"></sticky-and-scroll-tab-item>
					</swiper-item>
				</swiper>
			</view>
		</z-paging>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				refresherStatus: 0,
				pagingContentHeight: '100%',
				oldPagingContentHeight: '100%',
				swiperHeight: '100%',
				scrollTopMap: {},
				list: [{
					name: '测试1'
				}, {
					name: '测试2'
				}, {
					name: '测试3'
				}, {
					name: '测试4'
				}],
				// 因为内部的滑动机制限制，请将tabs组件和swiper组件的current用不同变量赋值
				current: 0, // tabs组件的current值，表示当前活动的tab选项
				swiperCurrent: 0, // swiper组件的current值，表示当前那个swiper-item是活动的
			}
		},
		methods: {
			queryList() {
				this.$refs.swiperItem[this.current].reload();
				this.$refs.paging.complete([]);
			},
			scrolltolower(e) {
				this.$refs.swiperItem[this.current].doLoadMore();
			},
			pagingContentHeightChanged(height) {
				if (height > 0) {
					this.pagingContentHeight = height + uni.upx2px(250) + uni.upx2px(80) + uni.upx2px(80) + 'px';
					this.oldPagingContentHeight = this.pagingContentHeight;
				}
			},
			// tabs通知swiper切换
			tabsChange(index) {
				this.swiperCurrent = index;
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
				this.swiperCurrent = current;
				this.current = current;
				
				// const scrollTop = this.scrollTopMap[this.current];
				// if(scrollTop){
				// 	this.$refs.paging.updateScrollViewScrollTop(scrollTop, false);
				// }else{
				// 	this.$refs.paging.updateScrollViewScrollTop(0, false);
				// }
				
			}
		}
	}
</script>

<style>
	/* 注意，1、父节点需要固定高度，z-paging的height:100%才会生效 */
	/* 注意，2、请确保z-paging与同级的其他view的总高度不得超过屏幕宽度，以避免超出屏幕高度时页面的滚动与z-paging内部的滚动冲突 */

	/*如果有scoped，page的css设置建议放在App.vue中 */

	page,
	.content {
		height: 100%;
	}

	.banner-view {
		background-color: #007AFF;
		color: white;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.paging-content {
		flex: 1;
		height: 100%;
		display: flex;
		flex-direction: column;
	}

	.swiper {
		flex: 1;
	}
</style>
