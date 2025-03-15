// [z-paging]通用布局相关模块
import u from '.././z-paging-utils'

// #ifdef APP-NVUE
const weexDom = weex.requireModule('dom');
// #endif

export default {
	data() {
		return {
			systemInfo: null,
			cssSafeAreaInsetBottom: -1,
			isReadyDestroy: false,
		}
	},
	computed: {
		// 顶部可用距离
		windowTop() {
			if (!this.systemInfo) return 0;
			// 暂时修复vue3中隐藏系统导航栏后windowTop获取不正确的问题，具体bug详见https://ask.dcloud.net.cn/question/141634
			// 感谢litangyu！！https://github.com/SmileZXLee/uni-z-paging/issues/25
			// #ifdef VUE3 && H5
			const pageHeadNode = document.getElementsByTagName("uni-page-head");
			if (!pageHeadNode.length) return 0;
			// #endif
			return this.systemInfo.windowTop || 0;
		},
		// 底部安全区域高度
		safeAreaBottom() {
			if (!this.systemInfo) return 0;
			let safeAreaBottom = 0;
			// #ifdef APP-PLUS
			safeAreaBottom = this.systemInfo.safeAreaInsets.bottom || 0 ;
			// #endif
			// #ifndef APP-PLUS
			safeAreaBottom = Math.max(this.cssSafeAreaInsetBottom, 0);
			// #endif
			return safeAreaBottom;
		},
		// 是否是比较老的webview，在一些老的webview中，需要进行一些特殊处理
		isOldWebView() {
			// #ifndef APP-NVUE || MP-KUAISHOU
			try {
				const systemInfos = u.getSystemInfoSync(true).system.split(' ');
				const deviceType = systemInfos[0];
				const version = parseInt(systemInfos[1]);
				if ((deviceType === 'iOS' && version <= 10) || (deviceType === 'Android' && version <= 6)) {
					return true;
				}
			} catch(e) {
				return false;
			}
			// #endif
			return false;
		},
		// 当前组件的$slots，兼容不同平台
		zSlots() {
			// #ifdef VUE2
			
			// #ifdef MP-ALIPAY
			return this.$slots;
			// #endif
			
			return this.$scopedSlots || this.$slots;
			// #endif
			
			return this.$slots;
		},
	},
	beforeDestroy() {
		this.isReadyDestroy = true;
	},
	// #ifdef VUE3
	unmounted() {
		this.isReadyDestroy = true;
	},
	// #endif
	methods: {
		// 更新fixed模式下z-paging的布局
		updateFixedLayout() {
			this.fixed && this.$nextTick(() => {
				this.systemInfo = u.getSystemInfoSync();
			})
		},
		// 获取节点尺寸
		_getNodeClientRect(select, inDom = true, scrollOffset = false) {
			if (this.isReadyDestroy) {
				return Promise.resolve(false);
			};
			// nvue中获取节点信息
			// #ifdef APP-NVUE
			select = select.replace(/[.|#]/g, '');
			const ref = this.$refs[select];
			return new Promise((resolve, reject) => {
				if (ref) {
					weexDom.getComponentRect(ref, option => {
						resolve(option && option.result ? [option.size] : false);
					})
				} else {
					resolve(false);
				}
			});
			return;
			// #endif
			
			// vue中获取节点信息
			//#ifdef MP-ALIPAY
			inDom = false;
			//#endif
			
			/*
			inDom可能是true、false，也可能是具体的dom节点
			如果inDom不为false，则使用uni.createSelectorQuery().in()进行查询，如果inDom为true，则in中的是this，否则in中的为具体的dom
			如果inDom为false，则使用uni.createSelectorQuery()进行查询
			*/
			let res = !!inDom ? uni.createSelectorQuery().in(inDom === true ? this : inDom) : uni.createSelectorQuery();
			scrollOffset ? res.select(select).scrollOffset() : res.select(select).boundingClientRect();
			return new Promise((resolve, reject) => {
				res.exec(data => {
					resolve((data && data != '' && data != undefined && data.length) ? data : false);
				});
			});
		},
		// 获取slot="left"和slot="right"宽度并且更新布局
		_updateLeftAndRightWidth(targetStyle, parentNodePrefix) {
			this.$nextTick(() => {
				let delayTime = 0;
				// #ifdef MP-BAIDU
				delayTime = 10;
				// #endif
				setTimeout(() => {
					['left','right'].map(position => {
						this._getNodeClientRect(`.${parentNodePrefix}-${position}`).then(res => {
							this.$set(targetStyle, position, res ? res[0].width + 'px' : '0px');
						});
					})
				}, delayTime)
			})
		},
		// 通过获取css设置的底部安全区域占位view高度设置bottom距离（直接通过systemInfo在部分平台上无法获取到底部安全区域）
		_getCssSafeAreaInsetBottom(success) {
			this._getNodeClientRect('.zp-safe-area-inset-bottom').then(res => {
				this.cssSafeAreaInsetBottom = res ? res[0].height : -1;
				res && success && success();
			});
		},
		// 同步获取系统信息，兼容不同平台（供z-paging-swiper使用）
		_getSystemInfoSync(useCache = false) {
			return u.getSystemInfoSync(useCache);
		}
	}
}
