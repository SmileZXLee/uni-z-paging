<!-- 在这个文件对每个tab对应的列表进行渲染 -->
<template>
	<view class="content">
		<!--  :enable-back-to-top="currentIndex===tabIndex" 在nvue上可以多加这一句，因为默认是允许点击返回顶部的，但是这个页面有多个scroll-view，会全部返回顶部，所以需要控制是当前index才允许点击返回顶部 -->
		<!-- 如果当前页已经加载过数据或者当前切换到的tab是当前页，才展示当前页数据（懒加载） -->
		<z-paging v-if="firstLoaded || isCurrentPage" ref="paging" class="paging" v-model="dataList" @query="queryList" :fixed="false">
			<!-- 在nvue中，z-paging中插入的列表item必须是cell，必须使用cell包住，因为在nvue中，z-paging使用的是nvue的list组件。 -->
			<!-- 不能使用index作为key的唯一标识，:key必须添加并且必须是唯一的 -->
			<!-- 如果希望在vue中渲染view，nvue中渲染cell，可使用z-paging-cell代替cell -->
			<cell class="item" v-for="(item,index) in dataList" :key="item.title" @click="itemClick(item)">
				<text class="item-title">{{item.title}}</text>
				<text class="item-detail">{{item.detail}}</text>
				<view class="item-line"></view>
			</cell>
		</z-paging>
	</view>
</template>

<script>
	import request from '../../http/request.js'
	export default {
		data() {
			return {
				// v-model绑定的这个变量不要在分页请求结束中自己赋值！！！
				dataList: [],
				// 当前组件是否已经加载过了
				firstLoaded: false,
				// 是否滚动到当前页
				isCurrentPage: false
			}
		},
		props: {
			// 当前组件的index，也就是当前组件是swiper中的第几个
			tabIndex: {
				type: Number,
				default: function(){
					return 0
				}
			},
			// 当前swiper切换到第几个index
			currentIndex: {
				type: Number,
				default: function(){
					return 0
				}
			}
		},
		watch: {
			currentIndex: {
				handler(newVal) {
					if(newVal === this.tabIndex){
						// 懒加载，当滑动到当前的item时，才去加载
						if(!this.firstLoaded){
							// 这里需要延迟渲染z-paging的原因是为了避免在一些平台上立即渲染可能引发的底层报错问题
							this.$nextTick(() => {
								this.isCurrentPage = true;
							})
						}
					}
				},
				immediate: true
			},
		},
		methods: {
			// 接收父组件传过来的刷新列表要求
			reload() {
				// 刷新列表数据(如果不希望列表pageNo被重置可以用refresh代替reload方法)
				this.$refs.paging && this.$refs.paging.reload();	
			},
			queryList(pageNo, pageSize) {
				// 组件加载时会自动触发此方法，因此默认页面加载时会自动触发，无需手动调用
				// 这里的pageNo和pageSize会自动计算好，直接传给服务器即可
				// 模拟请求服务器获取分页数据，请替换成自己的网络请求
				const params = {
					pageNo: pageNo,
					pageSize: pageSize,
					type: this.tabIndex + 1
				}
				request.queryList(params).then(res => {
					//将请求的结果数组传递给z-paging
					this.$refs.paging.complete(res.data.list);
					this.firstLoaded = true;
				}).catch(res => {
					// 如果请求失败写this.$refs.paging.complete(false);
					// 注意，每次都需要在catch中写这句话很麻烦，z-paging提供了方案可以全局统一处理
					// 在底层的网络请求抛出异常时，写uni.$emit('z-paging-error-emit');即可
					this.$refs.paging.complete(false);
				})
			},
			itemClick(item) {
				console.log('点击了', item.title);
			}
		}
	}
</script>

<style scoped>
	.content {
		flex: 1;
		/* #ifndef APP-NVUE */
		height: 100%;
		/* #endif */
	}
	
	.paging{
		/* #ifndef APP-NVUE */
		height: 100%;
		/* #endif */
	}
	
	.item {
		flex-direction: row;
		position: relative;
		height: 150rpx;
		align-items: center;
		justify-content: space-between;
		padding: 0rpx 30rpx;
	}

	.item-detail {
		padding: 5rpx 15rpx;
		border-radius: 10rpx;
		font-size: 28rpx;
		color: white;
		background-color: #007AFF;
	}

	.item-line {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		height: 1px;
		background-color: #eeeeee;
	}
</style>
