// [z-paging]滚动到底部加载更多模块
import u from '.././z-paging-utils'
import Enum from '.././z-paging-enum'

const ZPLoadMore = {
	props: {
		//自定义底部加载更多样式
		loadingMoreCustomStyle: {
			type: Object,
			default: function() {
				return u.gc('loadingMoreCustomStyle', {});
			}
		},
		//自定义底部加载更多文字样式
		loadingMoreTitleCustomStyle: {
			type: Object,
			default: function() {
				return u.gc('loadingMoreTitleCustomStyle', {});
			}
		},
		//自定义底部加载更多加载中动画样式
		loadingMoreLoadingIconCustomStyle: {
			type: Object,
			default: function() {
				return u.gc('loadingMoreLoadingIconCustomStyle', {});
			}
		},
		//自定义底部加载更多加载中动画图标类型，可选flower或circle，默认为flower
		loadingMoreLoadingIconType: {
			type: String,
			default: u.gc('loadingMoreLoadingIconType', 'flower')
		},
		//自定义底部加载更多加载中动画图标图片
		loadingMoreLoadingIconCustomImage: {
			type: String,
			default: u.gc('loadingMoreLoadingIconCustomImage', '')
		},
		//底部加载更多加载中view是否展示旋转动画，默认为是
		loadingMoreLoadingAnimated: {
			type: Boolean,
			default: u.gc('loadingMoreLoadingAnimated', true)
		},
		//是否启用加载更多数据(含滑动到底部加载更多数据和点击加载更多数据)，默认为是
		loadingMoreEnabled: {
			type: Boolean,
			default: u.gc('loadingMoreEnabled', true)
		},
		//是否启用滑动到底部加载更多数据，默认为是
		toBottomLoadingMoreEnabled: {
			type: Boolean,
			default: u.gc('toBottomLoadingMoreEnabled', true)
		},
		//滑动到底部状态为默认状态时，以加载中的状态展示，默认为否。若设置为是，可避免滚动到底部看到默认状态然后立刻变为加载中状态的问题，但分页数量未超过一屏时，不会显示【点击加载更多】
		loadingMoreDefaultAsLoading: {
			type: [Boolean],
			default: u.gc('loadingMoreDefaultAsLoading', false)
		},
		//滑动到底部"默认"文字，默认为【点击加载更多】
		loadingMoreDefaultText: {
			type: [String, Object],
			default: u.gc('loadingMoreDefaultText', null)
		},
		//滑动到底部"加载中"文字，默认为【正在加载...】
		loadingMoreLoadingText: {
			type: [String, Object],
			default: u.gc('loadingMoreLoadingText', null)
		},
		//滑动到底部"没有更多"文字，默认为【没有更多了】
		loadingMoreNoMoreText: {
			type: [String, Object],
			default: u.gc('loadingMoreNoMoreText', null)
		},
		//滑动到底部"加载失败"文字，默认为【加载失败，点击重新加载】
		loadingMoreFailText: {
			type: [String, Object],
			default: u.gc('loadingMoreFailText', null)
		},
		//当没有更多数据且分页内容未超出z-paging时是否隐藏没有更多数据的view，默认为否
		hideLoadingMoreWhenNoMoreAndInsideOfPaging: {
			type: Boolean,
			default: u.gc('hideLoadingMoreWhenNoMoreAndInsideOfPaging', false)
		},
		//当没有更多数据且分页数组长度少于这个值时，隐藏没有更多数据的view，默认为0，代表不限制。
		hideLoadingMoreWhenNoMoreByLimit: {
			type: Number,
			default: u.gc('hideLoadingMoreWhenNoMoreByLimit', 0)
		},
		//是否显示默认的加载更多text，默认为是
		showDefaultLoadingMoreText: {
			type: Boolean,
			default: u.gc('showDefaultLoadingMoreText', true)
		},
		//是否显示没有更多数据的view
		showLoadingMoreNoMoreView: {
			type: Boolean,
			default: u.gc('showLoadingMoreNoMoreView', true)
		},
		//是否显示没有更多数据的分割线，默认为是
		showLoadingMoreNoMoreLine: {
			type: Boolean,
			default: u.gc('showLoadingMoreNoMoreLine', true)
		},
		//自定义底部没有更多数据的分割线样式
		loadingMoreNoMoreLineCustomStyle: {
			type: Object,
			default: function() {
				return u.gc('loadingMoreNoMoreLineCustomStyle', {});
			},
		},
		//距底部/右边多远时（单位px），触发 scrolltolower 事件，默认为100rpx
		lowerThreshold: {
			type: [Number, String],
			default: u.gc('lowerThreshold', '100rpx')
		},
	},
	data() {
		return {
			//底部加载更多状态
			loadingStatus: Enum.More.Default,
			loadingStatusAfterRender: Enum.More.Default,
			loadingMoreTimeStamp: 0,
			loadingMoreDefaultSlot: null,
			showLoadingMore: false,
			customNoMore: -1,
		}
	},
	computed: {
		zPagingLoadMoreConfig() {
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
				failText: this.finalLoadingMoreFailText
			};
		},
		finalLoadingMoreThemeStyle() {
			return this.loadingMoreThemeStyle.length ? this.loadingMoreThemeStyle : this.defaultThemeStyle;
		},
	},
	methods: {
		//手动触发上拉加载更多(非必须，可依据具体需求使用)
		doLoadMore() {
			this._onLoadingMore('toBottom');
		},
		//通过@scroll事件检测是否滚动到了底部
		_checkScrolledToBottom(scrollDiff, checked = false) {
			if (this.checkScrolledToBottomTimeOut) {
				clearTimeout(this.checkScrolledToBottomTimeOut);
				this.checkScrolledToBottomTimeOut = null;
			}
			if (this.cacheScrollNodeHeight === -1) {
				this._getNodeClientRect('.zp-scroll-view').then((res) => {
					if (res) {
						let pageScrollNodeHeight = res[0].height;
						this.cacheScrollNodeHeight = pageScrollNodeHeight;
						if (scrollDiff - pageScrollNodeHeight <= this.finalLowerThreshold) {
							this._onLoadingMore('toBottom');
						}
					}
				});
			} else {
				if (scrollDiff - this.cacheScrollNodeHeight <= this.finalLowerThreshold) {
					this._onLoadingMore('toBottom');
				} else if (scrollDiff - this.cacheScrollNodeHeight <= 500 && !checked) {
					this.checkScrolledToBottomTimeOut = setTimeout(() => {
						this._getNodeClientRect('.zp-scroll-view', true, true).then((res) => {
							this.oldScrollTop = res[0].scrollTop;
							const newScrollDiff = res[0].scrollHeight - this.oldScrollTop;
							this._checkScrolledToBottom(newScrollDiff, true);
						})
					}, 150)
				}
			}
		},
		//触发加载更多时调用,from:0-滑动到底部触发；1-点击加载更多触发
		_onLoadingMore(from = 'click') {
			if (from === 'toBottom') {
				if (!this.scrollToBottomBounceEnabled) {
					if (this.scrollEnable) {
						this.scrollEnable = false;
						this.$nextTick(() => {
							this.scrollEnable = true;
						})
					}
				}
				//#ifdef APP-VUE || H5
				if (this.isIos) {
					this.renderPropUsePageScroll = -1;
					this.$nextTick(() => {
						this.renderPropUsePageScroll = this.usePageScroll;
					})
				}
				//#endif
			}
			this.$emit('scrolltolower', from);
			if (from === 'toBottom' && (!this.toBottomLoadingMoreEnabled || this.useChatRecordMode)) return;
			if (this.refresherOnly || !this.loadingMoreEnabled || !(this.loadingStatus === Enum.More.Default || this.loadingStatus === Enum.More.Fail) || this.loading) return;
			// #ifdef MP-WEIXIN
			if (!this.isIos && !this.refresherOnly && !this.usePageScroll) {
				const currentTimestamp = u.getTime();
				if(this.loadingMoreTimeStamp > 0 && currentTimestamp - this.loadingMoreTimeStamp < 100){
					this.loadingMoreTimeStamp = 0;
					return;
				}
			}
			// #endif
			this._doLoadingMore();
		},
		//处理开始加载更多
		_doLoadingMore() {
			if (this.pageNo >= this.defaultPageNo && this.loadingStatus !== Enum.More.NoMore) {
				this.pageNo++;
				this._startLoading(false);
				if (this.isLocalPaging) {
					this._localPagingQueryList(this.pageNo, this.defaultPageSize, this.localPagingLoadingTime, (res) => {
						this.addData(res);
					})
				} else {
					this._emitQuery(this.pageNo, this.defaultPageSize, Enum.QueryFrom.LoadingMore);
					this._callMyParentQuery();
				}
				this.loadingType = Enum.LoadingType.LoadingMore;
			}
		},
		//(预处理)判断当没有更多数据且分页内容未超出z-paging时是否显示没有更多数据的view
		_preCheckShowLoadingMoreWhenNoMoreAndInsideOfPaging(newVal, scrollViewNode, pagingContainerNode) {
			if (this.loadingStatus === Enum.More.NoMore && this.hideLoadingMoreWhenNoMoreByLimit > 0 && newVal.length) {
				this.showLoadingMore = newVal.length > this.hideLoadingMoreWhenNoMoreByLimit;
			} else if ((this.loadingStatus === Enum.More.NoMore && this.hideLoadingMoreWhenNoMoreAndInsideOfPaging && newVal.length) || (this.insideMore && this.insideOfPaging !== false && newVal.length)) {
				this.$nextTick(() => {
					this._checkShowLoadingMoreWhenNoMoreAndInsideOfPaging(newVal, scrollViewNode, pagingContainerNode);
				})
				if (this.insideMore && this.insideOfPaging !== false && newVal.length) {
					this.showLoadingMore = newVal.length;
				}
			} else {
				this.showLoadingMore = newVal.length;
			}
		},
		//判断当没有更多数据且分页内容未超出z-paging时是否显示没有更多数据的view
		async _checkShowLoadingMoreWhenNoMoreAndInsideOfPaging(totalData, oldScrollViewNode, oldPagingContainerNode) {
			try {
				const scrollViewNode = oldScrollViewNode || await this._getNodeClientRect('.zp-scroll-view');
				if (this.usePageScroll) {
					if (scrollViewNode) {
						const scrollViewTotalH = scrollViewNode[0].top + scrollViewNode[0].height;
						this.insideOfPaging = scrollViewTotalH < this.windowHeight;
						if (this.hideLoadingMoreWhenNoMoreAndInsideOfPaging) {
							this.showLoadingMore = !this.insideOfPaging;
						}
						this._updateInsideOfPaging();
					}
				} else {
					let pagingContainerH = 0;
					let scrollViewH = 0;
					const pagingContainerNode = oldPagingContainerNode || await this._getNodeClientRect('.zp-paging-container-content');
					if (pagingContainerNode) {
						pagingContainerH = pagingContainerNode[0].height;
					}
					if (scrollViewNode) {
						scrollViewH = scrollViewNode[0].height;
					}
					this.insideOfPaging = pagingContainerH < scrollViewH;
					if (this.hideLoadingMoreWhenNoMoreAndInsideOfPaging) {
						this.showLoadingMore = !this.insideOfPaging;
					}
					this._updateInsideOfPaging();
				}
			} catch (e) {
				this.insideOfPaging = !totalData.length;
				if (this.hideLoadingMoreWhenNoMoreAndInsideOfPaging) {
					this.showLoadingMore = !this.insideOfPaging;
				}
				this._updateInsideOfPaging();
			}
		},
		//是否要展示上拉加载更多view
		_showLoadingMore(type) {
			if (!(this.loadingStatus === Enum.More.Default ? this.nShowBottom : true)) return false;
			if (((!this.showLoadingMoreWhenReload || this.isUserPullDown || this.loadingStatus !== Enum.More.Loading) && !this.showLoadingMore) || (!this.loadingMoreEnabled && (!this.showLoadingMoreWhenReload || this
				.isUserPullDown || this.loadingStatus !== Enum.More.Loading)) || this.refresherOnly) return false;
			if (this.useChatRecordMode && type !== 'Loading') return false;
			if (!this.$slots) return false;
			if (type === 'Custom') {
				return this.showDefaultLoadingMoreText && !(this.loadingStatus === Enum.More.NoMore && !this.showLoadingMoreNoMoreView);
			}
			const res = this.loadingStatus === Enum.More[type] && this.$slots[`loadingMore${type}`] && (type === 'NoMore' ? this.showLoadingMoreNoMoreView : true);
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

export default ZPLoadMore;
