<!-- 使用fetch的极简写法演示(vue) -->
<template>
	<view class="content">
		<!-- 通过:fetch直接传入列表请求函数即可，默认会调用对应请求参数并且给它传{pageNo, pageSize}两个参数 -->
		<!-- :fetch的请求函数附加参数可通过:fetch-params传入 -->
		<z-paging ref="paging" v-model="dataList" :fetch="queryList" :fetch-params="{ type: tabIndex + 1 }">
			<!-- 需要固定在顶部不滚动的view放在slot="top"的view中，如果需要跟着滚动，则不要设置slot="top" -->
			<template #top>
				<view class="notice">
					<view>使用fetch直接传入分页请求代替@query，具体写法和说明请查阅demo源码</view>
				</view>
				<!-- 注意！此处的z-tabs为独立的组件，可替换为第三方的tabs，若需要使用z-tabs，请在插件市场搜索z-tabs并引入，否则会报插件找不到的错误 -->
				<z-tabs :list="tabList" @change="tabChange" />
			</template>
			<!-- 如果希望其他view跟着页面滚动，可以放在z-paging标签内 -->
			<view class="item" v-for="(item,index) in dataList" :key="index" @click="itemClick(item)">
				<view class="item-title">{{item.title}}</view>
				<view class="item-detail">{{item.detail}}</view>
				<view class="item-line"></view>
			</view>
		</z-paging>
	</view>
</template>

<script>
	import { queryList } from '../../http/request.js'
	export default {
		data() {
			return {
				queryList,
				tabList: ['测试1','测试2','测试3','测试4'],
				tabIndex: 0,
				dataList: [],
				
			}
		},
		methods: {
			tabChange(index) {
				this.tabIndex = index;
				// 当切换tab或搜索时请调用组件的reload方法，请勿直接调用：queryList方法！！
				this.$refs.paging.reload();
			},
			itemClick(item) {
				console.log('点击了', item.title);
			},
			
			// 也支持自行实现fetch函数，例如在props中添加 :fetch="fetchFunc"，然后实现：
			/* 
			async fetchFunc(params) {
				const res = await this.$request.queryList({ pageNo: params.pageNo, pageSize: params.pageSize, type: this.tabIndex + 1 });
				return res.data.list;
			}
			*/
			
			// 在main.js中可以对全局:fetch的请求参数和响应进行拦截和统一处理，默认请求参数为{ pageNo, pageSize }，将响应结果直接当作分页数组。如非默认情况，请使用下方示例处理
			/*
			// 处理z-paging fetch写法拦截，handleFetchParams用于拦截请求入参，返回最终入参对象。handleFetchResult用于拦截请求结果，自行处理请求结束后操作，务必调用complete或complete相关方法
			// 支持链式调用
			ZPInterceptor.handleFetchParams((parmas, extraParams) => {
				return {pageNo: parmas.pageNo, pageSize: parmas.pageSize, ...extraParams};
			}).handleFetchResult((fetchResult, paging) => {
				fetchResult.then(res => {
					paging.complete(res.data.list);
				}).catch(err => {
					console.log(err)
					paging.complete(false);
				})
			})
			*/
		   
		}
	}
</script>

<style>
	.notice {
		background-color: red;
		color: white;
		display: flex;
		flex-direction: column;
		padding: 12rpx 20rpx;
		font-size: 24rpx;
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
