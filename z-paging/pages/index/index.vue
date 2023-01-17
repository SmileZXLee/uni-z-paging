<template>
	<view class="content">
		<z-paging ref="paging" refresher-only @onRefresh="onRefresh">
			<view slot="refresher" style="height: 120rpx;display: flex;justify-content: center;align-items: center;">
				<image style="width: 300rpx;height: 60rpx;" src="../../static/logo_loading.gif"></image>
			</view>
			<view class="demo-list">
				<view class="demo-item" v-for="(item,index) in list" :key="index" @click="itemClick(item)">
					<view class="demo-item-main">
						<view class="demo-item-title">{{item.title}}</view>
						<view class="demo-item-subtitle" v-if="item.subTitle.length">{{item.subTitle}}</view>
						<view class="demo-item-file">
							<text v-if="item.title.indexOf('nvue')===-1">{{item.file + '.vue'}}</text>
							<text v-else style="background-color: #01c301;">{{item.file + '.nvue'}}</text>
						</view>
					</view>
					<image class="demo-item-more-img" src="../../static/more_icon.png"></image>
				</view>
			</view>
			<!-- #ifndef APP-PLUS -->
			<view class="demo-nvue-tip">- 将此demo运行至App上可体验nvue页面效果 -</view>
			<!-- #endif -->
		</z-paging>
	</view>
</template>

<script>
	import { version } from '@/uni_modules/z-paging/package.json'
	import indexList from './list'
	export default {
		data() {
			return {
				list: indexList.list
			}
		},
		mounted() {
			// #ifdef APP-PLUS
			this.list = this.list.concat(indexList.listNvue);
			// #endif
			
			uni.setNavigationBarTitle({
				title: `z-paging(v${version})`
			})
		},
		methods: {
			//下拉刷新被触发
			onRefresh() {
				//以告知z-paging下拉刷新结束，这样才可以开始下一次的下拉刷新
				setTimeout(() => {
					//1.5秒之后停止刷新动画
					this.$refs.paging.complete();
				}, 1500)
			},
			itemClick(item) {
				uni.navigateTo({
					url: `../${item.file}/${item.file}`
				})

			}
		}
	}
</script>

<style scoped>
	.demo-item {
		display: flex;
		align-items: center;
		border-bottom: #eeeeee solid 1px;
		padding: 20rpx 30rpx;
	}

	.demo-item-main {
		flex: 1;
		margin-right: 20rpx;
	}

	.demo-item-main>view:not(:last-child) {
		margin-bottom: 10rpx;
	}

	.demo-item-more-img {
		width: 24rpx;
		height: 24rpx;
	}

	.demo-item-title {
		font-size: 32rpx;
		font-weight: bold;
	}

	.demo-item-subtitle {
		font-size: 26rpx;
		color: #666666;
	}

	.demo-item-file>text {
		background-color: #007AFF;
		color: white;
		font-size: 24rpx;
		padding: 5rpx 10rpx;
		border-radius: 8rpx;
	}

	.demo-nvue-tip {
		width: 100%;
		padding: 20rpx;
		color: #aaaaaa;
		font-size: 24rpx;
		text-align: center;
	}

	.tip-bottom {
		background-color: #007AFF;
		color: white;
		padding: 20rpx 0rpx;
		text-align: center;
	}
</style>
