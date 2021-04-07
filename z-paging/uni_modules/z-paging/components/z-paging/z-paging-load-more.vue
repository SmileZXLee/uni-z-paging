<!-- z-paging -->
<!-- github地址:https://github.com/SmileZXLee/uni-z-paging -->
<!-- dcloud地址:https://ext.dcloud.net.cn/plugin?id=3935 -->
<!-- 反馈QQ群：790460711 -->

<!-- 上拉加载更多view -->
<template>
	<view class="zp-load-more-container" :style="[config.loadingMoreCustomStyle]">
		<text
			:class="config.defaultThemeStyle==='white'?'zp-loading-more-line zp-loading-more-line-white':'zp-loading-more-line zp-loading-more-line-black'"
			:style="[config.loadingMoreNoMoreLineCustomStyle]"
			v-if="config.showLoadingMoreNoMoreLine&&config.loadingStatus===2"></text>
		<!-- #ifndef APP-NVUE -->
		<image v-if="config.loadingStatus===1&&config.loadingMoreLoadingIconCustomImage.length"
			:src="config.loadingMoreLoadingIconCustomImage" class="zp-loading-more-line-loading-custom-image">
		</image>
		<image
			v-if="config.loadingStatus===1&&config.loadingMoreLoadingIconType==='flower'&&!config.loadingMoreLoadingIconCustomImage.length"
			class="zp-loading-more-line-loading-image" :style="[config.loadingMoreLoadingIconCustomStyle]"
			:src="base64Flower">
		</image>
		<!-- #endif -->
		<!-- #ifdef APP-NVUE -->
		<view>
			<loading-indicator v-if="config.loadingStatus===1" :animating="true"
				class="zp-loading-more-line-loading-image">
			</loading-indicator>
		</view>
		<!-- #endif -->
		<text
			v-if="config.loadingStatus===1&&config.loadingMoreLoadingIconType==='circle'&&!config.loadingMoreLoadingIconCustomImage.length"
			:class="config.defaultThemeStyle==='white'?'zp-loading-more-line-loading-view zp-loading-more-line-loading-view-white':'zp-loading-more-line-loading-view zp-loading-more-line-loading-view-black'"
			:style="[config.loadingMoreLoadingIconCustomStyle]"></text>
		<text
			:class="config.defaultThemeStyle==='white'?'zp-loading-more-text zp-loading-more-text-white':'zp-loading-more-text zp-loading-more-text-black'">{{ownLoadingMoreText}}</text>
		<text
			:class="config.defaultThemeStyle==='white'?'zp-loading-more-line zp-loading-more-line-white':'zp-loading-more-line zp-loading-more-line-black'"
			:style="[config.loadingMoreNoMoreLineCustomStyle]"
			v-if="config.showLoadingMoreNoMoreLine&&config.loadingStatus===2"></text>
	</view>
</template>
<script>
	import zStatic from './z-paging-static'
	export default {
		name: 'z-paging-refresh',
		data() {
			return {
				base64Arrow: zStatic.base64Arrow,
				base64Flower: zStatic.base64Flower,
				loadingStatusTextMap: {
					0: this.config.loadingMoreDefaultText,
					1: this.config.loadingMoreLoadingText,
					2: this.config.loadingMoreNoMoreText,
					3: this.config.loadingMoreFailText,
				},
			};
		},
		props: ['config'],
		computed: {
			ownLoadingMoreText() {
				if (this.config.loadingMoreText.length) {
					return this.config.loadingMoreText;
				}
				return this.loadingStatusTextMap[this.config.loadingStatus];
			},
		}
	}
</script>

<style scoped>
	@import "./z-paging-static.css";

	.zp-load-more-container {
		height: 80rpx;
		font-size: 26rpx;
		/* #ifndef APP-NVUE */
		clear: both;
		display: flex;
		/* #endif */
		flex-direction: row;
		align-items: center;
		justify-content: center;
	}

	.zp-loading-more-line-loading-custom-image {
		color: #a4a4a4;
		margin-right: 8rpx;
		width: 28rpx;
		height: 28rpx;
		/* #ifndef APP-NVUE */
		animation: loading-circle 1s linear infinite;
		/* #endif */
	}

	.zp-loading-more-line-loading-view {
		margin-right: 8rpx;
		width: 22rpx;
		height: 23rpx;
		border: 3rpx solid #dddddd;
		border-radius: 50%;
		/* #ifndef APP-NVUE */
		animation: loading-circle 1s linear infinite;
		/* #endif */
	}

	.zp-loading-more-line-loading-view-black {
		border-color: #c8c8c8;
		border-top-color: #444444;
	}

	.zp-loading-more-line-loading-view-white {
		border-color: #aaaaaa;
		border-top-color: #ffffff;
	}

	.zp-loading-more-text {
		/* #ifdef APP-NVUE */
		font-size: 30rpx;
		margin: 0rpx 10rpx;
		/* #endif */
	}

	.zp-loading-more-text-black {
		color: #a4a4a4;
	}

	.zp-loading-more-text-white {
		color: #efefef;
	}

	.zp-loading-more-line {
		height: 1px;
		width: 100rpx;
		margin: 0rpx 10rpx;
	}

	.zp-loading-more-line-black {
		background-color: #eeeeee;
	}

	.zp-loading-more-line-white {
		background-color: #cccccc;
	}

	@keyframes loading-circle {
		0% {
			-webkit-transform: rotate(0deg);
			transform: rotate(0deg);
		}

		100% {
			-webkit-transform: rotate(360deg);
			transform: rotate(360deg);
		}
	}
</style>
