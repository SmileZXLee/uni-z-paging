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
		//nvue中修改列表类型，可选值有list、waterfall和scroller，默认为list
		nvueListIs: {
			type: String,
			default: u.gc('nvueListIs', 'list')
		},
		//nvue waterfall配置，仅在nvue中且nvueListIs=waterfall时有效，配置参数详情参见：https://uniapp.dcloud.io/component/waterfall
		nvueWaterfallConfig: {
			type: Object,
			default: function() {
				return u.gc('nvueWaterfallConfig', {});
			}
		},
		//nvue 控制是否回弹效果，iOS不支持动态修改
		nvueBounce: {
			type: Boolean,
			default: u.gc('nvueBounce', true)
		},
		//nvue中通过代码滚动到顶部/底部时，是否加快动画效果(无滚动动画时无效)，默认为否
		nvueFastScroll: {
			type: Boolean,
			default: u.gc('nvueFastScroll', false)
		},
		//nvue中list的id
		nvueListId: {
			type: String,
			default: u.gc('nvueListId', '')
		},
		//nvue中refresh组件的样式
		nvueRefresherStyle: {
			type: Object,
			default: function() {
				return u.gc('nvueRefresherStyle', {});
			}
		},
		//nvue中是否按分页模式(类似竖向swiper)显示List，默认为false
		nvuePagingEnabled: {
			type: Boolean,
			default: u.gc('nvuePagingEnabled', false)
		},
		//是否隐藏nvue列表底部的tagView，此view用于标识滚动到底部位置，若隐藏则滚动到底部功能将失效，在nvue中实现吸顶+swiper功能时需将最外层z-paging的此属性设置为true。默认为否
		hideNvueBottomTag: {
			type: Boolean,
			default: u.gc('hideNvueBottomTag', false)
		},
		//nvue中控制onscroll事件触发的频率：表示两次onscroll事件之间列表至少滚动了10px。注意，将该值设置为较小的数值会提高滚动事件采样的精度，但同时也会降低页面的性能
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
			nIsFirstPageAndNoMore: false,
			nFirstPageAndNoMoreChecked: false,
			nLoadingMoreFixedHeight: false,
			nShowRefresherRevealHeight: 0,
			nOldShowRefresherRevealHeight: -1,
			nRefresherWidth: uni.upx2px(750),
		}
	},
	watch: {
		// #ifdef APP-NVUE
		nIsFirstPageAndNoMore: {
			handler(newVal) {
				const cellStyle = !this.useChatRecordMode || newVal ? {} : { transform: 'rotate(180deg)' };
				this.$emit('update:cellStyle', cellStyle);
				this.$emit('cellStyleChange', cellStyle);
			},
			immediate: true
		},
		// #endif
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
		nChatRecordRotateStyle() {
			return this.useChatRecordMode ? { transform: this.nIsFirstPageAndNoMore ? 'rotate(0deg)' : 'rotate(180deg)' } : {};
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
		//列表滚动时触发
		_nOnScroll(e) {
			this.$emit('scroll', e);
			const contentOffsetY = -e.contentOffset.y;
			this.oldScrollTop = contentOffsetY;
			this.nListIsDragging = e.isDragging;
			this._checkShouldShowBackToTop(contentOffsetY, contentOffsetY - 1);
		},
		//下拉刷新刷新中
		_nOnRrefresh() {
			if (this.nShowRefresherReveal) return;
			this.nRefresherLoading = true;
			this.refresherStatus = Enum.Refresher.Loading;
			this._doRefresherLoad();
		},
		//下拉刷新下拉中
		_nOnPullingdown(e) {
			if (this.refresherStatus === Enum.Refresher.Loading || (this.isIos && !this.nListIsDragging)) return;
			this._emitTouchmove(e);
			const { viewHeight, pullingDistance } = e;
			this.refresherStatus = pullingDistance >= viewHeight ? Enum.Refresher.ReleaseToRefresh : Enum.Refresher.Default;
		},
		//下拉刷新结束
		_nRefresherEnd(doEnd = true) {
			if (doEnd) {
			   this._nDoRefresherEndAnimation(0, -this.nShowRefresherRevealHeight); 
			   !this.usePageScroll && this.$refs['zp-n-list'].resetLoadmore();
			   this.nRefresherLoading = false;
			}
		},
		//执行主动触发下拉刷新动画
		_nDoRefresherEndAnimation(height, translateY, animate = true, checkStack = true) {
			this._cleanRefresherCompleteTimeout();
			this._cleanRefresherEndTimeout();
			
			if (!this.finalShowRefresherWhenReload) {
				this.refresherEndTimeout = u.delay(() => {
					this.refresherStatus = Enum.Refresher.Default;
				}, this.refresherCompleteDuration);
				return;
			}
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
		//滚动到底部加载更多
		_nOnLoadmore() {
			if (this.nShowRefresherReveal || !this.totalData.length) return;
			this.useChatRecordMode ? this.doChatRecordLoadMore() : this._onLoadingMore('toBottom');
		},
		//获取nvue waterfall单项配置
		_nGetWaterfallConfig(key, defaultValue) {
			return this.nvueWaterfallConfig[key] || defaultValue;
		},
		//更新nvue 下拉刷新view容器的宽度
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
