<!-- [z-paging]上拉加载更多view -->

<template>
	<view class="zp-l-container" :style="[zConfig.customStyle]">
		<text
			:class="zConfig.defaultThemeStyle==='white'?'zp-l-line zp-l-line-white':'zp-l-line zp-l-line-black'"
			:style="[zConfig.noMoreLineCustomStyle]"
			v-if="zConfig.showNoMoreLine&&zConfig.status===2"></text>
		<!-- #ifndef APP-NVUE -->
		<image v-if="zConfig.status===1&&zConfig.loadingIconCustomImage.length"
			:src="zConfig.loadingIconCustomImage" :class="{'zp-l-line-loading-custom-image':true,'zp-l-line-loading-custom-image-animated':zConfig.loadingAnimated}">
		</image>
		<image
			v-if="zConfig.status===1&&zConfig.loadingIconType==='flower'&&!zConfig.loadingIconCustomImage.length"
			class="zp-line-loading-image" :style="[zConfig.iconCustomStyle]"
			:src="zConfig.defaultThemeStyle==='white'?base64FlowerWhite:base64Flower">
		</image>
		<!-- #endif -->
		<!-- #ifdef APP-NVUE -->
		<view>
			<loading-indicator v-if="zConfig.status===1"
				:style="[{color:zConfig.defaultThemeStyle==='white'?'white':'#777777'}]" :animating="true"
				class="zp-line-loading-image">
			</loading-indicator>
		</view>
		<!-- #endif -->
		<text
			v-if="zConfig.status===1&&zConfig.loadingIconType==='circle'&&!zConfig.loadingIconCustomImage.length"
			:class="zConfig.defaultThemeStyle==='white'?'zp-l-line-loading-view zp-l-line-loading-view-white':'zp-l-line-loading-view zp-l-line-loading-view-black'"
			:style="[zConfig.iconCustomStyle]"></text>
		<text
			:class="zConfig.defaultThemeStyle==='white'?'zp-l-text zp-l-text-white':'zp-l-text zp-l-text-black'">{{ownLoadingMoreText}}</text>
		<text
			:class="zConfig.defaultThemeStyle==='white'?'zp-l-line zp-l-line-white':'zp-l-line zp-l-line-black'"
			:style="[zConfig.noMoreLineCustomStyle]"
			v-if="zConfig.showNoMoreLine&&zConfig.status===2"></text>
	</view>
</template>
<script>
	import zStatic from '../js/z-paging-static'
	export default {
		name: 'z-paging-load-more',
		data() {
			return {
				base64Arrow: zStatic.base64Arrow,
				base64Flower: zStatic.base64Flower,
				base64FlowerWhite: zStatic.base64FlowerWhite,
			};
		},
		props: ['zConfig'],
		computed: {
			ownLoadingMoreText() {
				const loadingMoreText = this.loadingStatusTextMap[this.zConfig.status];
				return loadingMoreText;
			},
			loadingStatusTextMap() {
				return {
					0: this.zConfig.defaultText,
					1: this.zConfig.loadingText,
					2: this.zConfig.noMoreText,
					3: this.zConfig.failText,
				}
			}
		}
	}
</script>

<style scoped>
	@import "../css/z-paging-static.css";

	.zp-l-container {
		height: 80rpx;
		font-size: 27rpx;
		/* #ifndef APP-NVUE */
		clear: both;
		display: flex;
		/* #endif */
		flex-direction: row;
		align-items: center;
		justify-content: center;
	}

	.zp-l-line-loading-custom-image {
		color: #a4a4a4;
		margin-right: 8rpx;
		width: 28rpx;
		height: 28rpx;
	}
	
	.zp-l-line-loading-custom-image-animated{
		/* #ifndef APP-NVUE */
		animation: loading-circle 1s linear infinite;
		/* #endif */
	}

	.zp-l-line-loading-view {
		margin-right: 8rpx;
		width: 22rpx;
		height: 23rpx;
		border: 3rpx solid #dddddd;
		border-radius: 50%;
		/* #ifndef APP-NVUE */
		animation: loading-circle 1s linear infinite;
		/* #endif */
	}

	.zp-l-line-loading-view-black {
		border-color: #c8c8c8;
		border-top-color: #444444;
	}

	.zp-l-line-loading-view-white {
		border-color: #aaaaaa;
		border-top-color: #ffffff;
	}

	.zp-l-text {
		/* #ifdef APP-NVUE */
		font-size: 30rpx;
		margin: 0rpx 10rpx;
		/* #endif */
	}

	.zp-l-text-black {
		color: #a4a4a4;
	}

	.zp-l-text-white {
		color: #efefef;
	}

	.zp-l-line {
		height: 1px;
		width: 100rpx;
		margin: 0rpx 10rpx;
	}

	.zp-l-line-black {
		background-color: #eeeeee;
	}

	.zp-l-line-white {
		background-color: #efefef;
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
