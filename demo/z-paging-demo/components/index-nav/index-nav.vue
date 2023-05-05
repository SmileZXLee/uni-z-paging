<template>
	<u-navbar :background="{'background-color': 'rgb(248, 248, 248)'}" :isBack="false">
		<view style="display: flex;align-items: flex-end;justify-content: center;width: 100%;" @click="navClick">
			<image style="width: 180px;height: 28px;" src="/static/title-logo.png"></image>
			<view style="display: flex;">
				<view class="version-tag version-text">v{{version}}</view>
				<!-- #ifdef VUE2 -->
				<view class="version-tag vue-version-text">vue2</view>
				<!-- #endif -->
				<!-- #ifdef VUE3 -->
				<view class="version-tag vue-version-text">vue3</view>
				<!-- #endif -->
			</view>
		</view>
	</u-navbar>
</template>

<script>
	import { version } from '@/uni_modules/z-paging/package.json'
	export default {
		name:"index-nav",
		data() {
			return {
				version
			};
		},
		methods: {
			navClick() {
				const url = 'https://z-paging.zxlee.cn/';
				// #ifdef APP-PLUS
				plus.runtime.openURL(url);  
				// #endif
				// #ifdef H5
				window.open(url);
				// #endif
			}
		},
	}
</script>

<style scoped>
	.version-tag {
		font-weight: bold;
		color: white;
		padding: 1px 4px;
		border-radius: 4rpx;
		font-size: 12px;
		transform: scale(0.85);
		margin-left: -2px;
		margin-bottom: 3px;
	}
	
	.version-text {
		background-color: #007AFF;
	}
	
	.vue-version-text {
		background-color: #3eaf7c;
	}
</style>