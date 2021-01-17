<template>
	<view class="content">
		<z-paging ref="paging" @query="queryList" :list.sync="dataList" style="height: 100%;">
			<!-- 设置自己的emptyView组件，非必须。空数据时会自动展示空数据组件，不需要自己处理 -->
			<empty-view slot="empty"></empty-view>
			
			<!-- list数据，建议像下方这样在item外层套一个view，而非直接for循环item，因为solt插入有数量限制 -->
			<view>
				<view class="item" v-for="(item,index) in dataList" @click="itemClick(item)">
					<view class="item-title">{{item.title}}</view>
					<view class="item-detail" style="background-color: #007AFF;">{{item.detail}}</view>
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
			},1)
		},
		methods: {
			queryList(pageNo,pageSize){
				this.$request.queryList(pageNo,pageSize,(data)=>{
					this.$refs.paging.addData(data);
				})
			},
			itemClick(item){
				console.log('点击了',item.title);
			}
		}
	}
</script>

<style scoped>
	/* 注意，父元素需要固定高度，z-paging的height:100%才会生效 */
	page{
		height: 100%;
	}
	.content {
		height: 100%;
	}
	
	.item{
		position: relative;
		height: 100rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0rpx 30rpx;
	}
	.item-detail{
		padding: 5rpx 15rpx;
		border-radius: 10rpx;
		font-size: 28rpx;
		color: white;
	}
	.item-line{
		position: absolute;
		bottom: 0rpx;
		left: 0rpx;
		height: 1px;
		width: 100%;
		background-color: #eeeeee;
	}
</style>
