<!-- 虚拟列表演示(vue) -->
<template>
	<view class="content">
		<z-paging ref="paging" use-virtual-list :default-page-size="500" @query="queryList">
			<!-- 需要固定在顶部不滚动的view放在slot="top"的view中，如果需要跟着滚动，则不要设置slot="top" -->
			<tabs-view slot="top" @change="tabChange" :items="['测试1','测试2','测试3','测试4']"></tabs-view>
			<!-- 如果希望其他view跟着页面滚动，可以放在z-paging标签内 -->
			<template v-slot:cell="{item,index}">
				<view class="item" @click="itemClick(item,index)">
					<view class="item-image-container">
						<image class="item-image" mode="aspectFit" src="@/static/refresher_loading.gif"></image>
					</view>
					<view class="item-content">
						<text class="item-title">第{{item.title}}行</text>
						<text style="color: red;">虚拟列表展示</text>
						<view class="item-components">
							<view class="item-switch-container">
								<switch></switch>
							</view>
							<view class="item-group-container">
								<checkbox-group>
									<label>
										<checkbox checked="true" />选中
									</label>
									<label>
										<checkbox/>未选中
									</label>
								</checkbox-group>
							</view>
						</view>
						<view class="item-detail">{{item.detail+'dskahdjksahdjksahjkdfhafhdsgfhdsgfdhgshjgfdshjgfdshjfgsdfhjsd'}}</view>
					</view>
					<view class="item-line"></view>
				</view>
			</template>
		</z-paging>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				//v-model绑定的这个变量不要在分页请求结束中自己赋值！！！
				dataList: [],
				tabIndex: 0
			}
		},
		methods: {
			tabChange(index) {
				this.tabIndex = index;
				//当切换tab或搜索时请调用组件的reload方法，请勿直接调用：queryList方法！！
				this.$refs.paging.reload();
			},
			queryList(pageNo, pageSize) {
				//组件加载时会自动触发此方法，因此默认页面加载时会自动触发，无需手动调用
				//这里的pageNo和pageSize会自动计算好，直接传给服务器即可
				//模拟请求服务器获取分页数据，请替换成自己的网络请求
				const params = {
					pageNo: pageNo,
					pageSize: pageSize,
					type: this.tabIndex + 1
				}
				this.$request.queryListLong(params).then(res => {
					//将请求的结果数组传递给z-paging
					this.$refs.paging.complete(res.data.list);
				}).catch(res => {
					//如果请求失败写this.$refs.paging.complete(false);
					//注意，每次都需要在catch中写这句话很麻烦，z-paging提供了方案可以全局统一处理
					//在底层的网络请求抛出异常时，写uni.$emit('z-paging-error-emit');即可
					this.$refs.paging.complete(false);
				})
			},
			itemClick(item, index) {
				console.log('点击了', item.title);
			}
		}
	}
</script>

<style>
	.item {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 20rpx 30rpx;
	}
	
	.item-content{
		flex: 1;
	}
	
	.item-components{
		display: flex;
		margin-top: 10rpx;
	}
	
	.item-image{
		height: 100rpx;
		width: 100rpx;
		background-color: #eeeeee;
		border-radius: 50%;
	}
	
	.item-title{
		background-color: red;
		color: white;
		font-size: 24rpx;
		border-radius: 5rpx;
		padding: 5rpx 10rpx;
	}
	.item-detail {
		padding: 5rpx 15rpx;
		border-radius: 10rpx;
		font-size: 28rpx;
		color: #aaaaaa;
		word-break: break-all;
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
