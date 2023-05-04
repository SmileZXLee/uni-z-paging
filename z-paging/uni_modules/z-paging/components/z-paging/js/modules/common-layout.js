// [z-paging]通用布局相关模块

// #ifdef APP-NVUE
const weexDom = weex.requireModule('dom');
// #endif

export default {
	data() {
		return {
			systemInfo: null,
			cssSafeAreaInsetBottom: -1,
		}
	},
	computed: {
		windowTop() {
			if (!this.systemInfo) return 0;
			//暂时修复vue3中隐藏系统导航栏后windowTop获取不正确的问题，具体bug详见https://ask.dcloud.net.cn/question/141634
			//感谢litangyu！！https://github.com/SmileZXLee/uni-z-paging/issues/25
			// #ifdef VUE3 && H5
			const pageHeadNode = document.getElementsByTagName("uni-page-head");
			if (!pageHeadNode.length) return 0;
			// #endif
			return this.systemInfo.windowTop || 0;
		},
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
		isOldWebView() {
			// #ifndef APP-NVUE || MP-KUAISHOU
			try {
				const systemInfos = systemInfo.system.split(' ');
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
		zSlots() {
			// #ifdef VUE2
			
			// #ifdef MP-ALIPAY
			return this.$slots;
			// #endif
			
			return this.$scopedSlots || this.$slots;
			// #endif
			
			return this.$slots;
		}
	},
	methods: {
		//获取节点尺寸
		_getNodeClientRect(select, inDom = true, scrollOffset = false) {
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
			//#ifdef MP-ALIPAY
			inDom = false;
			//#endif
			let res = !!inDom ? uni.createSelectorQuery().in(inDom === true ? this : inDom) : uni.createSelectorQuery();
			scrollOffset ? res.select(select).scrollOffset() : res.select(select).boundingClientRect();
			return new Promise((resolve, reject) => {
				res.exec(data => {
					resolve((data && data != '' && data != undefined && data.length) ? data : false);
				});
			});
		},
		//获取slot="left"和slot="right"宽度并且更新布局
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
		//通过获取css设置的底部安全区域占位view高度设置bottom距离
		_getCssSafeAreaInsetBottom(success) {
			this._getNodeClientRect('.zp-safe-area-inset-bottom').then(res => {
				this.cssSafeAreaInsetBottom = res ? res[0].height : -1;
				res && success && success();
			});
		}
	}
}
