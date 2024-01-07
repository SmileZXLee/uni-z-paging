// [z-paging]滚动到底部加载更多模块
import u from '.././z-paging-utils'
import Enum from '.././z-paging-enum'

export default {
	props: {
		// 自定义底部加载更多样式
		loadingMoreCustomStyle: {
			type: Object,
			default: u.gc('loadingMoreCustomStyle', {})
		},
		// 自定义底部加载更多文字样式
		loadingMoreTitleCustomStyle: {
			type: Object,
			default: u.gc('loadingMoreTitleCustomStyle', {})
		},
		// 自定义底部加载更多加载中动画样式
		loadingMoreLoadingIconCustomStyle: {
			type: Object,
			default: u.gc('loadingMoreLoadingIconCustomStyle', {})
		},
		// 自定义底部加载更多加载中动画图标类型，可选flower或circle，默认为flower
		loadingMoreLoadingIconType: {
			type: String,
			default: u.gc('loadingMoreLoadingIconType', 'flower')
		},
		// 自定义底部加载更多加载中动画图标图片
		loadingMoreLoadingIconCustomImage: {
			type: String,
			default: u.gc('loadingMoreLoadingIconCustomImage', '')
		},
		// 底部加载更多加载中view是否展示旋转动画，默认为是
		loadingMoreLoadingAnimated: {
			type: Boolean,
			default: u.gc('loadingMoreLoadingAnimated', true)
		},
		// 是否启用加载更多数据(含滑动到底部加载更多数据和点击加载更多数据)，默认为是
		loadingMoreEnabled: {
			type: Boolean,
			default: u.gc('loadingMoreEnabled', true)
		},
		// 是否启用滑动到底部加载更多数据，默认为是
		toBottomLoadingMoreEnabled: {
			type: Boolean,
			default: u.gc('toBottomLoadingMoreEnabled', true)
		},
		// 滑动到底部状态为默认状态时，以加载中的状态展示，默认为否。若设置为是，可避免滚动到底部看到默认状态然后立刻变为加载中状态的问题，但分页数量未超过一屏时，不会显示【点击加载更多】
		loadingMoreDefaultAsLoading: {
			type: [Boolean],
			default: u.gc('loadingMoreDefaultAsLoading', false)
		},
		// 滑动到底部"默认"文字，默认为【点击加载更多】
		loadingMoreDefaultText: {
			type: [String, Object],
			default: u.gc('loadingMoreDefaultText', null)
		},
		// 滑动到底部"加载中"文字，默认为【正在加载...】
		loadingMoreLoadingText: {
			type: [String, Object],
			default: u.gc('loadingMoreLoadingText', null)
		},
		// 滑动到底部"没有更多"文字，默认为【没有更多了】
		loadingMoreNoMoreText: {
			type: [String, Object],
			default: u.gc('loadingMoreNoMoreText', null)
		},
		// 滑动到底部"加载失败"文字，默认为【加载失败，点击重新加载】
		loadingMoreFailText: {
			type: [String, Object],
			default: u.gc('loadingMoreFailText', null)
		},
		// 当没有更多数据且分页内容未超出z-paging时是否隐藏没有更多数据的view，默认为否
		hideNoMoreInside: {
			type: Boolean,
			default: u.gc('hideNoMoreInside', false)
		},
		// 当没有更多数据且分页数组长度少于这个值时，隐藏没有更多数据的view，默认为0，代表不限制。
		hideNoMoreByLimit: {
			type: Number,
			default: u.gc('hideNoMoreByLimit', 0)
		},
		// 是否显示默认的加载更多text，默认为是
		showDefaultLoadingMoreText: {
			type: Boolean,
			default: u.gc('showDefaultLoadingMoreText', true)
		},
		// 是否显示没有更多数据的view
		showLoadingMoreNoMoreView: {
			type: Boolean,
			default: u.gc('showLoadingMoreNoMoreView', true)
		},
		// 是否显示没有更多数据的分割线，默认为是
		showLoadingMoreNoMoreLine: {
			type: Boolean,
			default: u.gc('showLoadingMoreNoMoreLine', true)
		},
		// 自定义底部没有更多数据的分割线样式
		loadingMoreNoMoreLineCustomStyle: {
			type: Object,
			default: u.gc('loadingMoreNoMoreLineCustomStyle', {})
		},
		// 当分页未满一屏时，是否自动加载更多，默认为否(nvue无效)
		insideMore: {
			type: Boolean,
			default: u.gc('insideMore', false)
		},
		// 距底部/右边多远时（单位px），触发 scrolltolower 事件，默认为100rpx
		lowerThreshold: {
			type: [Number, String],
			default: u.gc('lowerThreshold', '100rpx')
		},
	},
	data() {
		return {
			M: Enum.More,
			// 底部加载更多状态
			loadingStatus: Enum.More.Default,
			// 在渲染之后的底部加载更多状态
			loadingStatusAfterRender: Enum.More.Default,
			// 底部加载更多时间戳
			loadingMoreTimeStamp: 0,
			// 底部加载更多slot
			loadingMoreDefaultSlot: null,
			// 是否展示底部加载更多
			showLoadingMore: false,
			// 是否是开发者自定义的加载更多，-1代表交由z-paging自行判断；1代表没有更多了；0代表还有更多数据
			customNoMore: -1,
		}
	},
	computed: {
		// 底部加载更多配置
		zLoadMoreConfig() {
			return {
				status: this.loadingStatusAfterRender,
				defaultAsLoading: this.loadingMoreDefaultAsLoading,
				defaultThemeStyle: this.finalLoadingMoreThemeStyle,
				customStyle: this.loadingMoreCustomStyle,
				titleCustomStyle: this.loadingMoreTitleCustomStyle,
				iconCustomStyle: this.loadingMoreLoadingIconCustomStyle,
				loadingIconType: this.loadingMoreLoadingIconType,
				loadingIconCustomImage: this.loadingMoreLoadingIconCustomImage,
				loadingAnimated: this.loadingMoreLoadingAnimated,
				showNoMoreLine: this.showLoadingMoreNoMoreLine,
				noMoreLineCustomStyle: this.loadingMoreNoMoreLineCustomStyle,
				defaultText: this.finalLoadingMoreDefaultText,
				loadingText: this.finalLoadingMoreLoadingText,
				noMoreText: this.finalLoadingMoreNoMoreText,
				failText: this.finalLoadingMoreFailText,
				hideContent: !this.loadingMoreDefaultAsLoading && this.listRendering,
				unit: this.unit
			};
		},
		// 最终的底部加载更多主题
		finalLoadingMoreThemeStyle() {
			return this.loadingMoreThemeStyle.length ? this.loadingMoreThemeStyle : this.defaultThemeStyle;
		},
		// 最终的底部加载更多触发阈值
		finalLowerThreshold() {
			return u.convertToPx(this.lowerThreshold);
		},
		// 是否显示默认状态下的底部加载更多
		showLoadingMoreDefault() {
			return this._showLoadingMore('Default');
		},
		// 是否显示加载中状态下的底部加载更多
		showLoadingMoreLoading() {
			return this._showLoadingMore('Loading');
		},
		// 是否显示没有更多了状态下的底部加载更多
		showLoadingMoreNoMore() {
			return this._showLoadingMore('NoMore');
		},
		// 是否显示加载失败状态下的底部加载更多
		showLoadingMoreFail() {
			return this._showLoadingMore('Fail');
		},
		// 是否显示自定义状态下的底部加载更多
		showLoadingMoreCustom() {
			return this._showLoadingMore('Custom');
		}
	},
	methods: {
		// 页面滚动到底部时通知z-paging进行进一步处理
		pageReachBottom() {
			!this.useChatRecordMode && this._onLoadingMore('toBottom');
		},
		// 手动触发上拉加载更多(非必须，可依据具体需求使用)
		doLoadMore(type) {
			this._onLoadingMore(type);
		},
		// 通过@scroll事件检测是否滚动到了底部
		_checkScrolledToBottom(scrollDiff, checked = false) {
			// 如果当前scroll-view高度未获取，则获取其高度
			if (this.cacheScrollNodeHeight === -1) {
				// 获取当前scroll-view高度
				this._getNodeClientRect('.zp-scroll-view').then((res) => {
					if (res) {
						const scrollNodeHeight = res[0].height;
						// 缓存当前scroll-view高度，如果获取过了不再获取
						this.cacheScrollNodeHeight = scrollNodeHeight;
						// // scrollDiff - this.cacheScrollNodeHeight = 当前滚动区域的顶部与内容底部的距离 - scroll-view高度 = 当前滚动区域的底部与内容底部的距离(也就是最终的与底部的距离)
						if (scrollDiff - scrollNodeHeight <= this.finalLowerThreshold) {
							// 如果与底部的距离小于阈值，则判断为滚动到了底部，触发滚动到底部事件
							this._onLoadingMore('toBottom');
						}
					}
				});
			} else {
				// scrollDiff - this.cacheScrollNodeHeight = 当前滚动区域的顶部与内容底部的距离 - scroll-view高度 = 当前滚动区域的底部与内容底部的距离(也就是最终的与底部的距离)
				if (scrollDiff - this.cacheScrollNodeHeight <= this.finalLowerThreshold) {
					// 如果与底部的距离小于阈值，则判断为滚动到了底部，触发滚动到底部事件
					this._onLoadingMore('toBottom');
				} else if (scrollDiff - this.cacheScrollNodeHeight <= 500 && !checked) {
					// 如果与底部的距离小于500px，则获取当前滚动的位置，重复上述步骤再次检测。防止因为部分性能较差安卓设备@scroll采样率过低导致的滚动到底部但是依然没有触发的问题
					u.delay(() => {
						this._getNodeClientRect('.zp-scroll-view', true, true).then((res) => {
							this.oldScrollTop = res[0].scrollTop;
							const newScrollDiff = res[0].scrollHeight - this.oldScrollTop;
							this._checkScrolledToBottom(newScrollDiff, true);
						})
					}, 150, 'checkScrolledToBottomDelay')
				}
			}
		},
		// 触发加载更多时调用,from:toBottom-滑动到底部触发；1、click-点击加载更多触发
		_onLoadingMore(from = 'click') {
			// 如果是ios并且是滚动到底部的，则在滚动到底部时候尝试将列表设置为禁止滚动然后设置为允许滚动，以禁止底部bounce的效果
			if (this.isIos && from === 'toBottom' && !this.scrollToBottomBounceEnabled && this.scrollEnable) {
				this.scrollEnable = false;
				this.$nextTick(() => {
					this.scrollEnable = true;
				})
			}
			// emit scrolltolower
			this.$emit('scrolltolower', from);
			// 如果是只使用下拉刷新 或者 禁用底部加载更多 或者 底部加载更多不是默认状态或加载失败状态 或者 是加载中状态 或者 空数据图已经展示了，则return，不触发内部加载更多逻辑
			if (this.refresherOnly || !this.loadingMoreEnabled || !(this.loadingStatus === Enum.More.Default || this.loadingStatus === Enum.More.Fail) || this.loading || this.showEmpty) return;
			// #ifdef MP-WEIXIN
			if (!this.isIos && !this.refresherOnly && !this.usePageScroll) {
				const currentTimestamp = u.getTime();
				// 在非ios平台+scroll-view中节流处理
				if (this.loadingMoreTimeStamp > 0 && currentTimestamp - this.loadingMoreTimeStamp < 100) {
					this.loadingMoreTimeStamp = 0;
					return;
				}
			}
			// #endif
			// 处理加载更多数据
			this._doLoadingMore();
		},
		// 处理开始加载更多
		_doLoadingMore() {
			if (this.pageNo >= this.defaultPageNo && this.loadingStatus !== Enum.More.NoMore) {
				this.pageNo ++;
				this._startLoading(false);
				// 如果是本地分页，则在组件内部对数据进行分页处理，不触发@query事件
				if (this.isLocalPaging) {
					this._localPagingQueryList(this.pageNo, this.defaultPageSize, this.localPagingLoadingTime, res => {
						this.completeByTotal(res, this.totalLocalPagingList.length);
					})
				} else {
					this._emitQuery(this.pageNo, this.defaultPageSize, Enum.QueryFrom.LoadingMore);
					this._callMyParentQuery();
				}
				// 设置当前加载状态为底部加载更多状态
				this.loadingType = Enum.LoadingType.LoadingMore;
			}
		},
		// (预处理)判断当没有更多数据且分页内容未超出z-paging时是否显示没有更多数据的view
		_preCheckShowNoMoreInside(newVal, scrollViewNode, pagingContainerNode) {
			if (this.loadingStatus === Enum.More.NoMore && this.hideNoMoreByLimit > 0 && newVal.length) {
				this.showLoadingMore = newVal.length > this.hideNoMoreByLimit;
			} else if ((this.loadingStatus === Enum.More.NoMore && this.hideNoMoreInside && newVal.length) || (this.insideMore && this.insideOfPaging !== false && newVal.length)) {
				this.$nextTick(() => {
					this._checkShowNoMoreInside(newVal, scrollViewNode, pagingContainerNode);
				})
				if (this.insideMore && this.insideOfPaging !== false && newVal.length) {
					this.showLoadingMore = newVal.length;
				}
			} else {
				this.showLoadingMore = newVal.length;
			}
		},
		// 判断当没有更多数据且分页内容未超出z-paging时是否显示没有更多数据的view
		async _checkShowNoMoreInside(totalData, oldScrollViewNode, oldPagingContainerNode) {
			try {
				const scrollViewNode = oldScrollViewNode || await this._getNodeClientRect('.zp-scroll-view');
				// 在页面滚动模式下
				if (this.usePageScroll) {
					if (scrollViewNode) {
						// 获取滚动内容总高度
						const scrollViewTotalH = scrollViewNode[0].top + scrollViewNode[0].height;
						// 如果滚动内容总高度小于窗口高度，则认为内容未超出z-paging
						this.insideOfPaging = scrollViewTotalH < this.windowHeight;
						// 如果需要没有更多数据时，隐藏底部加载更多view，并且内容未超过z-paging，则隐藏底部加载更多
						if (this.hideNoMoreInside) {
							this.showLoadingMore = !this.insideOfPaging;
						}
						// 如果需要内容未超过z-paging时自动加载更多，则触发加载更多
						this._updateInsideOfPaging();
					}
				} else {
					// 在scroll-view滚动模式下
					const pagingContainerNode = oldPagingContainerNode || await this._getNodeClientRect('.zp-paging-container-content');
					// 获取滚动内容总高度
					const pagingContainerH = pagingContainerNode ? pagingContainerNode[0].height : 0;
					// 获取z-paging内置scroll-view高度
					const scrollViewH = scrollViewNode ? scrollViewNode[0].height : 0;
					// 如果滚动内容总高度小于z-paging内置scroll-view高度，则认为内容未超出z-paging
					this.insideOfPaging = pagingContainerH < scrollViewH;
					if (this.hideNoMoreInside) {
						this.showLoadingMore = !this.insideOfPaging;
					}
					// 如果需要内容未超过z-paging时自动加载更多，则触发加载更多
					this._updateInsideOfPaging();
				}
			} catch (e) {
				// 如果发生了异常，判断totalData数组长度为0，则认为内容未超出z-paging
				this.insideOfPaging = !totalData.length;
				if (this.hideNoMoreInside) {
					this.showLoadingMore = !this.insideOfPaging;
				}
				// 如果需要内容未超过z-paging时自动加载更多，则触发加载更多
				this._updateInsideOfPaging();
			}
		},
		// 是否要展示上拉加载更多view
		_showLoadingMore(type) {
			if (!this.showLoadingMoreWhenReload && (!(this.loadingStatus === Enum.More.Default ? this.nShowBottom : true) || !this.realTotalData.length)) return false;
			if (((!this.showLoadingMoreWhenReload || this.isUserPullDown || this.loadingStatus !== Enum.More.Loading) && !this.showLoadingMore) || 
			(!this.loadingMoreEnabled && (!this.showLoadingMoreWhenReload || this.isUserPullDown || this.loadingStatus !== Enum.More.Loading)) || this.refresherOnly) {
				return false;
			}
			if (this.useChatRecordMode && type !== 'Loading') return false;
			if (!this.zSlots) return false;
			if (type === 'Custom') {
				return this.showDefaultLoadingMoreText && !(this.loadingStatus === Enum.More.NoMore && !this.showLoadingMoreNoMoreView);
			}
			const res = this.loadingStatus === Enum.More[type] && this.zSlots[`loadingMore${type}`] && (type === 'NoMore' ? this.showLoadingMoreNoMoreView : true);
			if (res) {
				// #ifdef APP-NVUE
				if (!this.isIos) {
					this.nLoadingMoreFixedHeight = false;
				}
				//  #endif
			}
			return res;
		},
	}
}
