// [z-paging]scroll相关模块
import u from '.././z-paging-utils'
import Enum from '.././z-paging-enum'

// #ifdef APP-NVUE
const weexDom = weex.requireModule('dom');
// #endif

export default {
	props: {
		// 使用页面滚动，默认为否，当设置为是时则使用页面的滚动而非此组件内部的scroll-view的滚动，使用页面滚动时z-paging无需设置确定的高度且对于长列表展示性能更高，但配置会略微繁琐
		usePageScroll: {
			type: Boolean,
			default: u.gc('usePageScroll', false)
		},
		// 是否可以滚动，使用内置scroll-view和nvue时有效，默认为是
		scrollable: {
			type: Boolean,
			default: u.gc('scrollable', true)
		},
		// 控制是否出现滚动条，默认为是
		showScrollbar: {
			type: Boolean,
			default: u.gc('showScrollbar', true)
		},
		// 是否允许横向滚动，默认为否
		scrollX: {
			type: Boolean,
			default: u.gc('scrollX', false)
		},
		// iOS设备上滚动到顶部时是否允许回弹效果，默认为否。关闭回弹效果后可使滚动到顶部与下拉刷新更连贯，但是有吸顶view时滚动到顶部时可能出现抖动。
		scrollToTopBounceEnabled: {
			type: Boolean,
			default: u.gc('scrollToTopBounceEnabled', false)
		},
		// iOS设备上滚动到底部时是否允许回弹效果，默认为是。
		scrollToBottomBounceEnabled: {
			type: Boolean,
			default: u.gc('scrollToBottomBounceEnabled', true)
		},
		// 在设置滚动条位置时使用动画过渡，默认为否
		scrollWithAnimation: {
			type: Boolean,
			default: u.gc('scrollWithAnimation', false)
		},
		// 值应为某子元素id（id不能以数字开头）。设置哪个方向可滚动，则在哪个方向滚动到该元素
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
			scrollViewContainerStyle: {},
			scrollViewInStyle: {},
			pageScrollTop: -1,
			scrollEnable: true,
			privateScrollWithAnimation: -1,
			cacheScrollNodeHeight: -1
		}
	},
	watch: {
		oldScrollTop(newVal) {
			!this.usePageScroll && this._scrollTopChange(newVal,false);
		},
		pageScrollTop(newVal) {
			this.usePageScroll && this._scrollTopChange(newVal,true);
		},
		usePageScroll: {
			handler(newVal) {
				this.loaded && this.autoHeight && this._setAutoHeight(!newVal);
				// #ifdef H5
				if (newVal) {
					this.$nextTick(() => {
						const mainScrollRef = this.$refs['zp-scroll-view'].$refs.main;
						if (mainScrollRef) {
							mainScrollRef.style = {};
						}
					})
				}
				// #endif
			},
			immediate: true
		},
		finalScrollTop(newVal) {
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
		finalIsOldWebView() {
			return this.isOldWebView && !this.usePageScroll;
		}
	},
	methods: {
		// 滚动到顶部，animate为是否展示滚动动画，默认为是
		scrollToTop(animate, checkReverse = true) {
			// 如果是聊天记录模式并且列表倒置了，则滚动到顶部实际上是滚动到底部
			if (this.useChatRecordMode && checkReverse && !this.isChatRecordModeAndNotInversion) {
				this.scrollToBottom(animate, false);
				return;
			}
			this.$nextTick(() => {
				this._scrollToTop(animate, false);
				// #ifdef APP-NVUE
				if (this.nvueFastScroll && animate) {
					u.delay(() => {
						this._scrollToTop(false, false);
					});
				}
				// #endif
			})
		},
		// 滚动到底部，animate为是否展示滚动动画，默认为是
		scrollToBottom(animate, checkReverse = true) {
			// 如果是聊天记录模式并且列表倒置了，则滚动到底部实际上是滚动到顶部
			if (this.useChatRecordMode && checkReverse && !this.isChatRecordModeAndNotInversion) {
				this.scrollToTop(animate, false);
				return;
			}
			this.$nextTick(() => {
				this._scrollToBottom(animate);
				// #ifdef APP-NVUE
				if (this.nvueFastScroll && animate) {
					u.delay(() => {
						this._scrollToBottom(false);
					});
				}
				// #endif
			})
		},
		// 滚动到指定view(vue中有效)。sel为需要滚动的view的id值，不包含"#"；offset为偏移量，单位为px；animate为是否展示滚动动画，默认为否
		scrollIntoViewById(sel, offset, animate) {
			this._scrollIntoView(sel, offset, animate);
		},
		// 滚动到指定view(vue中有效)。nodeTop为需要滚动的view的top值(通过uni.createSelectorQuery()获取)；offset为偏移量，单位为px；animate为是否展示滚动动画，默认为否
		scrollIntoViewByNodeTop(nodeTop, offset, animate) {
			this.scrollTop = this.oldScrollTop;
			this.$nextTick(() => {
				this._scrollIntoViewByNodeTop(nodeTop, offset, animate);
			})
		},
		// 滚动到指定位置(vue中有效)。y为与顶部的距离，单位为px；offset为偏移量，单位为px；animate为是否展示滚动动画，默认为否
		scrollToY(y, offset, animate) {
			this.scrollTop = this.oldScrollTop;
			this.$nextTick(() => {
				this._scrollToY(y, offset, animate);
			})
		},
		// 滚动到指定view(nvue中有效)。index为需要滚动的view的index(第几个)；offset为偏移量，单位为px；animate为是否展示滚动动画，默认为否
		scrollIntoViewByIndex(index, offset, animate) {
			this._scrollIntoView(index, offset, animate);
		},
		// 滚动到指定view(nvue中有效)。view为需要滚动的view(通过`this.$refs.xxx`获取)，不包含"#"；offset为偏移量，单位为px；animate为是否展示滚动动画，默认为否
		scrollIntoViewByView(view, offset, animate) {
			this._scrollIntoView(view, offset, animate);
		},
		// 当使用页面滚动并且自定义下拉刷新时，请在页面的onPageScroll中调用此方法，告知z-paging当前的pageScrollTop，否则会导致在任意位置都可以下拉刷新
		updatePageScrollTop(value) {
			this.pageScrollTop = value;
		},
		// 当使用页面滚动并且设置了slot="top"时，默认初次加载会自动获取其高度，并使内部容器下移，当slot="top"的view高度动态改变时，在其高度需要更新时调用此方法
		updatePageScrollTopHeight() {
			this._updatePageScrollTopOrBottomHeight('top');
		},
		// 当使用页面滚动并且设置了slot="bottom"时，默认初次加载会自动获取其高度，并使内部容器下移，当slot="bottom"的view高度动态改变时，在其高度需要更新时调用此方法
		updatePageScrollBottomHeight() {
			this._updatePageScrollTopOrBottomHeight('bottom');
		},
		// 更新slot="left"和slot="right"宽度，当slot="left"或slot="right"宽度动态改变时调用
		updateLeftAndRightWidth() {
			if (!this.finalIsOldWebView) return;
			this.$nextTick(() => this._updateLeftAndRightWidth(this.scrollViewContainerStyle, 'zp-page'));
		},
		// 更新z-paging内置scroll-view的scrollTop
		updateScrollViewScrollTop(scrollTop, animate = true) {
			this.privateScrollWithAnimation = animate ? 1 : 0;
			this.scrollTop = this.oldScrollTop;
			this.$nextTick(() => {
				this.scrollTop = scrollTop;
				this.oldScrollTop = this.scrollTop;
			});
		},
		
		// 当滚动到顶部时
		_onScrollToUpper() {
			this.$emit('scrolltoupper');
			this.$emit('scrollTopChange', 0);
			this.$nextTick(() => {
				this.oldScrollTop = 0;
			})
		},
		// 当滚动到底部时
		_onScrollToLower(e) {
			(!e.detail || !e.detail.direction || e.detail.direction === 'bottom') && this._onLoadingMore(this.useChatRecordMode ? 'click' : 'toBottom')
		},
		// 滚动到顶部
		_scrollToTop(animate = true, isPrivate = true) {
			// #ifdef APP-NVUE
			// 在nvue中需要通过weex.scrollToElement滚动到顶部，此时在顶部插入了一个view，使得滚动到这个view位置
			const el = this.$refs['zp-n-list-top-tag'];
			if (this.usePageScroll) {
				this._getNodeClientRect('zp-page-scroll-top', false).then(node => {
					const nodeHeight = node ? node[0].height : 0;
					weexDom.scrollToElement(el, {
						offset: -nodeHeight,
						animated: animate
					});
				});
			} else {
				if (!this.isIos && this.nvueListIs === 'scroller') {
					this._getNodeClientRect('zp-n-refresh-container', false).then(node => {
						const nodeHeight = node ? node[0].height : 0;
						weexDom.scrollToElement(el, {
							offset: -nodeHeight,
							animated: animate
						});
					});
				} else {
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
		// 滚动到底部
		async _scrollToBottom(animate = true) {
			// #ifdef APP-NVUE
			// 在nvue中需要通过weex.scrollToElement滚动到顶部，此时在底部插入了一个view，使得滚动到这个view位置
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
				const pagingContainerNode = await this._getNodeClientRect('.zp-paging-container');
				const scrollViewNode = await this._getNodeClientRect('.zp-scroll-view');
				const pagingContainerH = pagingContainerNode ? pagingContainerNode[0].height : 0;
				const scrollViewH = scrollViewNode ? scrollViewNode[0].height : 0;
				if (pagingContainerH > scrollViewH) {
					this.scrollTop = this.oldScrollTop;
					this.$nextTick(() => {
						this.scrollTop = pagingContainerH - scrollViewH + this.virtualPlaceholderTopHeight;
						this.oldScrollTop = this.scrollTop;
					});
				}
			} catch (e) {}
		},
		// 滚动到指定view
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
					this._getNodeClientRect('#' + sel.replace('#', ''), this.$parent).then((node) => {
						if (node) {
							let nodeTop = node[0].top;
							this._scrollIntoViewByNodeTop(nodeTop, offset, animate);
							finishCallback && finishCallback();
						}
					});
				});
			} catch (e) {}
		},
		// 通过nodeTop滚动到指定view
		_scrollIntoViewByNodeTop(nodeTop, offset = 0, animate = false) {
			// 如果是聊天记录模式并且列表倒置了，此时nodeTop需要等于scroll-view高度 - nodeTop
			if (this.isChatRecordModeAndInversion) {
				this._getNodeClientRect('.zp-scroll-view').then(sNode => {
					if (sNode) {
						this._scrollToY(sNode[0].height - nodeTop, offset, animate, true);
					}
				})
			} else {
				this._scrollToY(nodeTop, offset, animate, true);
			}
		},
		// 滚动到指定位置
		_scrollToY(y, offset = 0, animate = false, addScrollTop = false) {
			this.privateScrollWithAnimation = animate ? 1 : 0;
			u.delay(() => {
				if (this.usePageScroll) {
					if (addScrollTop && this.pageScrollTop !== -1) {
					   y += this.pageScrollTop; 
					}
					const scrollTop = y - offset;
					uni.pageScrollTo({
						scrollTop,
						duration: animate ? 100 : 0
					});
				} else {
					if (addScrollTop) {
					   y += this.oldScrollTop; 
					}
					this.scrollTop = y - offset;
				}
			}, 10)
		},
		// scroll-view滚动中
		_scroll(e) {
			this.$emit('scroll', e);
			const scrollTop = e.detail.scrollTop;
			// #ifndef APP-NVUE
			this.finalUseVirtualList && this._updateVirtualScroll(scrollTop, this.oldScrollTop - scrollTop);
			// #endif
			this.oldScrollTop = scrollTop;
			// 滚动区域内容的总高度 - 当前滚动的scrollTop = 当前滚动区域的顶部与内容底部的距离
			const scrollDiff = e.detail.scrollHeight - this.oldScrollTop;
			// 在非ios平台滚动中，再次验证一下是否滚动到了底部。因为在一些安卓设备中，有概率滚动到底部不触发@scrolltolower事件，因此添加双重检测逻辑
			!this.isIos && this._checkScrolledToBottom(scrollDiff);
		},
		// 检测scrollView是否要铺满屏幕
		_doCheckScrollViewShouldFullHeight(totalData) {
			if (this.autoFullHeight && this.usePageScroll && this.isTotalChangeFromAddData) {
				// #ifndef APP-NVUE
				this.$nextTick(() => {
					this._checkScrollViewShouldFullHeight((scrollViewNode, pagingContainerNode) => {
						this._preCheckShowNoMoreInside(totalData, scrollViewNode, pagingContainerNode)
					});
				})
				// #endif
				// #ifdef APP-NVUE
				this._preCheckShowNoMoreInside(totalData)
				// #endif
			} else {
				this._preCheckShowNoMoreInside(totalData)
			} 
		},
		// 检测z-paging是否要全屏覆盖(当使用页面滚动并且不满全屏时，默认z-paging需要铺满全屏，避免数据过少时内部的empty-view无法正确展示)
		async _checkScrollViewShouldFullHeight(callback) {
			try {
				const scrollViewNode = await this._getNodeClientRect('.zp-scroll-view');
				const pagingContainerNode = await this._getNodeClientRect('.zp-paging-container-content');
				if (!scrollViewNode || !pagingContainerNode) return;
				const scrollViewHeight = pagingContainerNode[0].height;
				const scrollViewTop = scrollViewNode[0].top;
				if (this.isAddedData && scrollViewHeight + scrollViewTop <= this.windowHeight) {
					this._setAutoHeight(true, scrollViewNode);
					callback(scrollViewNode, pagingContainerNode);
				} else {
					this._setAutoHeight(false);
					callback(null, null);
				}
			} catch (e) {
				callback(null, null);
			}
		},
		// scrollTop改变时触发
		_scrollTopChange(newVal, isPageScrollTop){
			this.$emit('scrollTopChange', newVal);
			this.$emit('update:scrollTop', newVal);
			this._checkShouldShowBackToTop(newVal);
			// 之前在安卓中scroll-view有概率滚动到顶部时scrollTop不为0导致下拉刷新判断异常，经过测试在HX3.98+已修复，因此暂时关闭此容错判断
			// const scrollTop = this.isIos ? (newVal > 5 ? 6 : 0) : (newVal > 105 ? 106 : (newVal > 5 ? 6 : 0));
			const scrollTop = newVal > 5 ? 6 : 0;
			if (isPageScrollTop && this.wxsPageScrollTop !== scrollTop) {
				this.wxsPageScrollTop = scrollTop;
			} else if (!isPageScrollTop && this.wxsScrollTop !== scrollTop) {
				this.wxsScrollTop = scrollTop;
				if (scrollTop > 6) {
					this.scrollEnable = true;
				}
			}
		},
		// 更新使用页面滚动时slot="top"或"bottom"插入view的高度
		_updatePageScrollTopOrBottomHeight(type) {
			// #ifndef APP-NVUE
			if (!this.usePageScroll) return;
			// #endif
			this._doCheckScrollViewShouldFullHeight(this.realTotalData);
			const node = `.zp-page-${type}`;
			const marginText = `margin${type.slice(0,1).toUpperCase() + type.slice(1)}`;
			let safeAreaInsetBottomAdd = this.safeAreaInsetBottom;
			this.$nextTick(() => {
				let delayTime = 0;
				// #ifdef MP-BAIDU || APP-NVUE
				delayTime = 50;
				// #endif
				u.delay(() => {
					this._getNodeClientRect(node).then((res) => {
						if (res) {
							let pageScrollNodeHeight = res[0].height;
							if (type === 'bottom') {
								if (safeAreaInsetBottomAdd) {
									pageScrollNodeHeight += this.safeAreaBottom;
								}
							} else {
								this.cacheTopHeight = pageScrollNodeHeight;
							}
							this.$set(this.scrollViewStyle, marginText, `${pageScrollNodeHeight}px`);
						} else if (safeAreaInsetBottomAdd) {
							this.$set(this.scrollViewStyle, marginText, `${this.safeAreaBottom}px`);
						}
					});
				}, delayTime)
			})
		},
	}
}
