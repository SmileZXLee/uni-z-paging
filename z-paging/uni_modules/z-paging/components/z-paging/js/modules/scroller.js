// [z-paging]scroll相关模块
import u from '.././z-paging-utils'
import Enum from '.././z-paging-enum'

// #ifdef APP-NVUE
const weexDom = weex.requireModule('dom');
// #endif
const ZPScroller = {
	props: {
		//使用页面滚动，默认为否，当设置为是时则使用页面的滚动而非此组件内部的scroll-view的滚动，使用页面滚动时z-paging无需设置确定的高度且对于长列表展示性能更高，但配置会略微繁琐
		usePageScroll: {
			type: Boolean,
			default: u.gc('usePageScroll', false)
		},
		//是否可以滚动，使用内置scroll-view和nvue时有效，默认为是
		scrollable: {
			type: Boolean,
			default: u.gc('scrollable', true)
		},
		//控制是否出现滚动条，默认为是
		showScrollbar: {
			type: Boolean,
			default: u.gc('showScrollbar', true)
		},
		//是否允许横向滚动，默认为否
		scrollX: {
			type: Boolean,
			default: u.gc('scrollX', false)
		},
		//iOS设备上滚动到顶部时是否允许回弹效果，默认为否。关闭回弹效果后可使滚动到顶部与下拉刷新更连贯，但是有吸顶view时滚动到顶部时可能出现抖动。
		scrollToTopBounceEnabled: {
			type: Boolean,
			default: u.gc('scrollToTopBounceEnabled', false)
		},
		//iOS设备上滚动到底部时是否允许回弹效果，默认为是。
		scrollToBottomBounceEnabled: {
			type: Boolean,
			default: u.gc('scrollToBottomBounceEnabled', true)
		},
		//在设置滚动条位置时使用动画过渡，默认为否
		scrollWithAnimation: {
			type: Boolean,
			default: u.gc('scrollWithAnimation', false)
		},
		//值应为某子元素id（id不能以数字开头）。设置哪个方向可滚动，则在哪个方向滚动到该元素
		scrollIntoView: {
			type: String,
			default: u.gc('scrollIntoView', '')
		},
	},
	data() {
		return {
			scrollTop: 0,
			oldScrollTop: 0,
			scrollViewStyle: {},
			scrollViewInStyle: {},
			pageScrollTop: -1,
			scrollEnable: true,
			privateScrollWithAnimation: -1,
			cacheScrollNodeHeight: -1,
		}
	},
	watch: {
		oldScrollTop(newVal, oldVal) {
			!this.usePageScroll && this._scrollTopChange(newVal,oldVal,false);
		},
		pageScrollTop(newVal, oldVal) {
			this.usePageScroll && this._scrollTopChange(newVal,oldVal,true);
		},
		usePageScroll: {
			handler(newVal) {
				this.$nextTick(() => {
					this.renderPropUsePageScroll = newVal;
				})
				if (this.loaded && this.autoHeight) {
					this._setAutoHeight(!newVal);
				}
				// #ifdef H5
				if (newVal) {
					try {
						this.$nextTick(()=>{
							this.$refs['zp-scroll-view'].$refs.main.style = {};
						})
					} catch (e) {}
				}
				// #endif
			},
			immediate: true
		},
		finalScrollTop(newVal, oldVal) {
			if (!this.useChatRecordMode) {
				this.renderPropScrollTop = newVal < 6 ? 0 : 10;
			}
		},
	},
	computed: {
		finalScrollWithAnimation() {
			if (this.privateScrollWithAnimation !== -1) {
				const scrollWithAnimation = this.privateScrollWithAnimation === 1;
				this.privateScrollWithAnimation = -1;
				return scrollWithAnimation;
			}
			return this.scrollWithAnimation;
		},
		finalScrollViewStyle() {
			if (this.superContentZIndex != 1) {
				this.scrollViewStyle['z-index'] = this.superContentZIndex;
				this.scrollViewStyle['position'] = 'relative';
			}
			return this.scrollViewStyle;
		},
		finalScrollTop() {
			return this.usePageScroll ? this.pageScrollTop : this.oldScrollTop;
		},
	},
	methods: {
		//滚动到顶部，animate为是否展示滚动动画，默认为是
		scrollToTop(animate,checkReverse = true) {
			// #ifdef APP-NVUE
			if (checkReverse && this.useChatRecordMode) {
				if(!this.nIsFirstPageAndNoMore){
					this.scrollToBottom(animate, false);
					return;
				}
			}
			// #endif
			this.$nextTick(() => {
				this._scrollToTop(animate, false);
				// #ifdef APP-NVUE
				if (this.nvueFastScroll && animate) {
					setTimeout(() => {
						this._scrollToTop(false, false);
					}, 150);
				}
				// #endif
			})
		},
		//滚动到底部，animate为是否展示滚动动画，默认为是
		scrollToBottom(animate,checkReverse = true) {
			// #ifdef APP-NVUE
			if (checkReverse && this.useChatRecordMode) {
				if(!this.nIsFirstPageAndNoMore){
					this.scrollToTop(animate, false);
					return;
				}
			}
			// #endif
			this.$nextTick(() => {
				this._scrollToBottom(animate);
				// #ifdef APP-NVUE
				if (this.nvueFastScroll && animate) {
					setTimeout(() => {
						this._scrollToBottom(false);
					}, 150);
				}
				// #endif
			})
		},
		//滚动到指定view(vue中有效)。sel为需要滚动的view的id值，不包含"#"；offset为偏移量，单位为px；animate为是否展示滚动动画，默认为否
		scrollIntoViewById(sel, offset, animate) {
			this._scrollIntoView(sel, offset, animate);
		},
		//滚动到指定view(vue中有效)。nodeTop为需要滚动的view的top值(通过uni.createSelectorQuery()获取)；offset为偏移量，单位为px；animate为是否展示滚动动画，默认为否
		scrollIntoViewByNodeTop(nodeTop, offset, animate) {
			this.scrollTop = this.oldScrollTop;
			this.$nextTick(() => {
				this._scrollIntoViewByNodeTop(nodeTop, offset, animate);
			})
		},
		//滚动到指定位置(vue中有效)。y为与顶部的距离，单位为px；offset为偏移量，单位为px；animate为是否展示滚动动画，默认为否
		scrollToY(y, offset, animate) {
			this.scrollTop = this.oldScrollTop;
			this.$nextTick(() => {
				this._scrollToY(y, offset, animate);
			})
		},
		//滚动到指定view(nvue中有效)。index为需要滚动的view的index(第几个)；offset为偏移量，单位为px；animate为是否展示滚动动画，默认为否
		scrollIntoViewByIndex(index, offset, animate) {
			this._scrollIntoView(index, offset, animate);
		},
		//滚动到指定view(nvue中有效)。view为需要滚动的view(通过`this.$refs.xxx`获取)，不包含"#"；offset为偏移量，单位为px；animate为是否展示滚动动画，默认为否
		scrollIntoViewByView(view, offset, animate) {
			this._scrollIntoView(view, offset, animate);
		},
		//当使用页面滚动并且自定义下拉刷新时，请在页面的onPageScroll中调用此方法，告知z-paging当前的pageScrollTop，否则会导致在任意位置都可以下拉刷新
		updatePageScrollTop(value) {
			if (value == undefined) {
				u.consoleErr('updatePageScrollTop方法缺少参数，请将页面onPageScroll事件中的scrollTop传递给此方法');
				return;
			}
			this.pageScrollTop = value;
		},
		//当使用页面滚动并且设置了slot="top"时，默认初次加载会自动获取其高度，并使内部容器下移，当slot="top"的view高度动态改变时，在其高度需要更新时调用此方法
		updatePageScrollTopHeight() {
			this._updatePageScrollTopOrBottomHeight('top');
		},
		//当使用页面滚动并且设置了slot="bottom"时，默认初次加载会自动获取其高度，并使内部容器下移，当slot="bottom"的view高度动态改变时，在其高度需要更新时调用此方法
		updatePageScrollBottomHeight() {
			this._updatePageScrollTopOrBottomHeight('bottom');
		},
		//更新z-paging内置scroll-view的scrollTop
		updateScrollViewScrollTop(scrollTop, animate = true) {
			this.privateScrollWithAnimation = animate ? 1 : 0;
			this.scrollTop = this.oldScrollTop;
			this.$nextTick(() => {
				this.scrollTop = scrollTop;
				this.oldScrollTop = this.scrollTop;
			});
		},
		
		//当滚动到顶部时
		_scrollToUpper() {
			this.$emit('scrolltoupper');
			this.$emit('scrollTopChange', 0);
			this.$nextTick(() => {
				this.oldScrollTop = 0;
			})
			if (!this.useChatRecordMode) return;
			if (this.loadingStatus === Enum.More.NoMore) return;
			this._onLoadingMore('click');
		},
		//滚动到顶部
		_scrollToTop(animate, isPrivate = true) {
			// #ifdef APP-NVUE
			const el = this.$refs['zp-n-list-top-tag'];
			if (this.usePageScroll) {
				this._getNodeClientRect('zp-page-scroll-top', false).then((node) => {
					let nodeHeight = 0;
					if (node) {
						nodeHeight = node[0].height;
					}
					weexDom.scrollToElement(el, {
						offset: -nodeHeight,
						animated: animate
					});
				});
			} else {
				if(!this.isIos && this.nvueListIs === 'scroller'){
					this._getNodeClientRect('zp-n-refresh-container', false).then((node) => {
						let nodeHeight = 0;
						if (node) {
							nodeHeight = node[0].height;
						}
						weexDom.scrollToElement(el, {
							offset: -nodeHeight,
							animated: animate
						});
					});
				}else{
					weexDom.scrollToElement(el, {
						offset: 0,
						animated: animate
					});
				}
			}
			return;
			// #endif
			if (this.usePageScroll) {
				this.$nextTick(() => {
					uni.pageScrollTo({
						scrollTop: 0,
						duration: animate ? 100 : 0,
					});
				});
				return;
			}
			this.privateScrollWithAnimation = animate ? 1 : 0;
			this.scrollTop = this.oldScrollTop;
			this.$nextTick(() => {
				this.scrollTop = 0;
				this.oldScrollTop = this.scrollTop;
			});
		},
		//滚动到底部
		async _scrollToBottom(animate = true) {
			// #ifdef APP-NVUE
			const el = this.$refs['zp-n-list-bottom-tag'];
			if (el) {
				weexDom.scrollToElement(el, {
					offset: 0,
					animated: animate
				});
			} else {
				u.consoleErr('滚动到底部失败，因为您设置了hideNvueBottomTag为true');
			}
			return;
			// #endif
			if (this.usePageScroll) {
				this.$nextTick(() => {
					uni.pageScrollTo({
						scrollTop: Number.MAX_VALUE,
						duration: animate ? 100 : 0,
					});
				});
				return;
			}
			try {
				this.privateScrollWithAnimation = animate ? 1 : 0;
				let pagingContainerH = 0;
				let scrollViewH = 0;
				const pagingContainerNode = await this._getNodeClientRect('.zp-paging-container');
				const scrollViewNode = await this._getNodeClientRect('.zp-scroll-view');
				if (pagingContainerNode) {
					pagingContainerH = pagingContainerNode[0].height;
				}
				if (scrollViewNode) {
					scrollViewH = scrollViewNode[0].height;
				}
				if (pagingContainerH > scrollViewH) {
					this.scrollTop = this.oldScrollTop;
					this.$nextTick(() => {
						this.scrollTop = pagingContainerH - scrollViewH;
						this.oldScrollTop = this.scrollTop;
					});
				}
			} catch (e) {}
		},
		//滚动到指定view
		_scrollIntoView(sel, offset = 0, animate = false, finishCallback) {
			try {
				this.scrollTop = this.oldScrollTop;
				this.$nextTick(() => {
					// #ifdef APP-NVUE
					const refs = this.$parent.$refs;
					if (!refs) return;
					const dataType = Object.prototype.toString.call(sel);
					let el = null;
					if (dataType === '[object Number]') {
						const els = refs[`z-paging-${sel}`];
						el = els ? els[0] : null;
					} else if (dataType === '[object Array]') {
						el = sel[0];
					} else {
						el = sel;
					}
					if (el) {
						weexDom.scrollToElement(el, {
							offset: -offset,
							animated: animate
						});
					} else {
						u.consoleErr('在nvue中滚动到指定位置，cell必须设置 :ref="`z-paging-${index}`"');
					}
					return;
					// #endif
					if (sel.indexOf('#') != -1) {
						sel = sel.replace('#', '');
					}
					this._getNodeClientRect('#' + sel, false).then((node) => {
						if (node) {
							let nodeTop = node[0].top;
							this._scrollIntoViewByNodeTop(nodeTop, offset, animate);
							if (finishCallback) {
								finishCallback();
							}
						}
					});
				});
			} catch (e) {}
		},
		//通过nodeTop滚动到指定view
		_scrollIntoViewByNodeTop(nodeTop, offset = 0, animate = false) {
			this._scrollToY(nodeTop,offset,animate,true);
		},
		//滚动到指定位置
		_scrollToY(y, offset = 0, animate = false, addScrollTop = false) {
			this.privateScrollWithAnimation = animate ? 1 : 0;
			if (this.usePageScroll) {
				uni.pageScrollTo({
					scrollTop: y - offset,
					duration: animate ? 100 : 0
				});
			} else {
				if(addScrollTop){
				   y += this.oldScrollTop; 
				}
				this.scrollTop = y - offset;
				this.oldScrollTop = this.scrollTop;
			}
		},
		//scroll-view滚动中
		_scroll(e) {
			this.$emit('scroll', e);
			this.oldScrollTop = e.detail.scrollTop;
			const scrollDiff = e.detail.scrollHeight - this.oldScrollTop;
			!this.isIos && this._checkScrolledToBottom(scrollDiff);
		},
		//scrollTop改变时触发
		_scrollTopChange(newVal,oldVal,isPageScrollTop){
			this.$emit('scrollTopChange', newVal);
			this.$emit('update:scrollTop', newVal);
			this._checkShouldShowBackToTop(newVal, oldVal);
			const scrollTop = this.isIos ? (newVal > 5 ? 6 : 0) : newVal;
			if (isPageScrollTop) {
				this.wxsPageScrollTop = scrollTop;
			} else {
				this.wxsScrollTop = scrollTop;
			}
		},
	}
}

export default ZPScroller;
