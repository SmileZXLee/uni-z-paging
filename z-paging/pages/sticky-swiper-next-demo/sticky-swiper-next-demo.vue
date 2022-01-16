<!-- 滑动切换选项卡+吸顶演示(上一个tab数据不保留，滚动流畅) -->
<template>
	<view class="content">
		<z-paging ref="paging" refresher-only @onRefresh="onRefresh" :refresher-status.sync="refresherStatus" @scrolltolower="scrolltolower">
			<!-- 自定义下拉刷新view -->
			<custom-refresher slot="refresher" :status="refresherStatus"></custom-refresher>
			<view class="banner-view" style="height: 250rpx;">
				<view style="font-size: 40rpx;font-weight: 700;">这是一个banner</view>
				<view style="font-size: 24rpx;margin-top: 5rpx;">下方tab滚动时可吸附在顶部</view>
			</view>
			<view>
				<!-- 小程序中直接修改组件style为position: sticky;无效，需要在组件外层套一层view -->
				<view style="z-index: 100;position: sticky;top :0;">
					<tabs-view @change="tabsChange" :current="current" :items="tabList"></tabs-view>
				</view>
				<swiper class="swiper" :style="[{height:swiperHeight+'px'}]" :current="current" @animationfinish="animationfinish">
					<swiper-item class="swiper-item" v-for="(item, index) in tabList" :key="index">
						<sticky-swiper-next-item ref="swiperList" :tabIndex="index" :currentIndex="current" @heightChanged="heightChanged">
						</sticky-swiper-next-item>
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
				swiperHeight: 0,
				tabList: ['测试1', '测试2', '测试3', '测试4'],
				// 因为内部的滑动机制限制，请将tabs组件和swiper组件的current用不同变量赋值
				current: 0, // tabs组件的current值，表示当前活动的tab选项
			}
		},
		methods: {
			// tabs通知swiper切换
			tabsChange(index) {
				this.current = index;
			},
			onRefresh(){
				this.$refs.swiperList[this.current].reload(() => {
					this.$refs.paging.complete([]);
				});
			},
			// 由于swiper的内部机制问题，快速切换swiper不会触发dx的连续变化，需要在结束时重置状态
			// swiper滑动结束，分别设置tabs和swiper的状态
			animationfinish(e) {
				let current = e.detail.current;
				if (current !== this.current){
					this.$refs.swiperList[this.current].clear();
				}
				this.current = current;
			},
			heightChanged(height,isFirstPage){
				if(height === 0){
					height = uni.getSystemInfoSync().windowHeight - uni.upx2px(80);
				}else if(isFirstPage){
					height += uni.upx2px(80);
				}
				this.swiperHeight = height;
			},
			scrolltolower(){
				this.$refs.swiperList[this.current].doLoadMore();
			}
		}
	}
</script>

<style>
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
		display: flex;
		flex-direction: column;
	}

	.swiper {
		height: 1000px;
	}
</style>
