<!-- i18n国际化演示(vue) -->
<template>
	<view class="content">
		<z-paging ref="paging" v-model="dataList" @query="queryList">
			<!-- 需要固定在顶部不滚动的view放在slot="top"的view中，如果需要跟着滚动，则不要设置slot="top" -->
			<template #top>
				<view class="language-view" @click="languageSwitch">当前语言：[{{applicationLocale}}] 点击切换</view>
				<!-- 注意！此处的z-tabs为独立的组件，可替换为第三方的tabs，若需要使用z-tabs，请在插件市场搜索z-tabs并引入，否则会报插件找不到的错误 -->
				<z-tabs :list="tabList" @change="tabsChange" />
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
	export default {
		data() {
			return {
				locales: [{
					text: '跟随系统',
					code: 'auto'
				}, {
					text: '英文',
					code: 'en'
				},
				{
					text: '简体中文',
					code: 'zh-Hans'
				},
				{
					text: '繁体中文',
					code: 'zh-Hant',	
				}],
				applicationLocale: '',
				
				// ------------------------ z-paging分页相关 -----------------------
				// v-model绑定的这个变量不要在分页请求结束中自己赋值！！！
				dataList: [],
				tabList: ['测试1', '测试2', '测试3', '测试4'],
				tabIndex: 0,
			}
		},
		onLoad() {
			//获取当前设置的语言
			this.applicationLocale = uni.getLocale();
			
			//监听应用语言切换
			uni.onLocaleChange((e) => {
				this.applicationLocale = e.locale;
			})
		},
		methods: {
			// 点击了切换语言
			languageSwitch() {
				uni.showActionSheet({
					itemList: this.locales.map(item => item.text),
					success: res => {
						const local = this.locales[res.tapIndex];
						//设置当前语言
						uni.setLocale(local.code);
					}
				});
			},
			
			// ------------------------ z-paging分页相关 -----------------------
			tabsChange(index) {
				this.tabIndex = index;
				// 当切换tab或搜索时请调用组件的reload方法，请勿直接调用：queryList方法！！
				this.$refs.paging.reload();
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
				this.$request.queryList(params).then(res => {
					// 将请求的结果数组传递给z-paging
					this.$refs.paging.complete(res.data.list);
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

<style>
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

	.language-view {
		background-color: #007AFF;
		text-align: center;
		padding: 20rpx 0rpx;
		font-size: 24rpx;
		color: white;
	}
</style>
