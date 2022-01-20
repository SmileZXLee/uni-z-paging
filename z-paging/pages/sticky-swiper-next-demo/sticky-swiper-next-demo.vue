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
				current: 0, // tabs组件的current值，表示当前活动的tab选项
			}
		},
		methods: {
			//tabs通知swiper切换
			tabsChange(index) {
				this._setCurrent(index);
			},
			//下拉刷新时，通知当前显示的列表进行reload操作
			onRefresh(){
				this.$refs.swiperList[this.current].reload(() => {
					this.$refs.paging.complete([]);
				});
			},
			//当滚动到底部时，通知当前显示的列表加载更多
			scrolltolower(){
				this.$refs.swiperList[this.current].doLoadMore();
			},
			// swiper滑动结束
			animationfinish(e) {
				let current = e.detail.current;
				this._setCurrent(current);
			},
			//设置swiper的高度
			heightChanged(height){
				if(height === 0){
					//默认swiper高度为屏幕可用高度-tabbar高度
					height = uni.getSystemInfoSync().windowHeight - uni.upx2px(80);
				}
                console.log('heightChanged',height)
				this.swiperHeight = height;
			},
			_setCurrent(current){
				if (current !== this.current){
					//切换tab时，将上一个tab的数据清空
					this.$refs.swiperList[this.current].clear();
				}
				this.current = current;
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
