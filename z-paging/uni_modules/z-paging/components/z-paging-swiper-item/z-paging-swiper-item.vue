<!-- z-paging -->
<!-- github地址:https://github.com/SmileZXLee/uni-z-paging -->
<!-- dcloud地址:https://ext.dcloud.net.cn/plugin?id=3935 -->
<!-- 反馈QQ群：790460711 -->

<!-- 滑动切换选项卡swiper-item，此组件支持easycom规范，可以在项目中直接引用 -->
<template>
	<view class="zp-swiper-item-container">
		<z-paging ref="paging" :fixed="false" @query="_queryList" @listChange="_updateList" :mounted-auto-call-reload="false"
			style="height: 100%;">
			<slot></slot>
		</z-paging>
	</view>
</template>

<script>
	import zPaging from '../z-paging/z-paging'
	export default {
		name: "z-paging-swiper-item",
		components: {
			zPaging
		},
		data() {
			return {
				firstLoaded: false
			}
		},
		props: {
			//当前组件的index，也就是当前组件是swiper中的第几个
			tabIndex: {
				type: Number,
				default: function() {
					return 0
				}
			},
			//当前swiper切换到第几个index
			currentIndex: {
				type: Number,
				default: function() {
					return 0
				}
			},
		},
		watch: {
			currentIndex: {
				handler(newVal, oldVal) {
					if (newVal === this.tabIndex) {
						//懒加载，当滑动到当前的item时，才去加载
						if (!this.firstLoaded) {
							setTimeout(() => {
								this.$refs.paging.reload();
							}, 5);
						}
					}
				},
				immediate: true
			}
		},
		methods: {
			reload(data) {
				this.$refs.paging.reload(data);
			},
			complete(data) {
				this.firstLoaded = true;
				this.$refs.paging.complete(data);
			},
			_queryList(pageNo, pageSize) {
				this.$emit('query', pageNo, pageSize);
			},
			_updateList(list) {
				this.$emit('updateList', list);
			}
		}
	}
</script>

<style scoped>
	.zp-swiper-item-container {
		/* #ifndef APP-NVUE */
		height: 100%;
		/* #endif */
		/* #ifdef APP-NVUE */
		flex: 1;
		/* #endif */
	}
</style>
