<!-- i18n国际化演示(vue) -->
<template>
	<view class="content">
		<z-paging ref="paging" v-model="dataList" @query="queryList">
			<!-- 需要固定在顶部不滚动的view放在slot="top"的view中，如果需要跟着滚动，则不要设置slot="top" -->
			<view slot="top">
				<view class="language-view" @click="languageSwitch">当前语言：[{{language}}] 点击切换</view>
				<!-- 注意！此处的z-tabs为独立的组件，可替换为第三方的tabs，若需要使用z-tabs，请在插件市场搜索z-tabs并引入，否则会报插件找不到的错误 -->
				<z-tabs @change="tabChange" :list="tabList"></z-tabs>
			</view>
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
	//引入z-paging-i18n.js文件
	import zI18n from '@/uni_modules/z-paging/components/z-paging/js/z-paging-i18n'
	export default {
		data() {
			return {
				//v-model绑定的这个变量不要在分页请求结束中自己赋值！！！
				dataList: [],
				tabList: ['测试1','测试2','测试3','测试4'],
				tabIndex: 0,
				language: '',
				//以下两个变量只是为了demo切换语言演示所用，非必须
				languageIndex: 0,
				languageArr: ['zh-cn', 'zh-hant-cn', 'en'],
				languageNameArr: ['简体中文', '繁體中文', 'English']
			}
		},
		onLoad() {
			this.updateLanguage();

			//更新一下languageIndex，这个不是必须的，只是为了demo细节的体验
			//因为刚进来，默认选中的不一定是第一个
			for (let i = 0; i < this.languageNameArr.length; i++) {
				const item = this.languageNameArr[i];
				if (item === this.language) {
					this.languageIndex = i;
					break;
				}
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
			itemClick(item) {
				console.log('点击了', item.title);
			},
			languageSwitch() {
				//通知更新语言
				//只要写ZI18n.setLanguage('要更换的语言');就可以，
				//下面这些逻辑实际上是要演示顺序切换语言效果。具体根据业务进行调整。
				this.languageIndex++;
				this.languageIndex = this.languageIndex % 3;
				const language = this.languageArr[this.languageIndex];
				//全局设置当前语言
				zI18n.setLanguage(language);
				//当更新完毕语言之后，重新获取一下当前语言，以更新展示
				this.updateLanguage();
			},
			//获取当前语言，非必须
			updateLanguage() {
				//获取当前语言
				const language = zI18n.getLanguageName();
				this.language = language;
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
