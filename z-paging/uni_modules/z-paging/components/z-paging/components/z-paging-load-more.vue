<!-- [z-paging]上拉加载更多view -->
<template>
	<view class="zp-l-container" :style="[zConfig.customStyle]" @click="doClick">
		<template v-if="!zConfig.hideContent">
			<text v-if="zConfig.showNoMoreLine&&finalStatus===M.NoMore" :class="zConfig.defaultThemeStyle==='white'?'zp-l-line zp-l-line-white':'zp-l-line zp-l-line-black'"
				:style="[zConfig.noMoreLineCustomStyle]" />
			<!-- #ifndef APP-NVUE -->
			<image v-if="finalStatus===M.Loading&&zConfig.loadingIconCustomImage.length"
				:src="zConfig.loadingIconCustomImage" :style="[zConfig.iconCustomStyle]" :class="{'zp-l-line-loading-custom-image':true,'zp-l-line-loading-custom-image-animated':zConfig.loadingAnimated}" />
			<image v-if="finalStatus===M.Loading&&zConfig.loadingIconType==='flower'&&!zConfig.loadingIconCustomImage.length"
				class="zp-line-loading-image" :style="[zConfig.iconCustomStyle]" :src="zConfig.defaultThemeStyle==='white'?base64FlowerWhite:base64Flower" />
			<!-- #endif -->
			<!-- #ifdef APP-NVUE -->
			<view>
				<loading-indicator v-if="finalStatus===M.Loading&&zConfig.loadingIconType!=='circle'" class="zp-line-loading-image" :style="[{color:zConfig.defaultThemeStyle==='white'?'white':'#777777'}]" animating />
			</view>
			<!-- #endif -->
			<text v-if="finalStatus===M.Loading&&zConfig.loadingIconType==='circle'&&!zConfig.loadingIconCustomImage.length"
				:class="zConfig.defaultThemeStyle==='white'?'zp-l-line-loading-view zp-l-line-loading-view-white':'zp-l-line-loading-view zp-l-line-loading-view-black'" :style="[zConfig.iconCustomStyle]" />
			<text :class="zConfig.defaultThemeStyle==='white'?'zp-l-text zp-l-text-white':'zp-l-text zp-l-text-black'" :style="[zConfig.titleCustomStyle]">{{ownLoadingMoreText}}</text>
			<text v-if="zConfig.showNoMoreLine&&finalStatus===M.NoMore" :class="zConfig.defaultThemeStyle==='white'?'zp-l-line zp-l-line-white':'zp-l-line zp-l-line-black'" :style="[zConfig.noMoreLineCustomStyle]" />
		</template>
	</view>
</template>
<script>
	import zStatic from '../js/z-paging-static'
	import Enum from '../js/z-paging-enum'
	export default {
		name: 'z-paging-load-more',
		data() {
			return {
				M: Enum.More,
				base64Arrow: zStatic.base64Arrow,
				base64Flower: zStatic.base64Flower,
				base64FlowerWhite: zStatic.base64FlowerWhite,
			};
		},
		props: ['zConfig'],
		computed: {
			ownLoadingMoreText() {
				return this.statusTextArr[this.finalStatus];
			},
			statusTextArr() {
				return [this.zConfig.defaultText,this.zConfig.loadingText,this.zConfig.noMoreText,this.zConfig.failText];
			},
			finalStatus() {
				if (this.zConfig.defaultAsLoading && this.zConfig.status === this.M.Default) return this.M.Loading;
				return this.zConfig.status;
			}
		},
		methods: {
			doClick() {
				this.$emit('doClick');
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
		width: 23rpx;
		height: 23rpx;
		border: 3rpx solid #dddddd;
		border-radius: 50%;
		/* #ifndef APP-NVUE */
		animation: loading-circle 1s linear infinite;
		/* #endif */
		/* #ifdef APP-NVUE */
		width: 30rpx;
		height: 30rpx;
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
	
	/* #ifndef APP-NVUE */
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
	/* #endif */
</style>
