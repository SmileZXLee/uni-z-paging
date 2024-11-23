<!-- [z-paging]上拉加载更多view -->
<template>
	<view class="zp-l-container" :class="{'zp-l-container-rpx':c.unit==='rpx','zp-l-container-px':c.unit==='px'}" :style="[c.customStyle]" @click="doClick">
		<template v-if="!c.hideContent">
			<!-- 底部加载更多没有更多数据分割线 -->
			<text v-if="c.showNoMoreLine&&finalStatus===M.NoMore" :class="{'zp-l-line-rpx':c.unit==='rpx','zp-l-line-px':c.unit==='px'}" :style="[{backgroundColor:zTheme.line[ts]},c.noMoreLineCustomStyle]" />
			<!-- 底部加载更多loading -->
			<!-- #ifndef APP-NVUE -->
			<image v-if="finalStatus===M.Loading&&!!c.loadingIconCustomImage"
				:src="c.loadingIconCustomImage" :style="[c.iconCustomStyle]" :class="{'zp-l-line-loading-custom-image':true,'zp-l-line-loading-custom-image-animated':c.loadingAnimated,'zp-l-line-loading-custom-image-rpx':c.unit==='rpx','zp-l-line-loading-custom-image-px':c.unit==='px'}" />
			<image v-if="finalStatus===M.Loading&&finalLoadingIconType==='flower'&&!c.loadingIconCustomImage.length"
				:class="{'zp-line-loading-image':true,'zp-line-loading-image-rpx':c.unit==='rpx','zp-line-loading-image-px':c.unit==='px'}" :style="[c.iconCustomStyle]" :src="zTheme.flower[ts]" />
			<!-- #endif -->
			<!-- #ifdef APP-NVUE -->
			<!-- 在nvue中底部加载更多loading使用系统自带的 -->
			<view>
				<loading-indicator v-if="finalStatus===M.Loading&&finalLoadingIconType!=='circle'" :class="{'zp-line-loading-image-rpx':c.unit==='rpx','zp-line-loading-image-px':c.unit==='px'}" :style="[{color:zTheme.indicator[ts]}]" :animating="true" />
			</view>
			<!-- #endif -->
			<!-- 底部加载更多文字 -->
			<text v-if="finalStatus===M.Loading&&finalLoadingIconType==='circle'&&!c.loadingIconCustomImage.length"
				class="zp-l-circle-loading-view" :class="{'zp-l-circle-loading-view-rpx':c.unit==='rpx','zp-l-circle-loading-view-px':c.unit==='px'}" :style="[{borderColor:zTheme.circleBorder[ts],borderTopColor:zTheme.circleBorderTop[ts]},c.iconCustomStyle]" />
			<text v-if="!c.isChat||(!c.chatDefaultAsLoading&&finalStatus===M.Default)||finalStatus===M.Fail" :class="{'zp-l-text-rpx':c.unit==='rpx','zp-l-text-px':c.unit==='px'}" :style="[{color:zTheme.title[ts]},c.titleCustomStyle]">{{ownLoadingMoreText}}</text>
			<!-- 底部加载更多没有更多数据分割线 -->
			<text v-if="c.showNoMoreLine&&finalStatus===M.NoMore" :class="{'zp-l-line-rpx':c.unit==='rpx','zp-l-line-px':c.unit==='px'}" :style="[{backgroundColor:zTheme.line[ts]},c.noMoreLineCustomStyle]" />
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
				zTheme: {
					title: { white: '#efefef', black: '#a4a4a4' },
					line: { white: '#efefef', black: '#eeeeee' },
					circleBorder: { white: '#aaaaaa', black: '#c8c8c8' },
					circleBorderTop: { white: '#ffffff', black: '#444444' },
					flower: { white: zStatic.base64FlowerWhite, black: zStatic.base64Flower },
					indicator: { white: '#eeeeee', black: '#777777' }
				}
			};
		},
		props: ['zConfig'],
		computed: {
			ts() {
				return this.c.defaultThemeStyle;
			},
			// 底部加载更多配置
			c() {
				return this.zConfig || {};
			},
			// 底部加载更多文字
			ownLoadingMoreText() {
				return {
				    [this.M.Default]: this.c.defaultText,
				    [this.M.Loading]: this.c.loadingText,
				    [this.M.NoMore]: this.c.noMoreText,
				    [this.M.Fail]: this.c.failText,
				}[this.finalStatus];
			},
			// 底部加载更多状态
			finalStatus() {
				if (this.c.defaultAsLoading && this.c.status === this.M.Default) return this.M.Loading;
				return this.c.status;
			},
			// 加载更多icon类型
			finalLoadingIconType() {
				// #ifdef APP-NVUE
				return 'flower';
				// #endif
				return this.c.loadingIconType;
			}
		},
		methods: {
			// 点击了加载更多
			doClick() {
				this.$emit('doClick');
			}
		}
	}
</script>

<style scoped>
	@import "../css/z-paging-static.css";

	.zp-l-container {
		/* #ifndef APP-NVUE */
		clear: both;
		display: flex;
		/* #endif */
		flex-direction: row;
		align-items: center;
		justify-content: center;
	}
	.zp-l-container-rpx {
		height: 80rpx;
		font-size: 27rpx;
	}
	.zp-l-container-px {
		height: 40px;
		font-size: 14px;
	}

	.zp-l-line-loading-custom-image {
		color: #a4a4a4;
	}
	.zp-l-line-loading-custom-image-rpx {
		margin-right: 8rpx;
		width: 28rpx;
		height: 28rpx;
	}
	.zp-l-line-loading-custom-image-px {
		margin-right: 4px;
		width: 14px;
		height: 14px;
	}
	
	.zp-l-line-loading-custom-image-animated{
		/* #ifndef APP-NVUE */
		animation: loading-circle 1s linear infinite;
		/* #endif */
	}

	.zp-l-circle-loading-view {
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
	.zp-l-circle-loading-view-rpx {
		margin-right: 8rpx;
		width: 23rpx;
		height: 23rpx;
	}
	.zp-l-circle-loading-view-px {
		margin-right: 4px;
		width: 12px;
		height: 12px;
	}

	.zp-l-text-rpx {
		font-size: 30rpx;
		margin: 0rpx 6rpx;
	}
	.zp-l-text-px {
		font-size: 15px;
		margin: 0px 3px;
	}

	.zp-l-line-rpx {
		height: 1px;
		width: 100rpx;
		margin: 0rpx 10rpx;
	}
	.zp-l-line-px {
		height: 1px;
		width: 50px;
		margin: 0rpx 5px;
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
