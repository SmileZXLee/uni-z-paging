<!-- 滑动切换选项卡演示(简化写法，不推荐。建议使用标准写法swiper-demo.vue)(vue) -->
<!-- 简化写法灵活性不如标准写法高，暂时无法设置内部z-paging自定义下拉刷新view，自定义上拉加载view等slot插入的vie -->
<!-- z-paging-swiper-item只支持props传部分常见属性，其他z-paging属性请通过全局配置修改 -->
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
		<template #top>
			<!-- 注意！此处的z-tabs为独立的组件，可替换为第三方的tabs，若需要使用z-tabs，请在插件市场搜索z-tabs并引入，否则会报插件找不到的错误 -->
			<z-tabs ref="tabs" :list="tabList" :current="current" @change="tabsChange" />
		</template>
		<!-- 因swiper与swiper-item无法封装在不同组件中，因此这边依然需要设置swiper包裹swiper-item -->
		<swiper style="height: 100%;" :current="current" @transition="swiperTransition" @animationfinish="swiperAnimationfinish">
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
				// 注意，这个数组是一个二维数组，数组里面包含的是所有tabs的list数组
				dataList: [],
				tabList: ['测试1','测试2','测试3','测试4'],
				current: 0, // tabs组件的current值，表示当前活动的tab选项
			}
		},
		methods: {
			// tabs通知swiper切换
			tabsChange(index) {
				this.current = index;
			},
			// swiper滑动中
			swiperTransition(e) {
				this.$refs.tabs.setDx(e.detail.dx);
			},
			// swiper滑动结束
			swiperAnimationfinish(e) {
				this.current = e.detail.current;
				this.$refs.tabs.unlockDx();
			},
			queryList(pageNo, pageSize) {
				// 这里的网络请求请替换成自己的网络请求
				// this.current代表当前下拉刷新/上拉加载更多对应的是第几个
				const params = {
					pageNo: pageNo,
					pageSize: pageSize,
					type: this.current + 1
				}
				this.$request.queryList(params).then(res => {
					// 将请求的结果数组传递给z-paging
					this.$refs.swiperItem[this.current].complete(res.data.list);
				})
			},
			updateList(data) {
				// 更新当前对应tab的数据，注意这里请用$set而非this.dataList[this.current]=data，因为需要触发列表渲染
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
