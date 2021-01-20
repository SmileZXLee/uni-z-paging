<template>
	<view class="content">
		<z-paging ref="paging" @query="queryList" :list.sync="dataList">
			<!-- 设置自定义emptyView组件，非必须。空数据时会自动展示空数据组件，不需要自己处理 -->
			<empty-view slot="empty"></empty-view>
			<!-- list数据，建议像下方这样在item外层套一个view，而非直接for循环item，因为slot插入有数量限制 -->
			<view>
				<view class="item" v-for="(item,index) in dataList" @click="itemClick(item)">
					<view class="item-title">{{item.title}}</view>
					<view class="item-detail">{{item.detail}}</view>
					<view class="item-line"></view>
				</view>
			</view>
		</z-paging>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				dataList: []
			}
		},
		onLoad() {
			setTimeout(()=>{
				this.$refs.paging.reload();
			},100)
			
		},
		methods: {
			queryList(pageNo, pageSize) {
				//这里的pageNo和pageSize会自动计算好，直接传给服务器即可
				this.$request.queryList(pageNo, pageSize, (data) => {
					this.$refs.paging.addData(data);
				})
			},
			itemClick(item) {
				console.log('点击了', item.title);
			}
		}
	}
</script>

<style>
	/* 注意，父节点需要固定高度，z-paging的height:100%才会生效 */
	page {
		height: 100%;
	}

	.content {
		height: 100%;
	}

	.item {
		position: relative;
		height: 100rpx;
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
