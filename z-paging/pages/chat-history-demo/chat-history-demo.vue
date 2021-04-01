<!-- 聊天记录模式演示 -->
<template>
	<view class="content">
		<z-paging ref="paging" @query="queryList" :use-chat-record-mode="true" :use-page-scroll="true"
			:list.sync="dataList" style="height: 100%">
			<!-- 如果希望其他view跟着页面滚动，可以放在z-paging标签内 -->
			<!-- list数据，建议像下方这样在item外层套一个view，而非直接for循环item，因为slot插入有数量限制 -->
			<view class="list">
				<!-- 注意！！！！这里id必须绑定index，且格式为z-paging-${index}，格式不能变，否则会导致滑动到顶部加载更多数据时滚动位置不正确！！！！！！ -->
				<view class="item" :id="`z-paging-${index}`" v-for="(item,index) in dataList" :key="index">
					<view class="item-title" v-if="item.title.length<3">第{{item.title}}条聊天记录</view>
					<view class="item-title" v-else>{{item.title}}</view>
					<view class="item-detail">{{item.detail}}</view>
					<view class="item-line"></view>
				</view>
			</view>
		</z-paging>
		<view class="add-chat-record" @click="addChatRecordClick">
			新增
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				dataList: [],
				tabIndex: 0,
				newIndex: 0
			}
		},
		onPageScroll(e) {
			if (e.scrollTop < 10) {
				this.$refs.paging.doChatRecordLoadMore();
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
				this.$request.queryList(pageNo, pageSize, this.tabIndex + 1, (data) => {
					//将请求的结果数组传递给z-paging
					this.$refs.paging.complete(data);
				})
			},
			addChatRecordClick(item) {
				this.newIndex++;
				this.$refs.paging.addChatRecordData({
					'title': '新增数据' + this.newIndex,
					'detail': '新增的聊天数据'
				});
			}
		}
	}
</script>

<style>
	.add-chat-record {
		position: fixed;
		width: 80rpx;
		height: 80rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		background-color: red;
		color: white;
		font-size: 28rpx;
		border-radius: 50%;
		right: 30rpx;
		bottom: 100rpx;
	}

	.item {
		position: relative;
		height: 200rpx;
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
