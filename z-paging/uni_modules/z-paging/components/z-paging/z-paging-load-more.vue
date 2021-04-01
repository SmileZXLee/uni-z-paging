<!-- z-paging -->
<!-- github地址:https://github.com/SmileZXLee/uni-z-paging -->
<!-- dcloud地址:https://ext.dcloud.net.cn/plugin?id=3935 -->
<!-- 反馈QQ群：790460711 -->

<!-- 上拉加载更多view -->
<template>
	<view class="load-more-container" :style="[config.loadingMoreCustomStyle]">
		<text
			:class="config.defaultThemeStyle==='white'?'loading-more-line loading-more-line-white':'loading-more-line loading-more-line-black'"
			:style="[config.loadingMoreNoMoreLineCustomStyle]"
			v-if="config.showLoadingMoreNoMoreLine&&config.loadingStatus===2"></text>
		<!-- #ifndef APP-NVUE -->
		<image v-if="config.loadingStatus===1&&config.loadingMoreLoadingIconCustomImage.length"
			:src="config.loadingMoreLoadingIconCustomImage" class="loading-more-line-loading-custom-image">
		</image>
		<image
			v-if="config.loadingStatus===1&&config.loadingMoreLoadingIconType==='flower'&&!config.loadingMoreLoadingIconCustomImage.length"
			class="loading-more-line-loading-image" :style="[config.loadingMoreLoadingIconCustomStyle]"
			:src="base64Flower">
		</image>
		<!-- #endif -->
		<!-- #ifdef APP-NVUE -->
		<view>
			<loading-indicator v-if="config.loadingStatus===1" :animating="true"
				class="loading-more-line-loading-image">
			</loading-indicator>
		</view>
		<!-- #endif -->
		<text
			v-if="config.loadingStatus===1&&config.loadingMoreLoadingIconType==='circle'&&!config.loadingMoreLoadingIconCustomImage.length"
			:class="config.defaultThemeStyle==='white'?'loading-more-line-loading-view loading-more-line-loading-view-white':'loading-more-line-loading-view loading-more-line-loading-view-black'"
			:style="[config.loadingMoreLoadingIconCustomStyle]"></text>
		<text
			:class="config.defaultThemeStyle==='white'?'loading-more-text loading-more-text-white':'loading-more-text loading-more-text-black'">{{ownLoadingMoreText}}</text>
		<text
			:class="config.defaultThemeStyle==='white'?'loading-more-line loading-more-line-white':'loading-more-line loading-more-line-black'"
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

	.load-more-container {
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

	.loading-more-line-loading-custom-image {
		color: #a4a4a4;
		margin-right: 8rpx;
		width: 28rpx;
		height: 28rpx;
		/* #ifndef APP-NVUE */
		animation: loading-circle 1s linear infinite;
		/* #endif */
	}

	.loading-more-line-loading-view {
		margin-right: 8rpx;
		width: 22rpx;
		height: 23rpx;
		border: 3rpx solid #dddddd;
		border-radius: 50%;
		/* #ifndef APP-NVUE */
		animation: loading-circle 1s linear infinite;
		/* #endif */
	}

	.loading-more-line-loading-view-black {
		border-color: #c8c8c8;
		border-top-color: #444444;
	}

	.loading-more-line-loading-view-white {
		border-color: #aaaaaa;
		border-top-color: #ffffff;
	}

	.loading-more-text {
		/* #ifdef APP-NVUE */
		font-size: 30rpx;
		margin: 0rpx 10rpx;
		/* #endif */
	}

	.loading-more-text-black {
		color: #a4a4a4;
	}

	.loading-more-text-white {
		color: #efefef;
	}

	.loading-more-line {
		height: 1px;
		width: 100rpx;
		margin: 0rpx 10rpx;
	}

	.loading-more-line-black {
		background-color: #eeeeee;
	}

	.loading-more-line-white {
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
