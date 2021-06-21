<template>
	<view class="content">
		<!-- 这里设置了z-paging加载时禁止自动调用reload方法，自行控制何时reload（懒加载）-->
		<!--  :enable-back-to-top="currentIndex===tabIndex" 在微信小程序上可以多加这一句，因为默认是允许点击返回顶部的，但是这个页面有多个scroll-view，会全部返回顶部，所以需要控制是当前index才允许点击返回顶部 -->
		<z-paging ref="paging" @query="queryList" @updateList="updateList" :mounted-auto-call-reload="false"
			style="height: 100%;">
			<!-- 如果希望其他view跟着页面滚动，可以放在z-paging标签内 -->
			<!-- list数据，建议像下方这样在item外层套一个view，而非直接for循环item，因为slot插入有数量限制 -->
			<slot></slot>
			<view>
				<view class="item" v-for="(item,index) in dataList" :key="index" @click="itemClick(item)">
					<view class="item-title">{{item.title}}</view>
					<view class="item-detail">{{item.detail}}</view>
					<view class="item-line"></view>
				</view>
			</view>
		</z-paging>
	</view>
</template>

<script>
	import zPaging from '../../z-paging/z-paging'
	export default {
		name: "z-paging-swiper-item",
		components: {
			zPaging
		},
		data() {
			return {
				dataList: [],
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
				handler(newVal) {
					if (newVal === this.tabIndex) {
						//懒加载，当滑动到当前的item时，才去加载
						if (!this.firstLoaded) {
							console.log('切换了',newVal)
							this.$nextTick(() => {
								this.$refs.paging.reload();
							})
						}
					}
				},
				immediate: true
			}
		},
		methods: {
			queryList(pageNo, pageSize) {
				//组件加载时会自动触发此方法，因此默认页面加载时会自动触发，无需手动调用
				//这里的pageNo和pageSize会自动计算好，直接传给服务器即可
				//模拟请求服务器获取分页数据，请替换成自己的网络请求
				// this.$request.queryList(pageNo, pageSize, this.tabIndex + 1, (data) => {
				// 	this.$refs.paging.complete(data);
				// 	this.firstLoaded = true;
				// })
				this.$emit('query',pageNo,pageSize);
			},
			complete(data){
				this.$refs.paging.complete(data);
			},
			updateList(list){
				this.$emit('updateList',list);
			},
			itemClick(item) {
				console.log('点击了', item.title);
			}
		}
	}
</script>

<style>
	.content {
		height: 100%;
	}
</style>
