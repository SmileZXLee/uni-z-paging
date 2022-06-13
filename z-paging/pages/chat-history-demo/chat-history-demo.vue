<!-- 聊天记录模式演示(vue)，vue中目前无法解决分页闪动问题，使用nvue可实现聊天记录无闪动分页 -->
<template>
	<view class="content">
		<z-paging ref="paging" v-model="dataList" use-page-scroll use-chat-record-mode @query="queryList">
			<!-- :id="`z-paging-${index}`必须加！！！！ -->
			<view class="item" :id="`z-paging-${index}`" v-for="(item,index) in dataList" :key="index">
				<view class="item-title" v-if="item.title.length<3">第{{item.title}}条聊天记录</view>
				<view class="item-title" v-else>{{item.title}}</view>
				<view class="item-detail">{{item.detail}}</view>
				<view class="item-line"></view>
			</view>
		</z-paging>
		<view class="add-chat-record" @click="addChatRecordClick">
			新增
		</view>
	</view>
</template>

<script>
	import ZPMixin from '@/uni_modules/z-paging/components/z-paging/js/z-paging-mixin'
	export default {
		//注意这一步不要漏掉，必须注册mixins(如果全局引入了，就不要这一步，全局引入示例见main.js)
		mixins: [ZPMixin],
		data() {
			return {
				//v-model绑定的这个变量不要在分页请求结束中自己赋值！！！
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
			queryList(pageNo, pageSize) {
				//组件加载时会自动触发此方法，因此默认页面加载时会自动触发，无需手动调用
				//这里的pageNo和pageSize会自动计算好，直接传给服务器即可
				//模拟请求服务器获取分页数据，请替换成自己的网络请求
				const params = {
					pageNo: pageNo,
					pageSize: pageSize,
					type: this.tabIndex + 1
				}
				this.$request.queryList(params).then(res => {
					//将请求的结果数组传递给z-paging
					this.$refs.paging.complete(res.data.list);
				}).catch(res => {
					//如果请求失败写this.$refs.paging.complete(false);
					//注意，每次都需要在catch中写这句话很麻烦，z-paging提供了方案可以全局统一处理
					//在底层的网络请求抛出异常时，写uni.$emit('z-paging-error-emit');即可
					this.$refs.paging.complete(false);
				})
			},
			addChatRecordClick() {
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
		z-index: 100;
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
