// [z-paging]数据处理模块
import u from '.././z-paging-utils'
import c from '.././z-paging-constant'
import Enum from '.././z-paging-enum'
import interceptor from '../z-paging-interceptor'

export default {
	props: {
		//自定义初始的pageNo，默认为1
		defaultPageNo: {
			type: [Number, String],
			default: u.gc('defaultPageNo', 1),
			observer: function(newVal) {
				this.pageNo = newVal;
			},
		},
		//自定义pageSize，默认为10
		defaultPageSize: {
			type: [Number, String],
			default: u.gc('defaultPageSize', 10),
			validator: (value) => {
				if (value <= 0) u.consoleErr('default-page-size必须大于0！');
				return value > 0;
			}
		},
		//为保证数据一致，设置当前tab切换时的标识key，并在complete中传递相同key，若二者不一致，则complete将不会生效
		dataKey: {
			type: [Number, String, Object],
			default: function() {
				return u.gc('dataKey', null);
			},
		},
		//使用缓存，若开启将自动缓存第一页的数据，默认为否。请注意，因考虑到切换tab时不同tab数据不同的情况，默认仅会缓存组件首次加载时第一次请求到的数据，后续的下拉刷新操作不会更新缓存。
		useCache: {
			type: Boolean,
			default: u.gc('useCache', false)
		},
		//使用缓存时缓存的key，用于区分不同列表的缓存数据，useCache为true时必须设置，否则缓存无效
		cacheKey: {
			type: String,
			default: u.gc('cacheKey', null)
		},
		//缓存模式，默认仅会缓存组件首次加载时第一次请求到的数据，可设置为always，即代表总是缓存，每次列表刷新(下拉刷新、调用reload等)都会更新缓存
		cacheMode: {
			type: String,
			default: u.gc('cacheMode', Enum.CacheMode.Default)
		},
		//自动注入的list名，可自动修改父view(包含ref="paging")中对应name的list值
		autowireListName: {
			type: String,
			default: u.gc('autowireListName', '')
		},
		//自动注入的query名，可自动调用父view(包含ref="paging")中的query方法
		autowireQueryName: {
			type: String,
			default: u.gc('autowireQueryName', '')
		},
		//z-paging mounted后自动调用reload方法(mounted后自动调用接口)，默认为是
		auto: {
			type: Boolean,
			default: u.gc('auto', true)
		},
		//用户下拉刷新时是否触发reload方法，默认为是
		reloadWhenRefresh: {
			type: Boolean,
			default: u.gc('reloadWhenRefresh', true)
		},
		//reload时自动滚动到顶部，默认为是
		autoScrollToTopWhenReload: {
			type: Boolean,
			default: u.gc('autoScrollToTopWhenReload', true)
		},
		//reload时立即自动清空原list，默认为是，若立即自动清空，则在reload之后、请求回调之前页面是空白的
		autoCleanListWhenReload: {
			type: Boolean,
			default: u.gc('autoCleanListWhenReload', true)
		},
		//列表刷新时自动显示下拉刷新view，默认为否
		showRefresherWhenReload: {
			type: Boolean,
			default: u.gc('showRefresherWhenReload', false)
		},
		//列表刷新时自动显示加载更多view，且为加载中状态，默认为否
		showLoadingMoreWhenReload: {
			type: Boolean,
			default: u.gc('showLoadingMoreWhenReload', false)
		},
		//组件created时立即触发reload(可解决一些情况下先看到页面再看到loading的问题)，auto为true时有效。为否时将在mounted+nextTick后触发reload，默认为否
		createdReload: {
			type: Boolean,
			default: u.gc('createdReload', false)
		},
		//本地分页时上拉加载更多延迟时间，单位为毫秒，默认200毫秒
		localPagingLoadingTime: {
			type: [Number, String],
			default: u.gc('localPagingLoadingTime', 200)
		},
		//使用聊天记录模式，默认为否
		useChatRecordMode: {
			type: Boolean,
			default: u.gc('useChatRecordMode', false)
		},
		//使用聊天记录模式时是否自动隐藏键盘：在用户触摸列表时候自动隐藏键盘，默认为是
		autoHideKeyboardWhenChat: {
			type: Boolean,
			default: u.gc('autoHideKeyboardWhenChat', true)
		},
		//自动拼接complete中传过来的数组(使用聊天记录模式时无效)
		concat: {
			type: Boolean,
			default: u.gc('concat', true)
		},
		//父组件v-model所绑定的list的值
		value: {
			type: Array,
			default: function() {
				return [];
			}
		},
		// #ifdef VUE3
		modelValue: {
			type: Array,
			default: function() {
				return [];
			}
		}
		// #endif
	},
	data (){
		return {
			currentData: [],
			totalData: [],
			realTotalData: [],
			totalLocalPagingList: [],
			dataPromiseResultMap: {
				reload: null,
				complete: null,
				localPaging: null
			},
			isSettingCacheList: false,
			pageNo: 1,
			currentRefreshPageSize: 0,
			isLocalPaging: false,
			isAddedData: false,
			isTotalChangeFromAddData: false,
			privateConcat: true,
			myParentQuery: -1,
			firstPageLoaded: false,
			pagingLoaded: false,
			loaded: false,
			isUserReload: true,
			fromEmptyViewReload: false,
			queryFrom: '',
			listRendering: false,
		}
	},
	computed: {
		pageSize() {
			return this.defaultPageSize;
		},
		finalConcat() {
			return this.concat && this.privateConcat;
		},
		finalUseCache() {
			if (this.useCache && !this.cacheKey) {
				u.consoleErr('use-cache为true时，必须设置cache-key，否则缓存无效！');
			}
			return this.useCache && !!this.cacheKey;
		},
		finalCacheKey() {
			return this.cacheKey ? `${c.cachePrefixKey}-${this.cacheKey}` : null; 
		},
		isFirstPage() {
			return this.pageNo === this.defaultPageNo;
		}
	},
	watch: {
		totalData(newVal, oldVal) {
			this._totalDataChange(newVal, oldVal);
		},
		currentData(newVal, oldVal) {
			this._currentDataChange(newVal, oldVal);
		},
		useChatRecordMode(newVal, oldVal) {
			if (newVal) {
				this.nLoadingMoreFixedHeight = false;
			}
		},
		value: {
			handler(newVal) {
				this.realTotalData = newVal;
			},
			immediate: true
		},
		// #ifdef VUE3
		modelValue: {
			handler(newVal) {
				this.realTotalData = newVal;
			},
			immediate: true
		}
		// #endif
	},
	methods: {
		//请求结束(成功或者失败)调用此方法，将请求的结果传递给z-paging处理，第一个参数为请求结果数组，第二个参数为是否成功(默认是是）
		complete(data, success = true) {
			this.customNoMore = -1;
			return this.addData(data, success);
		},
		//【保证数据一致】请求结束(成功或者失败)调用此方法，将请求的结果传递给z-paging处理，第一个参数为请求结果数组，第二个参数为dataKey，需与:data-key绑定的一致，第三个参数为是否成功(默认为是）
		completeByKey(data, dataKey = null, success = true) {
			if (dataKey !== null && this.dataKey !== null && dataKey !== this.dataKey) {
				this.isFirstPage && this.endRefresh();
				return new Promise(resolve => resolve());
			}
			this.customNoMore = -1;
			return this.addData(data, success);
		},
		//【通过total判断是否有更多数据】请求结束(成功或者失败)调用此方法，将请求的结果传递给z-paging处理，第一个参数为请求结果数组，第二个参数为total(列表总数)，第三个参数为是否成功(默认为是）
		completeByTotal(data, total, success = true) {
			if (total == 'undefined') {
				this.customNoMore = -1;
			} else {
				const dataTypeRes = this._checkDataType(data, success, false);
				data = dataTypeRes.data;
				success = dataTypeRes.success;
				if (total >= 0 && success) {
					return new Promise((resolve, reject) => {
						this.$nextTick(() => {
							let nomore = false;
							const realTotalDataCount = this.pageNo == this.defaultPageNo ? 0 : this.realTotalData.length;
							const dataLength = this.privateConcat ? data.length : 0;
							let exceedCount = realTotalDataCount + dataLength - total;
							if (exceedCount >= 0) {
								nomore = true;
								exceedCount = this.defaultPageSize - exceedCount;
								if (this.privateConcat && exceedCount > 0 && exceedCount < data.length) {
									data = data.splice(0, exceedCount);
								}
							}
							this.completeByNoMore(data, nomore, success).then(res => resolve(res)).catch(() => reject());
						})
					});
				}
			}
			return this.addData(data, success);
		},
		//【自行判断是否有更多数据】请求结束(成功或者失败)调用此方法，将请求的结果传递给z-paging处理，第一个参数为请求结果数组，第二个参数为是否有更多数据，第三个参数为是否成功(默认是是）
		completeByNoMore(data, nomore, success = true) {
			if (nomore != 'undefined') {
				this.customNoMore = nomore == true ? 1 : 0;
			}
			return this.addData(data, success);
		},
		//与上方complete方法功能一致，新版本中设置服务端回调数组请使用complete方法
		addData(data, success = true) {
			if (!this.fromCompleteEmit) {
				this.disabledCompleteEmit = true;
				this.fromCompleteEmit = false;
			}
			const currentTimeStamp = u.getTime();
			const disTime = currentTimeStamp - this.requestTimeStamp;
			let minDelay = this.minDelay;
			if (this.isFirstPage && this.finalShowRefresherWhenReload) {
				minDelay = Math.max(400, minDelay);
			}
			const addDataDalay = (this.requestTimeStamp > 0 && disTime < minDelay) ? minDelay - disTime : 0;
			this.$nextTick(() => {
				u.delay(() => {
					this._addData(data, success, false);
				}, this.delay > 0 ? this.delay : addDataDalay)
			})
			
			return new Promise((resolve, reject) => {
				this.dataPromiseResultMap.complete = { resolve, reject };
			});
		},
		//从顶部添加数据，不会影响分页的pageNo和pageSize
		addDataFromTop(data, toTop = true, toTopWithAnimate = true) {
			data = Object.prototype.toString.call(data) !== '[object Array]' ? [data] : data;
			this.totalData = [...data, ...this.totalData];
			if (toTop) {
				u.delay(() => {
					this._scrollToTop(toTopWithAnimate);
				})
			}
		},
		//重新设置列表数据，调用此方法不会影响pageNo和pageSize，也不会触发请求。适用场景：当需要删除列表中某一项时，将删除对应项后的数组通过此方法传递给z-paging。(当出现类似的需要修改列表数组的场景时，请使用此方法，请勿直接修改page中:list.sync绑定的数组)
		resetTotalData(data) {
			this.isTotalChangeFromAddData = true;
			data = Object.prototype.toString.call(data) !== '[object Array]' ? [data] : data;
			this.totalData = data;
		},
		//添加聊天记录
		addChatRecordData(data, toBottom = true, toBottomWithAnimate = true) {
			data = Object.prototype.toString.call(data) !== '[object Array]' ? [data] : data;
			if (!this.useChatRecordMode) return;
			this.isTotalChangeFromAddData = true;
			//#ifndef APP-NVUE
			this.totalData = [...this.totalData, ...data];
			//#endif
			//#ifdef APP-NVUE
			this.totalData = this.nIsFirstPageAndNoMore ? [...this.totalData, ...data] : [...data, ...this.totalData];
			//#endif
			if (toBottom) {
				u.delay(() => {
					//#ifndef APP-NVUE
					this._scrollToBottom(toBottomWithAnimate);
					//#endif
					//#ifdef APP-NVUE
					this.nIsFirstPageAndNoMore ? this._scrollToBottom(toBottomWithAnimate) : this._scrollToTop(toBottomWithAnimate);
					//#endif
				})
			}
		},
		//设置本地分页数据，请求结束(成功或者失败)调用此方法，将请求的结果传递给z-paging作分页处理（若调用了此方法，则上拉加载更多时内部会自动分页，不会触发@query所绑定的事件）
		setLocalPaging(data, success = true) {
			this.isLocalPaging = true;
			this.$nextTick(() => {
				this._addData(data, success, true);
			})
			return new Promise((resolve, reject) => {
				this.dataPromiseResultMap.localPaging = { resolve, reject };
			});
		},
		//重新加载分页数据，pageNo会恢复为默认值，相当于下拉刷新的效果(animate为true时会展示下拉刷新动画，默认为false)
		reload(animate = this.showRefresherWhenReload) {
			if (animate) {
				this.privateShowRefresherWhenReload = animate;
				this.isUserPullDown = true;
			}
			if (!this.showLoadingMoreWhenReload) {
				this.listRendering = true;
			}
			this.$nextTick(() => {
				this._preReload(animate, false);
			})
			return new Promise((resolve, reject) => {
				this.dataPromiseResultMap.reload = { resolve, reject };
			});
		},
		//刷新列表数据，pageNo和pageSize不会重置，列表数据会重新从服务端获取。必须保证@query绑定的方法中的pageNo和pageSize和传给服务端的一致
		refresh() {
			if (!this.realTotalData.length) return this.reload();
			const disPageNo = this.pageNo - this.defaultPageNo + 1;
			if (disPageNo >= 1) {
				this.loading = true;
				this.privateConcat = false;
				const totalPageSize = disPageNo * this.pageSize;
				this.currentRefreshPageSize = totalPageSize;
				this._emitQuery(this.defaultPageNo, totalPageSize, Enum.QueryFrom.Refresh);
				this._callMyParentQuery(this.defaultPageNo, totalPageSize);
			}
			return new Promise((resolve, reject) => {
				this.dataPromiseResultMap.reload = { resolve, reject };
			});
		},
		//手动更新列表缓存数据，将自动截取v-model绑定的list中的前pageSize条覆盖缓存，请确保在list数据更新到预期结果后再调用此方法
		updateCache() {
			if (this.finalUseCache && this.totalData.length) {
				this._saveLocalCache(this.totalData.slice(0, Math.min(this.totalData.length, this.pageSize)));
			}
		},
		//清空分页数据
		clean() {
			this._reload(true);
			this._addData([], true, false);
		},
		//清空分页数据
		clear() {
			this.clean();
		},
		//手动触发滚动到顶部加载更多，聊天记录模式时有效
		doChatRecordLoadMore() {
			this.useChatRecordMode && this._onLoadingMore('click');
		},
		//reload之前的一些处理
		_preReload(animate = this.showRefresherWhenReload, isFromMounted = true) {
			this.isUserReload = true;
			this.loadingType = Enum.LoadingType.Refresher;
			if (animate) {
				this.privateShowRefresherWhenReload = animate;
				// #ifndef APP-NVUE
				if (this.useCustomRefresher) {
					this._doRefresherRefreshAnimate();
				} else {
					this.refresherTriggered = true;
				}
				// #endif
				// #ifdef APP-NVUE
				this.refresherStatus = Enum.Refresher.Loading;
				this.refresherRevealStackCount ++;
				u.delay(() => {
					this._getNodeClientRect('zp-n-refresh-container', false).then((node) => {
						if (node) {
							let nodeHeight = node[0].height;
							this.nShowRefresherReveal = true;
							this.nShowRefresherRevealHeight = nodeHeight;
							u.delay(() => {
								this._nDoRefresherEndAnimation(0, -nodeHeight, false, false);
								u.delay(() => {
									this._nDoRefresherEndAnimation(nodeHeight, 0);
								}, 10)
							}, 10)
						}
						this._reload(false, isFromMounted);
						this._doRefresherLoad(false);
					});
				}, this.pagingLoaded ? 10 : 100)
				return;
				// #endif
			} else {
				this._refresherEnd(false, false, false, false);
			}
			this._reload(false, isFromMounted);
		},
		//重新加载分页数据
		_reload(isClean = false, isFromMounted = false, isUserPullDown = false) {
			this.isAddedData = false;
			this.insideOfPaging = -1;
			this.cacheScrollNodeHeight = -1;
			this.pageNo = this.defaultPageNo;
			this._cleanRefresherEndTimeout();
			!this.privateShowRefresherWhenReload && !isClean && this._startLoading(true);
			this.firstPageLoaded = true;
			this.isTotalChangeFromAddData = false;
			if (!this.isSettingCacheList) {
				this.totalData = [];
			}
			if (!isClean) {
				this._emitQuery(this.pageNo, this.defaultPageSize, isUserPullDown ? Enum.QueryFrom.UserPullDown : Enum.QueryFrom.Reload);
				let delay = 0;
				// #ifdef MP-TOUTIAO
				delay = 5;
				// #endif
				u.delay(this._callMyParentQuery, delay);
				if (!isFromMounted && this.autoScrollToTopWhenReload) {
					let checkedNRefresherLoading = true;
					// #ifdef APP-NVUE
					checkedNRefresherLoading = !this.nRefresherLoading;
					// #endif
					checkedNRefresherLoading && this._scrollToTop(false);
				}
			}
			// #ifdef APP-NVUE
			this.$nextTick(() => {
				this.nShowBottom = this.realTotalData.length > 0;
			})
			// #endif
		},
		//处理服务端返回的数组
		_addData(data, success, isLocal) {
			this.isAddedData = true;
			this.fromEmptyViewReload = false;
			this.isTotalChangeFromAddData = true;
			this.refresherTriggered = false;
			this._endSystemLoadingAndRefresh();
			const tempIsUserPullDown = this.isUserPullDown;
			if (this.showRefresherUpdateTime && this.isFirstPage) {
				u.setRefesrherTime(u.getTime(), this.refresherUpdateTimeKey);
				this.$refs.refresh && this.$refs.refresh.updateTime();
			}
			if (!isLocal && tempIsUserPullDown && this.isFirstPage) {
				this.isUserPullDown = false;
			}
			if (!this.isFirstPage) {
				this.listRendering = true;
				this.$nextTick(() => {
					u.delay(() => {
						this.listRendering = false;
					})
				})
			} else {
				this.listRendering = false;
			}
			let dataTypeRes = this._checkDataType(data, success, isLocal);
			data = dataTypeRes.data;
			success = dataTypeRes.success;
			let delayTime = c.delayTime;
			// #ifdef APP-NVUE
			if (this.useChatRecordMode) delayTime = 0;
			// #endif
			this.loadingForNow = false;
			u.delay(() => {
				this.pagingLoaded = true;
				this.$nextTick(()=>{
					!isLocal && this._refresherEnd(delayTime > 0, true, tempIsUserPullDown);
				})
			})
			if (this.isFirstPage) {
				this.isLoadFailed = !success;
				this.$emit('isLoadFailedChange', this.isLoadFailed);
				if (this.finalUseCache && success && (this.cacheMode === Enum.CacheMode.Always ? true : this.isSettingCacheList)) {
					this._saveLocalCache(data);
				}
			}
			this.isSettingCacheList = false;
			if (success) {
				if (!(this.privateConcat === false && this.loadingStatus === Enum.More.NoMore)) {
					this.loadingStatus = Enum.More.Default;
				}
				if (isLocal) {
					this.totalLocalPagingList = data;
					const localPageNo = this.defaultPageNo;
					const localPageSize = this.queryFrom !== Enum.QueryFrom.Refresh ? this.defaultPageSize : this.currentRefreshPageSize;
					this._localPagingQueryList(localPageNo, localPageSize, 0, res => {
						this.completeByTotal(res, this.totalLocalPagingList.length);
					})
				} else {
					let dataChangeDelayTime = 0;
					// #ifdef APP-NVUE
					if (this.privateShowRefresherWhenReload && this.finalNvueListIs === 'waterfall') {
						dataChangeDelayTime = 150;
					}
					// #endif
					u.delay(() => {
						this._currentDataChange(data, this.currentData);
						this._callDataPromise(true, this.totalData);
					}, dataChangeDelayTime)
				}
			} else {
				this._currentDataChange(data, this.currentData);
				this._callDataPromise(false);
				this.loadingStatus = Enum.More.Fail;
				if (this.loadingType === Enum.LoadingType.LoadingMore) {
					this.pageNo --;
				}
			}
		},
		//所有数据改变时调用
		_totalDataChange(newVal, oldVal, eventThrow=true) {
			if ((!this.isUserReload || !this.autoCleanListWhenReload) && this.firstPageLoaded && !newVal.length && oldVal.length) {
				return;
			}
			this._doCheckScrollViewShouldFullHeight(newVal);
			if(!this.realTotalData.length && !newVal.length){
				eventThrow = false;
			}
			this.realTotalData = newVal;
			if (eventThrow) {
				this.$emit('input', newVal);
				// #ifdef VUE3
				this.$emit('update:modelValue', newVal);
				// #endif
				this.$emit('update:list', newVal);
				this.$emit('listChange', newVal);
				this._callMyParentList(newVal);
			}
			this.firstPageLoaded = false;
			this.isTotalChangeFromAddData = false;
			this.$nextTick(() => {
				u.delay(()=>{
					this._getNodeClientRect('.zp-paging-container-content').then(res => {
						res && this.$emit('contentHeightChanged', res[0].height);
					});
				}, c.delayTime * (this.isIos ? 1 : 3))
				// #ifdef APP-NVUE
				if (this.useChatRecordMode && this.nIsFirstPageAndNoMore && this.isFirstPage && !this.nFirstPageAndNoMoreChecked) {
					this.nFirstPageAndNoMoreChecked = true;
					this._scrollToBottom(false);
				}
				u.delay(() => {
					this.nShowBottom = true;
				}, c.delayTime * 6, 'nShowBottomDelay');
				// #endif
			})
		},
		//当前数据改变时调用
		_currentDataChange(newVal, oldVal) {
			newVal = [...newVal];
			// #ifndef APP-NVUE
			this.finalUseVirtualList && this._setCellIndex(newVal, this.totalData.length === 0)
			this.useChatRecordMode && newVal.reverse();
			// #endif
			if (this.isFirstPage && this.finalConcat) {
				this.totalData = [];
			}
			if (this.customNoMore !== -1) {
				if (this.customNoMore === 1 || !newVal.length) {
					this.loadingStatus = Enum.More.NoMore;
				}
			} else {
				if (!newVal.length || (newVal.length && newVal.length < this.defaultPageSize)) {
					this.loadingStatus = Enum.More.NoMore;
				}
			}
			if (!this.totalData.length) {
				if (this.finalConcat) {
					// #ifdef APP-NVUE
					if (this.useChatRecordMode && this.isFirstPage && this.loadingStatus === Enum.More.NoMore) {
						newVal.reverse();
					}
					// #endif
					this.totalData = newVal;
				}
				if (this.useChatRecordMode) {
					// #ifndef APP-NVUE
					this.$nextTick(() => {
						this._scrollToBottom(false);
					})
					// #endif
				}
			} else {
				if (this.useChatRecordMode) {
					// #ifdef APP-NVUE
					this.totalData = [...this.totalData, ...newVal];
					// #endif
					//#ifndef APP-NVUE
					const idIndex = newVal.length;
					let idIndexStr = `z-paging-${idIndex}`;
					this.totalData = [...newVal, ...this.totalData];
					if (this.pageNo !== this.defaultPageNo) {
						this.privateScrollWithAnimation = 0;
						this.$emit('update:chatIndex', idIndex);
						this.$nextTick(() => {
							this._scrollIntoView(idIndexStr, 30 + Math.max(0, this.cacheTopHeight), false, () => {
								this.$emit('update:chatIndex', 0);
							});
						})
					} else {
						this.$nextTick(() => {
							this._scrollToBottom(false);
						})
					}
					//#endif
		
				} else {
					if (this.finalConcat) {
						const currentScrollTop = this.oldScrollTop;
						this.totalData = [...this.totalData, ...newVal];
						// #ifdef MP-WEIXIN
						if (!this.isIos && !this.refresherOnly && !this.usePageScroll && newVal.length) {
							this.loadingMoreTimeStamp = u.getTime();
							this.$nextTick(() => {
								this.scrollToY(currentScrollTop);
							})
						}
						// #endif
					} else {
						this.totalData = newVal;
					}
				}
			}
			this.privateConcat = true;
		},
		//本地分页请求
		_localPagingQueryList(pageNo, pageSize, localPagingLoadingTime, callback) {
			pageNo = Math.max(1, pageNo);
			pageSize = Math.max(1, pageSize);
			const totalPagingList = [...this.totalLocalPagingList];
			const pageNoIndex = (pageNo - 1) * pageSize;
			const finalPageNoIndex = Math.min(totalPagingList.length, pageNoIndex + pageSize);
			const resultPagingList = totalPagingList.splice(pageNoIndex, finalPageNoIndex - pageNoIndex);
			u.delay(() => callback(resultPagingList), localPagingLoadingTime)
		},
		//存储列表缓存数据
		_saveLocalCache(data) {
			uni.setStorageSync(this.finalCacheKey, data);
		},
		//通过缓存数据填充列表数据
		_setListByLocalCache() {
			this.totalData = uni.getStorageSync(this.finalCacheKey) || [];
			this.isSettingCacheList = true;
		},
		//修改父view的list
		_callMyParentList(newVal) {
			if (this.autowireListName.length) {
				const myParent = u.getParent(this.$parent);
				if (myParent && myParent[this.autowireListName]) {
					myParent[this.autowireListName] = newVal;
				}
			}
		},
		//调用父view的query
		_callMyParentQuery(customPageNo = 0, customPageSize = 0) {
			if (this.autowireQueryName) {
				if (this.myParentQuery === -1) {
					const myParent = u.getParent(this.$parent);
					if (myParent && myParent[this.autowireQueryName]) {
						this.myParentQuery = myParent[this.autowireQueryName];
					}
				} 
				if (this.myParentQuery !== -1) {
					customPageSize > 0 ? this.myParentQuery(customPageNo, customPageSize) : this.myParentQuery(this.pageNo, this.defaultPageSize);
				}
			}
		},
		//emit query事件
		_emitQuery(pageNo, pageSize, from){
			this.queryFrom = from;
			this.requestTimeStamp = u.getTime();
			const [lastItem] = this.realTotalData.slice(-1);
			this.$emit('query', ...interceptor._handleQuery(pageNo, pageSize, from, lastItem || null));
		},
		//触发数据改变promise
		_callDataPromise(success, totalList) {
			for (const key in this.dataPromiseResultMap) {
				const obj = this.dataPromiseResultMap[key];
				success ? (!!obj && obj.resolve({ totalList, noMore: this.loadingStatus === Enum.More.NoMore })) : (!!obj && obj.reject());
			}
		},
		//检查complete data的类型
		_checkDataType(data, success, isLocal) {
			const dataType = Object.prototype.toString.call(data);
			if (dataType === '[object Boolean]') {
				success = data;
				data = [];
			} else if (dataType !== '[object Array]') {
				data = [];
				if (dataType !== '[object Undefined]' && dataType !== '[object Null]') {
					u.consoleErr(`${isLocal ? 'setLocalPaging' : 'complete'}参数类型不正确，第一个参数类型必须为Array!`);
				}
			}
			return { data, success };
		},
	}
}
