// [z-paging]nvue独有部分模块
import u from '.././z-paging-utils'
import c from '.././z-paging-constant'
import Enum from '.././z-paging-enum'

// #ifdef APP-NVUE
const weexAnimation = weex.requireModule('animation');
// #endif
export default {
	props: {
		// #ifdef APP-NVUE
		// nvue中修改列表类型，可选值有list、waterfall和scroller，默认为list
		nvueListIs: {
			type: String,
			default: u.gc('nvueListIs', 'list')
		},
		// nvue waterfall配置，仅在nvue中且nvueListIs=waterfall时有效，配置参数详情参见：https://uniapp.dcloud.io/component/waterfall
		nvueWaterfallConfig: {
			type: Object,
			default: u.gc('nvueWaterfallConfig', {})
		},
		// nvue 控制是否回弹效果，iOS不支持动态修改
		nvueBounce: {
			type: Boolean,
			default: u.gc('nvueBounce', true)
		},
		// nvue中通过代码滚动到顶部/底部时，是否加快动画效果(无滚动动画时无效)，默认为否
		nvueFastScroll: {
			type: Boolean,
			default: u.gc('nvueFastScroll', false)
		},
		// nvue中list的id
		nvueListId: {
			type: String,
			default: u.gc('nvueListId', '')
		},
		// nvue中refresh组件的样式
		nvueRefresherStyle: {
			type: Object,
			default: u.gc('nvueRefresherStyle', {})
		},
		// nvue中是否按分页模式(类似竖向swiper)显示List，默认为false
		nvuePagingEnabled: {
			type: Boolean,
			default: u.gc('nvuePagingEnabled', false)
		},
		// 是否隐藏nvue列表底部的tagView，此view用于标识滚动到底部位置，若隐藏则滚动到底部功能将失效，在nvue中实现吸顶+swiper功能时需将最外层z-paging的此属性设置为true。默认为否
		hideNvueBottomTag: {
			type: Boolean,
			default: u.gc('hideNvueBottomTag', false)
		},
		// nvue中控制onscroll事件触发的频率：表示两次onscroll事件之间列表至少滚动了10px。注意，将该值设置为较小的数值会提高滚动事件采样的精度，但同时也会降低页面的性能
		offsetAccuracy: {
			type: Number,
			default: u.gc('offsetAccuracy', 10)
		},
		// #endif
	},
	data() {
		return {
			nRefresherLoading: false,
			nListIsDragging: false,
			nShowBottom: true,
			nFixFreezing: false,
			nShowRefresherReveal: false,
			nLoadingMoreFixedHeight: false,
			nShowRefresherRevealHeight: 0,
			nOldShowRefresherRevealHeight: -1,
			nRefresherWidth: uni.upx2px(750),
			nF2Opacity: 0
		}
	},
	computed: {
		// #ifdef APP-NVUE
		nScopedSlots() {
			// #ifdef VUE2
			return this.$scopedSlots;
			// #endif
			// #ifdef VUE3
			return null;
			// #endif
		},
		nWaterfallColumnCount() {
			if (this.finalNvueListIs !== 'waterfall') return 0;
			return this._nGetWaterfallConfig('column-count', 2);
		},
		nWaterfallColumnWidth() {
			return this._nGetWaterfallConfig('column-width', 'auto');
		},
		nWaterfallColumnGap() {
			return this._nGetWaterfallConfig('column-gap', 'normal');
		},
		nWaterfallLeftGap() {
			return this._nGetWaterfallConfig('left-gap', 0);
		},
		nWaterfallRightGap() {
			return this._nGetWaterfallConfig('right-gap', 0);
		},
		nViewIs() {
			const is = this.finalNvueListIs;
			return is === 'scroller' || is === 'view' ? 'view' : is === 'waterfall' ? 'header' : 'cell';
		},
		nSafeAreaBottomHeight() {
			return this.safeAreaInsetBottom ? this.safeAreaBottom : 0;
		},
		finalNvueListIs() {
			if (this.usePageScroll) return 'view';
			const nvueListIsLowerCase = this.nvueListIs.toLowerCase();
			if (['list','waterfall','scroller'].indexOf(nvueListIsLowerCase) !== -1) return nvueListIsLowerCase;
			return 'list';
		},
		finalNvueSuperListIs() {
			return this.usePageScroll ? 'view' : 'scroller';
		},
		finalNvueRefresherEnabled() {
			return this.finalNvueListIs !== 'view' && this.finalRefresherEnabled && !this.nShowRefresherReveal && !this.useChatRecordMode;
		},
		// #endif
	},
	mounted(){
		// #ifdef APP-NVUE
		//旋转屏幕时更新宽度
		uni.onWindowResize((res) => {
			// this._nUpdateRefresherWidth();
		})
		// #endif
	},
	methods: {
		// #ifdef APP-NVUE
		// 列表滚动时触发
		_nOnScroll(e) {
			this.$emit('scroll', e);
			const contentOffsetY = -e.contentOffset.y;
			this.oldScrollTop = contentOffsetY;
			this.nListIsDragging = e.isDragging;
			this._checkShouldShowBackToTop(contentOffsetY, contentOffsetY - 1);
		},
		// 列表滚动结束
		_nOnScrollend(e) {
			this.$emit('scrollend', e);
		},
		// 下拉刷新刷新中
		_nOnRrefresh() {
			if (this.nShowRefresherReveal) return;
			// 进入刷新状态
			this.nRefresherLoading = true;
			if (this.refresherStatus === Enum.Refresher.GoF2) {
				this._handleGoF2();
				this.$nextTick(() => {
					this._nRefresherEnd();
				})
			} else {
				this.refresherStatus = Enum.Refresher.Loading;
				this._doRefresherLoad();
			}
			
		},
		// 下拉刷新下拉中
		_nOnPullingdown(e) {
			if (this.refresherStatus === Enum.Refresher.Loading || (this.isIos && !this.nListIsDragging)) return;
			this._emitTouchmove(e);
			let { viewHeight, pullingDistance } = e;
			// 更新下拉刷新状态
			// 下拉刷新距离超过阈值
			if (pullingDistance >= viewHeight) {
				// 如果开启了下拉进入二楼并且下拉刷新距离超过进入二楼阈值，则当前下拉刷新状态为松手进入二楼，否则为松手立即刷新
				// (pullingDistance - viewHeight) + this.finalRefresherThreshold 不等同于pullingDistance，此处是为了兼容不同平台下拉相同距离pullingDistance不一致的问题，pullingDistance仅与viewHeight互相关联
				this.refresherStatus = this.refresherF2Enabled && (pullingDistance - viewHeight) + this.finalRefresherThreshold >= this.finalRefresherF2Threshold ? Enum.Refresher.GoF2 : Enum.Refresher.ReleaseToRefresh;
			} else {
				// 下拉刷新距离未超过阈值，显示默认状态
				this.refresherStatus = Enum.Refresher.Default;
			}
		},
		// 下拉刷新结束
		_nRefresherEnd(doEnd = true) {
			if (doEnd) {
			   this._nDoRefresherEndAnimation(0, -this.nShowRefresherRevealHeight); 
			   !this.usePageScroll && this.$refs['zp-n-list'].resetLoadmore();
			   this.nRefresherLoading = false;
			}
		},
		// 执行主动触发下拉刷新动画
		_nDoRefresherEndAnimation(height, translateY, animate = true, checkStack = true) {
			// 清除下拉刷新相关timeout
			this._cleanRefresherCompleteTimeout();
			this._cleanRefresherEndTimeout();
			
			if (!this.finalShowRefresherWhenReload) {
				// 如果reload不需要自动展示下拉刷新view，则在complete duration结束后再把下拉刷新状态设置回默认
				this.refresherEndTimeout = u.delay(() => {
					this.refresherStatus = Enum.Refresher.Default;
				}, this.refresherCompleteDuration);
				return;
			}
			// 用户处理用户在短时间内多次调用reload的情况，此时下拉刷新view不需要重复显示，只需要保证最后一次reload对应的请求结束后收回下拉刷新view即可
			const stackCount = this.refresherRevealStackCount;
			if (height === 0 && checkStack) {
				this.refresherRevealStackCount --;
				if (stackCount > 1) return;
				this.refresherEndTimeout = u.delay(() => {
					this.refresherStatus = Enum.Refresher.Default;
				}, this.refresherCompleteDuration);
			}
			if (stackCount > 1) {
				this.refresherStatus = Enum.Refresher.Loading;
			}
			
			const duration = animate ? 200 : 0;
			if (this.nOldShowRefresherRevealHeight !== height) {
				if (height > 0) {
					this.nShowRefresherReveal = true;
				}
				// 展示下拉刷新view
				weexAnimation.transition(this.$refs['zp-n-list-refresher-reveal'], {
					styles: {
						height: `${height}px`,
						transform: `translateY(${translateY}px)`,
					},
					duration,
					timingFunction: 'linear',
					needLayout: true,
					delay: 0
				})
			}
			u.delay(() => {
				if (animate) {
					this.nShowRefresherReveal = height > 0;
				}
			}, duration > 0 ? duration - 60 : 0);
			this.nOldShowRefresherRevealHeight = height;
		},
		// 滚动到底部加载更多
		_nOnLoadmore() {
			if (this.nShowRefresherReveal || !this.totalData.length) return;
			this.useChatRecordMode ? this.doChatRecordLoadMore() : this._onLoadingMore('toBottom');
		},
		// 获取nvue waterfall单项配置
		_nGetWaterfallConfig(key, defaultValue) {
			return this.nvueWaterfallConfig[key] || defaultValue;
		},
		// 更新nvue 下拉刷新view容器的宽度
		_nUpdateRefresherWidth() {
			u.delay(() => {
				this.$nextTick(()=>{
					this._getNodeClientRect('.zp-n-list').then(node => {
						if (node) {
							this.nRefresherWidth = node[0].width || this.nRefresherWidth;
						}
					})
				})
			})	
		}
		// #endif
	}
}
