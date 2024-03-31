<template>
	<view class="n-navbar">
		<view class="n-navbar-placeholder" :style="[{height: statusBarHeight + 'px'}]" />
		<view class="n-navbar-main">
			<image v-if="showBack" class="n-navbar-main-img" src="/static/back.png" mode="" @click="onBackClick"></image>
			<view v-else></view>
			<text class="n-navbar-main-title" :style="[{color: light ? 'white' : 'black'}]">{{title}}</text>
			<image v-if="showBack" class="n-navbar-main-img"></image>
			<view v-else></view>
		</view>
	</view>
</template>

<script>
	// 获取系统状态栏的高度
	let systemInfo = uni.getSystemInfoSync();
	export default {
		name:"n-navbar",
		props: {
			title: {
				type: String,
				default: ''
			},
			showBack: {
				type: Boolean,
				default: true
			},
			light: {
				type: Boolean,
				default: false
			},
		},
		data() {
			return {
				statusBarHeight: systemInfo.statusBarHeight
			};
		},
		methods: {
			onBackClick() {
				uni.navigateBack();
			}
		}
	}
</script>

<style scoped>
	.n-navbar {
		
	}
	.n-navbar-main {
		height: 44px;
		padding: 0rpx 30rpx;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
	}
	.n-navbar-main-title {
		font-weight: bold;
		font-size: 36rpx;
	}
	.n-navbar-main-img {
		width: 36rpx;
		height: 36rpx;
	}
</style>