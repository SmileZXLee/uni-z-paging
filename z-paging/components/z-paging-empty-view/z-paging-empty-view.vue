<!-- z-paging -->
<!-- github地址:https://github.com/SmileZXLee/uni-z-paging -->
<!-- dcloud地址:https://ext.dcloud.net.cn/plugin?id=3935 -->
<!-- 反馈QQ群：790460711 -->

<!-- 空数据占位view，此组件支持easycom规范，可以在项目中直接引用 -->
<template>
	<view :class="{'zp-container':true,'zp-container-fixed':emptyViewFixed}" :style="[finalEmptyViewStyle]" @click="emptyViewClick">
		<view class="zp-main">
			<image v-if="!emptyViewImg.length" :class="{'zp-main-image-rpx':unit==='rpx','zp-main-image-px':unit==='px'}" :style="[emptyViewImgStyle]" :src="emptyImg" />
			<image v-else :class="{'zp-main-image-rpx':unit==='rpx','zp-main-image-px':unit==='px'}" mode="aspectFit" :style="[emptyViewImgStyle]" :src="emptyViewImg" />
			<text class="zp-main-title" :class="{'zp-main-title-rpx':unit==='rpx','zp-main-title-px':unit==='px'}" :style="[emptyViewTitleStyle]">{{emptyViewText}}</text>
			<text v-if="showEmptyViewReload" :class="{'zp-main-error-btn':true,'zp-main-error-btn-rpx':unit==='rpx','zp-main-error-btn-px':unit==='px'}" :style="[emptyViewReloadStyle]" @click.stop="reloadClick">{{emptyViewReloadText}}</text>
		</view>
	</view>
</template>

<script>
	import zStatic from '../z-paging/js/z-paging-static'
	
	/**
	 * z-paging-empty-view 空数据组件
	 * @description 通用的 z-paging 空数据组件
	 * @tutorial https://z-paging.zxlee.cn/api/sub-components/main.html#z-paging-empty-view配置
	 * @property {Boolean} emptyViewFixed 空数据图片是否铺满 z-paging，默认为 false。若设置为 true，则为填充满 z-paging 的剩余部分
	 * @property {String} emptyViewText 空数据图描述文字，默认为 '没有数据哦~'
	 * @property {String} emptyViewImg 空数据图图片，默认使用 z-paging 内置的图片 (建议使用绝对路径，开头不要添加 "@"，请以 "/" 开头)
	 * @property {String} emptyViewReloadText 空数据图点击重新加载文字，默认为 '重新加载'
	 * @property {Object} emptyViewStyle 空数据图样式，可设置空数据 view 的 top 等，如: empty-view-style="{'top':'100rpx'}" (如果空数据图不是 fixed 布局，则此处是 margin-top)，默认为 {}
	 * @property {Object} emptyViewImgStyle 空数据图 img 样式，默认为 {}
	 * @property {Object} emptyViewTitleStyle 空数据图描述文字样式，默认为 {}
	 * @property {Object} emptyViewReloadStyle 空数据图重新加载按钮样式，默认为 {}
	 * @property {Boolean} showEmptyViewReload 是否显示空数据图重新加载按钮(无数据时)，默认为 false
	 * @property {Boolean} isLoadFailed 是否是加载失败，默认为 false
	 * @property {String} unit 空数据图中布局的单位，默认为 'rpx'
	 * @event {Function} reload 点击了重新加载按钮
	 * @event {Function} viewClick 点击了空数据图 view
	 * @example <z-paging-empty-view empty-view-text="暂无数据" />
	 */
	export default {
		name: "z-paging-empty-view",
		data() {
			return {
				
			};
		},
		props: {
			// 空数据描述文字
			emptyViewText: {
				type: String,
				default: '没有数据哦~'
			},
			// 空数据图片
			emptyViewImg: {
				type: String,
				default: ''
			},
			// 是否显示空数据图重新加载按钮
			showEmptyViewReload: {
				type: Boolean,
				default: false
			},
			// 空数据点击重新加载文字
			emptyViewReloadText: {
				type: String,
				default: '重新加载'
			},
			// 是否是加载失败
			isLoadFailed: {
				type: Boolean,
				default: false
			},
			// 空数据图样式
			emptyViewStyle: {
				type: Object,
				default: function() {
                    return {}
                }
			},
			// 空数据图img样式
			emptyViewImgStyle: {
				type: Object,
				default: function() {
				    return {}
				}
			},
			// 空数据图描述文字样式
			emptyViewTitleStyle: {
				type: Object,
				default: function() {
				    return {}
				}
			},
			// 空数据图重新加载按钮样式
			emptyViewReloadStyle: {
				type: Object,
				default: function() {
				    return {}
				}
			},
			// 空数据图z-index
			emptyViewZIndex: {
				type: Number,
				default: 9
			},
			// 空数据图片是否使用fixed布局并铺满z-paging
			emptyViewFixed: {
				type: Boolean,
				default: true
			},
			// 空数据图中布局的单位，默认为rpx
			unit: {
				type: String,
				default: 'rpx'
			}
		},
		computed: {
			emptyImg() {
                return this.isLoadFailed ? zStatic.base64Error : zStatic.base64Empty;
			},
			finalEmptyViewStyle(){
				this.emptyViewStyle['z-index'] = this.emptyViewZIndex;
				return this.emptyViewStyle;
			}
		},
		methods: {
			// 点击了reload按钮
			reloadClick() {
				this.$emit('reload');
			},
			// 点击了空数据view
			emptyViewClick() {
				this.$emit('viewClick');
			}
		}
	}
</script>

<style scoped>
	.zp-container{
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		align-items: center;
		justify-content: center;
	}
	.zp-container-fixed {
		/* #ifndef APP-NVUE */
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		/* #endif */
		/* #ifdef APP-NVUE */
		flex: 1;
		/* #endif */
	}

	.zp-main{
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
		align-items: center;
        padding: 50rpx 0rpx;
	}

	.zp-main-image-rpx {
		width: 240rpx;
		height: 240rpx;
	}
	.zp-main-image-px {
		width: 120px;
		height: 120px;
	}

	.zp-main-title {
		color: #aaaaaa;
		text-align: center;
	}
	.zp-main-title-rpx {
		font-size: 28rpx;
		margin-top: 10rpx;
		padding: 0rpx 20rpx;
	}
	.zp-main-title-px {
		font-size: 14px;
		margin-top: 5px;
		padding: 0px 10px;
	}

	.zp-main-error-btn {
		border: solid 1px #dddddd;
		color: #aaaaaa;
	}
	.zp-main-error-btn-rpx {
		font-size: 28rpx;
		padding: 8rpx 24rpx;
		border-radius: 6rpx;
		margin-top: 50rpx;
	}
	.zp-main-error-btn-px {
		font-size: 14px;
		padding: 4px 12px;
		border-radius: 3px;
		margin-top: 25px;
	}
</style>
