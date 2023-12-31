<!-- 在这个文件对每个tab对应的列表进行渲染 -->
<template>
	<view class="content">
		<!-- 这里设置了z-paging加载时禁止自动调用reload方法，自行控制何时reload（懒加载）-->
		<!-- watch-touch-direction-change用于开启监听列表触摸方向，只有当当前组件的列表滚动到顶部并且吸顶才需要判断-->
		<z-paging ref="paging" @scroll="scroll" v-model="dataList" @query="queryList" :watch-touch-direction-change="true" @touchDirectionChange="touchDirectionChange" :fixed="false" :scrollable="scrollable"
			:refresher-enabled="false" @scrolltoupper="scrolltoupper" :auto="false">
			<!-- 如果希望其他view跟着页面滚动，可以放在z-paging标签内 -->
			<view class="item" v-for="(item,index) in dataList" :key="index">
				<view class="item-title">{{item.title}}</view>
				<view class="item-detail">{{item.detail}}</view>
				<view class="item-line"></view>
			</view>
		</z-paging>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// v-model绑定的这个变量不要在分页请求结束中自己赋值！！！
				dataList: [],
				scrollTop: 0,
				firstLoaded: false,
				//当前组件内的列表是否允许滚动
				scrollable: false,
				//是否已经吸顶了
				stickyed: false,
				//用于暂存请求结束回调方法
				completeFunc: null
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
					if (newVal === this.tabIndex) {
						// 懒加载，当滑动到当前的item时，才去加载
						if(!this.firstLoaded){
							this.$nextTick(() => {
								setTimeout(() => {
									this.$refs.paging.reload();
									setTimeout(()=> {
										//首次切换到当前tab时，如果当前是吸顶状态，则设置当前列表允许滚动
										if(this.stickyed){
											this.scrollable = true;
										}
									}, 100);
								}, 100);
							})
						}
						// 非首次切换到当前tab时，如果scrollTop=0，则页面list允许滚动
						if(this.scrollTop === 0 && this.firstLoaded){
							this.$emit('setScrollable', true);
						}
					}
				},
				immediate: true
			}
		},
		methods: {
			
			// -----------组件暴露给页面调用的方法-------------
			// 当页面需要控制子组件列表是否可以滚动时调用此方法
			setScrollable(scrollable) {
				this.scrollable = scrollable;
				this.stickyed = this.scrollable;
			},
			// 当页面需要触发子组件列表刷新时调用此方法
			reload(completeFunc) {
				//先把父组件下拉刷新的回调函数存起来
				this.completeFunc = completeFunc;
				//调用z-paging的reload方法
				this.$refs.paging.reload();
			},
			
			//-----------组件的私有方法-------------
			queryList(pageNo, pageSize) {
				// 组件加载时会自动触发此方法，因此默认页面加载时会自动触发，无需手动调用
				// 这里的pageNo和pageSize会自动计算好，直接传给服务器即可
				// 模拟请求服务器获取分页数据，请替换成自己的网络请求
				const params = {
					pageNo: pageNo,
					pageSize: pageSize,
					type: this.tabIndex + 1
				}
				this.$request.queryList(params).then(res => {
					this.$refs.paging.complete(res.data.list);
					this.firstLoaded = true;
					// 请求结束，调用父组件的下拉刷新结束回调函数，使得父组件中的z-paging下拉刷新结束
					if (this.completeFunc) {
						this.completeFunc();
					}
				}).catch(res => {
					// 如果请求失败写this.$refs.paging.complete(false);
					// 注意，每次都需要在catch中写这句话很麻烦，z-paging提供了方案可以全局统一处理
					// 在底层的网络请求抛出异常时，写uni.$emit('z-paging-error-emit');即可
					this.$refs.paging.complete(false);
					// 请求结束，调用父组件的下拉刷新结束回调函数，使得父组件中的z-paging下拉刷新结束
					if (this.completeFunc) {
						this.completeFunc();
					}
				})
			},
			// 当列表滚动到顶部时
			scrolltoupper() {
				this.scrollTop = 0;
				this.$emit('setScrollable', true);
			},
			// 监听列表滚动
			scroll(e){
				this.scrollTop = e.detail.scrollTop;
				if(this.scrollTop > 10){
					this.$emit('setScrollable', false);
				}
				// 如果组件内list滚动的时候，是未吸顶的状态，则通知页面滚动到吸顶状态并且禁止页面列表滚动
				if(!this.stickyed){
					this.$emit('setStickyed', false);
				}
			},
			// 监听列表触摸方向(只有当当前组件的列表滚动到顶部并且吸顶才需要判断)
			touchDirectionChange(direction){
				if(!(this.scrollTop===0&&this.stickyed))return;
				// 当列表滚动到顶部时
				if(direction === 'top'){
					// 用户将列表向上移动(scrollTop不断减小)，这时候要禁止当前组件的列表滚动，允许页面z-paging滚动
					this.$emit('setScrollable', true);
					this.scrollable = false;
				}else if (direction === 'bottom'){
					// 用户将列表向下移动(scrollTop不断增大)，这时候要允许当前组件的列表滚动，禁止页面z-paging滚动
					this.$emit('setScrollable', false);
					this.scrollable = true;
				}
			}
		}
	}
</script>

<style>
	/* 注意，1、父节点需要固定高度，z-paging的height:100%才会生效 */
	/* 注意，2、请确保z-paging与同级的其他view的总高度不得超过屏幕宽度，以避免超出屏幕高度时页面的滚动与z-paging内部的滚动冲突 */
	.content {
		height: 100%;
	}

	.item {
		position: relative;
		height: 150rpx;
		display: flex;
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
		bottom: 0rpx;
		left: 0rpx;
		height: 1px;
		width: 100%;
		background-color: #eeeeee;
	}
</style>
