<!-- 滑动切换选项卡演示(简化写法，不推荐。建议使用标准写法swiper-demo.vue)(vue) -->
<!--  此demo使用了uView的tabsSwiper全屏选项卡 https://uviewui.com/components/tabsSwiper.html -->
<!-- 简化写法灵活性不如标准写法高，暂时无法设置内部z-paging自定义下拉刷新view，自定义上拉加载view等slot插入的view，设置z-paging只支持全局配置 -->
<!-- 适用于简单的低自定义场景 -->
<!-- 支付宝小程序不支持此写法 -->

<!-- 兼容性&灵活性不佳，不建议使用，建议使用标准写法swiper-demo.vue) -->
<!-- 兼容性&灵活性不佳，不建议使用，建议使用标准写法swiper-demo.vue) -->
<!-- 兼容性&灵活性不佳，不建议使用，建议使用标准写法swiper-demo.vue) -->
<!-- 兼容性&灵活性不佳，不建议使用，建议使用标准写法swiper-demo.vue) -->
<!-- 兼容性&灵活性不佳，不建议使用，建议使用标准写法swiper-demo.vue) -->
<template>
	<z-paging-swiper>
		<!-- 需要固定在顶部不滚动的view放在slot="top"的view中 -->
		<view style="height: 80rpx;" slot="top">
			<u-tabs-swiper ref="uTabs" :list="tabList" :current="current" @change="tabsChange" :is-scroll="false"
				swiperWidth="750"></u-tabs-swiper>
		</view>
		<!-- 因swiper与swiper-item无法封装在不同组件中，因此这边依然需要设置swiper包裹swiper-item -->
		<swiper style="height: 100%;" :current="swiperCurrent" @transition="transition" @animationfinish="animationfinish">
			<swiper-item v-for="(item,index) in tabList" :key="index">
				<z-paging-swiper-item ref="swiperItem" :tabIndex="index" :currentIndex="current" @query="queryList"
					@updateList="updateList">
					<view class="item" v-for="(subItem,subIndex) in dataList[index]" :key="subIndex">
						<view class="item-title">{{subItem.title}}</view>
						<view class="item-detail">{{subItem.detail}}</view>
						<view class="item-line"></view>
					</view>
				</z-paging-swiper-item>
			</swiper-item>
		</swiper>
	</z-paging-swiper>
</template>

<script>
	export default {
		data() {
			return {
				//注意，这个数组是一个二维数组，数组里面包含的是所有tabs的list数组
				dataList: [],
				tabList: [{
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
			},
			queryList(pageNo, pageSize) {
				//这里的网络请求请替换成自己的网络请求
				//this.current代表当前下拉刷新/上拉加载更多对应的是第几个
				const params = {
					pageNo: pageNo,
					pageSize: pageSize,
					type: this.tabIndex + 1
				}
				this.$request.queryList(params).then(res => {
					//将请求的结果数组传递给z-paging
					this.$refs.swiperItem[this.current].complete(res.data.list);
				})
			},
			updateList(data) {
				//更新当前对应tab的数据，注意这里请用$set而非this.dataList[this.current]=data，因为需要触发列表渲染
				this.$set(this.dataList, this.current, data);
			}
		}
	}
</script>

<style>
	.item {
		position: relative;
		height: 150rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0rpx 30rpx;
	}

	.item-detail {
		padding: 5rpx 15rpx;
		border-radius: 10rpx;
		font-size: 28rpx;
		color: white;
		background-color: #007AFF;
	}

	.item-line {
		position: absolute;
		bottom: 0rpx;
		left: 0rpx;
		height: 1px;
		width: 100%;
		background-color: #eeeeee;
	}
</style>
