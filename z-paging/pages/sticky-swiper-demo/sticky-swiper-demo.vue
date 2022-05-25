<!-- 【不推荐】滑动切换选项卡+吸顶演示，上一个tab数据保留，滚动卡顿，因滚动冲突，一些情况下可能出现无法滚动的问题 -->
<!-- 【不推荐】滑动切换选项卡+吸顶演示，上一个tab数据保留，滚动卡顿，因滚动冲突，一些情况下可能出现无法滚动的问题 -->
<!-- 【不推荐】滑动切换选项卡+吸顶演示，上一个tab数据保留，滚动卡顿，因滚动冲突，一些情况下可能出现无法滚动的问题 -->
<!-- 【不推荐】滑动切换选项卡+吸顶演示，上一个tab数据保留，滚动卡顿，因滚动冲突，一些情况下可能出现无法滚动的问题 -->

<!-- 如果在App中，推荐使用nvue写法，滚动和过渡更流畅，参照sticky-swiper-demo-n -->
<template>
	<view class="content">
		<z-paging ref="paging" @scroll="scroll" refresher-only :scrollable="scrollable" :refresher-status.sync="refresherStatus" @query="queryList">
			<!-- 自定义下拉刷新view -->
			<custom-refresher slot="refresher" :status="refresherStatus" />
			<view class="banner-view" style="height: 250rpx;">
				<view style="font-size: 40rpx;font-weight: 700;">这是一个banner</view>
				<view style="font-size: 24rpx;margin-top: 5rpx;">下方tab滚动时可吸附在顶部</view>
			</view>
			<view class="paging-content" :style="'height:' + pageHeight + 'px'">
				<!-- 小程序中直接修改组件style为position: sticky;无效，需要在组件外层套一层view -->
				<view style="z-index: 100;position: sticky;top :0;">
					<!-- 注意！此处的z-tabs为独立的组件，可替换为第三方的tabs，若需要使用z-tabs，请在插件市场搜索z-tabs并引入，否则会报插件找不到的错误 -->
					<z-tabs ref="tabs" :list="tabList" :current="current" @change="tabChange"></z-tabs>
				</view>
				<swiper class="swiper" :current="current" @animationfinish="animationfinish">
					<swiper-item class="swiper-item" v-for="(item, index) in tabList" :key="index">
						<sticky-swiper-item ref="swiperItem" :tabIndex="index" :currentIndex="current" @setScrollable="setScrollable" @setStickyed="setStickyed" />
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
				scrollTopMap: {},
				// 页面高度
				pageHeight: 0,
				// header高度
				headerHeight: 0,
				scrollable: true,
				list: [],
				tabList: ['测试1','测试2','测试3','测试4'],
				current: 0, // tabs组件的current值，表示当前活动的tab选项
			}
		},
		onLoad() {
			this.pageHeight = uni.getSystemInfoSync().windowHeight;

			this.$nextTick(() => {
				const query = uni.createSelectorQuery();
				query.select('.banner-view').boundingClientRect(data => {
					this.headerHeight = data.height;
				}).exec();
			})
		},
		methods: {
			queryList() {
				//触发了下拉刷新，通过当前tabIndex对应的列表下拉刷新
				this.$refs.swiperItem[this.current].reload(() => {
					this.$refs.paging.complete([]);
				});
			},
			scroll(e) {
				const scrollTop = e.detail.scrollTop;
				//如果当前页面的scroll-view的scrollTop大于等于headerView的高度，则代表吸顶了
				if (scrollTop < this.headerHeight) {
					//还没吸顶
					//禁止子组件的z-paging(scroll-view)滚动，当前页面的z-paging(scroll-view)允许滚动
					this.scrollable = true;
					this.$refs.swiperItem[this.current].setScrollable(false);
				} else {
					//吸顶了
					//允许子组件的z-paging(scroll-view)滚动，当前页面的z-paging(scroll-view)禁止滚动
					this.scrollable = false;
					this.$refs.swiperItem[this.current].setScrollable(true);
				}
			},
			//子组件设置当前页面的列表是否可以滚动
			setScrollable(scrollable) {
				this.scrollable = scrollable;
			},
			//子组件设置当前页面进入吸顶状态并禁止滚动
			setStickyed() {
				this.scrollable = false;
				this.$refs.paging.scrollToY(this.headerHeight);
			},
			// tabs通知swiper切换
			tabChange(index) {
				this.current = index;
			},
			// swiper滑动结束
			animationfinish(e) {
				let current = e.detail.current;
				this.current = current;
				this.$refs.swiperItem[this.current].setScrollable(!this.scrollable);
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
		flex: 1;
	}
</style>
