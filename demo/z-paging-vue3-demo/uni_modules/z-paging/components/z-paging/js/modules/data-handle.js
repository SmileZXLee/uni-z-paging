// [z-paging]数据处理模块
import u from '.././z-paging-utils'
import c from '.././z-paging-constant'
import Enum from '.././z-paging-enum'
import interceptor from '../z-paging-interceptor'

export default {
	props: {
		// 自定义初始的pageNo，默认为1
		defaultPageNo: {
			type: Number,
			default: u.gc('defaultPageNo', 1),
			observer: function(newVal) {
				this.pageNo = newVal;
			},
		},
		// 自定义pageSize，默认为10
		defaultPageSize: {
			type: Number,
			default: u.gc('defaultPageSize', 10),
			validator: (value) => {
				if (value <= 0) u.consoleErr('default-page-size必须大于0！');
				return value > 0;
			}
		},
		// 为保证数据一致，设置当前tab切换时的标识key，并在complete中传递相同key，若二者不一致，则complete将不会生效
		dataKey: {
			type: [Number, String, Object],
			default: u.gc('dataKey', null),
		},
		// 使用缓存，若开启将自动缓存第一页的数据，默认为否。请注意，因考虑到切换tab时不同tab数据不同的情况，默认仅会缓存组件首次加载时第一次请求到的数据，后续的下拉刷新操作不会更新缓存。
		useCache: {
			type: Boolean,
			default: u.gc('useCache', false)
		},
		// 使用缓存时缓存的key，用于区分不同列表的缓存数据，useCache为true时必须设置，否则缓存无效
		cacheKey: {
			type: String,
			default: u.gc('cacheKey', null)
		},
		// 缓存模式，默认仅会缓存组件首次加载时第一次请求到的数据，可设置为always，即代表总是缓存，每次列表刷新(下拉刷新、调用reload等)都会更新缓存
		cacheMode: {
			type: String,
			default: u.gc('cacheMode', Enum.CacheMode.Default)
		},
		// 自动注入的list名，可自动修改父view(包含ref="paging")中对应name的list值
		autowireListName: {
			type: String,
			default: u.gc('autowireListName', '')
		},
		// 自动注入的query名，可自动调用父view(包含ref="paging")中的query方法
		autowireQueryName: {
			type: String,
			default: u.gc('autowireQueryName', '')
		},
		// 获取分页数据Function，功能与@query类似。若设置了fetch则@query将不再触发
		fetch: {
			type: Function,
			default: null
		},
		// fetch的附加参数，fetch配置后有效
		fetchParams: {
			type: Object,
			default: u.gc('fetchParams', null)
		},
		// z-paging mounted后自动调用reload方法(mounted后自动调用接口)，默认为是
		auto: {
			type: Boolean,
			default: u.gc('auto', true)
		},
		// 用户下拉刷新时是否触发reload方法，默认为是
		reloadWhenRefresh: {
			type: Boolean,
			default: u.gc('reloadWhenRefresh', true)
		},
		// reload时自动滚动到顶部，默认为是
		autoScrollToTopWhenReload: {
			type: Boolean,
			default: u.gc('autoScrollToTopWhenReload', true)
		},
		// reload时立即自动清空原list，默认为是，若立即自动清空，则在reload之后、请求回调之前页面是空白的
		autoCleanListWhenReload: {
			type: Boolean,
			default: u.gc('autoCleanListWhenReload', true)
		},
		// 列表刷新时自动显示下拉刷新view，默认为否
		showRefresherWhenReload: {
			type: Boolean,
			default: u.gc('showRefresherWhenReload', false)
		},
		// 列表刷新时自动显示加载更多view，且为加载中状态，默认为否
		showLoadingMoreWhenReload: {
			type: Boolean,
			default: u.gc('showLoadingMoreWhenReload', false)
		},
		// 组件created时立即触发reload(可解决一些情况下先看到页面再看到loading的问题)，auto为true时有效。为否时将在mounted+nextTick后触发reload，默认为否
		createdReload: {
			type: Boolean,
			default: u.gc('createdReload', false)
		},
		// 本地分页时上拉加载更多延迟时间，单位为毫秒，默认200毫秒
		localPagingLoadingTime: {
			type: [Number, String],
			default: u.gc('localPagingLoadingTime', 200)
		},
		// 自动拼接complete中传过来的数组(使用聊天记录模式时无效)
		concat: {
			type: Boolean,
			default: u.gc('concat', true)
		},
		// 请求失败是否触发reject，默认为是
		callNetworkReject: {
			type: Boolean,
			default: u.gc('callNetworkReject', true)
		},
		// 父组件v-model所绑定的list的值
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
			isHandlingRefreshToPage: false,
			isFirstPageAndNoMore: false,
			totalDataChangeThrow: true,
			addDataFromTopBufferedInsert: u.useBufferedInsert(this._addDataFromTop)
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
			this._totalDataChange(newVal, oldVal, this.totalDataChangeThrow);
			this.totalDataChangeThrow = true;
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
				// 当v-model绑定的数据源被更改时，此时数据源改变不emit input事件，避免循环调用
				if (newVal !== this.totalData) {
					this.totalDataChangeThrow = false;
					this.totalData = newVal;
				}
			},
			immediate: true
		},
		// #ifdef VUE3
		modelValue: {
			handler(newVal) {
				// 当v-model绑定的数据源被更改时，此时数据源改变不emit input事件，避免循环调用
				if (newVal !== this.totalData) {
					this.totalDataChangeThrow = false;
					this.totalData = newVal;
				}
			},
			immediate: true
		}
		// #endif
	},
	methods: {
		// 请求结束(成功或者失败)调用此方法，将请求的结果传递给z-paging处理，第一个参数为请求结果数组，第二个参数为是否成功(默认为是）
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
							// 没有更多数据了
							if (exceedCount >= 0) {
								nomore = true;
								// 仅截取total内部分的数据
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
		//【自行判断是否有更多数据】请求结束(成功或者失败)调用此方法，将请求的结果传递给z-paging处理，第一个参数为请求结果数组，第二个参数为是否没有更多数据，第三个参数为是否成功(默认是是）
		completeByNoMore(data, nomore, success = true) {
			if (nomore != 'undefined') {
				this.customNoMore = nomore == true ? 1 : 0;
			}
			return this.addData(data, success);
		},
		// 请求结束且请求失败时调用，支持传入请求失败原因
		completeByError(errorMsg) {
			this.customerEmptyViewErrorText = errorMsg;
			return this.complete(false);
		},
		// 与上方complete方法功能一致，新版本中设置服务端回调数组请使用complete方法
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
		// 从顶部添加数据，不会影响分页的pageNo和pageSize
		addDataFromTop(data, toTop = true, toTopWithAnimate = true) {
			// 如果使用了虚拟列表，则需要对短时间内的大量数据进行整合然后一次性添加，避免设置虚拟列表cellIndex时候key冲突的问题，否则正常调用
			(this.finalUseVirtualList ? this.addDataFromTopBufferedInsert : this._addDataFromTop)(
				data, toTop, toTopWithAnimate
			);
		},
		// 重新设置列表数据，调用此方法不会影响pageNo和pageSize，也不会触发请求。适用场景：当需要删除列表中某一项时，将删除对应项后的数组通过此方法传递给z-paging。(当出现类似的需要修改列表数组的场景时，请使用此方法，请勿直接修改page中:list.sync绑定的数组)
		resetTotalData(data) {
			this.isTotalChangeFromAddData = true;
			data = Object.prototype.toString.call(data) !== '[object Array]' ? [data] : data;
			this.totalData = data;
		},
		// 设置本地分页数据，请求结束(成功或者失败)调用此方法，将请求的结果传递给z-paging作分页处理（若调用了此方法，则上拉加载更多时内部会自动分页，不会触发@query所绑定的事件）
		setLocalPaging(data, success = true) {
			this.isLocalPaging = true;
			this.$nextTick(() => {
				this._addData(data, success, true);
			})
			return new Promise((resolve, reject) => {
				this.dataPromiseResultMap.localPaging = { resolve, reject };
			});
		},
		// 重新加载分页数据，pageNo会恢复为默认值，相当于下拉刷新的效果(animate为true时会展示下拉刷新动画，默认为false)
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
		// 刷新列表数据，pageNo和pageSize不会重置，列表数据会重新从服务端获取。必须保证@query绑定的方法中的pageNo和pageSize和传给服务端的一致
		refresh() {
			return this._handleRefreshWithDisPageNo(this.pageNo - this.defaultPageNo + 1);
		},
		// 刷新列表数据至指定页，例如pageNo=5时则代表刷新列表至第5页，此时pageNo会变为5，列表会展示前5页的数据。必须保证@query绑定的方法中的pageNo和pageSize和传给服务端的一致
		refreshToPage(pageNo) {
			this.isHandlingRefreshToPage = true;
			return this._handleRefreshWithDisPageNo(pageNo + this.defaultPageNo - 1);
		},
		// 手动更新列表缓存数据，将自动截取v-model绑定的list中的前pageSize条覆盖缓存，请确保在list数据更新到预期结果后再调用此方法
		updateCache() {
			if (this.finalUseCache && this.totalData.length) {
				this._saveLocalCache(this.totalData.slice(0, Math.min(this.totalData.length, this.pageSize)));
			}
		},
		// 清空分页数据
		clean() {
			this._reload(true);
			this._addData([], true, false);
		},
		// 清空分页数据
		clear() {
			this.clean();
		},
		// reload之前的一些处理
		_preReload(animate = this.showRefresherWhenReload, isFromMounted = true, retryCount = 0) {
			const showRefresher = this.finalRefresherEnabled && this.useCustomRefresher;
			// #ifndef APP-NVUE
			// 如果获取slot="refresher"高度失败，则不触发reload，直到获取slot="refresher"高度成功
			if (this.customRefresherHeight === -1 && showRefresher) {
				u.delay(() => {
					retryCount ++;
					// 如果重试次数是10的倍数(也就是每500毫秒)，尝试重新获取一下slot="refresher"高度
					// 此举是为了解决在某些特殊情况下，z-paging组件mounted了，但是未展示在用户面前，（比如在tabbar页面中，未切换到对应tabbar但是通过代码让z-paging展示了，此时控制台会报Error: Not Found：Page，因为这时候去获取dom节点信息获取不到）
					// 当用户在某个时刻让此z-paging展示在面前时，即可顺利获取到slot="refresher"高度，递归停止
					if (retryCount % 10 === 0) {
						this._updateCustomRefresherHeight();
					}
					this._preReload(animate, isFromMounted, retryCount);
				}, c.delayTime / 2);
				return;
			}
			// #endif
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
		// 重新加载分页数据
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
		// 处理服务端返回的数组
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
			this.listRendering = true;
			this.$nextTick(() => {
				u.delay(() => this.listRendering = false);
			})
			let dataTypeRes = this._checkDataType(data, success, isLocal);
			data = dataTypeRes.data;
			success = dataTypeRes.success;
			let delayTime = c.delayTime;
			if (this.useChatRecordMode) delayTime = 0;
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
				if (!(this.privateConcat === false && !this.isHandlingRefreshToPage && this.loadingStatus === Enum.More.NoMore)) {
					this.loadingStatus = Enum.More.Default;
				}
				if (isLocal) {
					// 如果当前是本地分页，则必然是由setLocalPaging方法触发，此时直接本地加载第一页数据即可。后续本地分页加载更多方法由滚动到底部加载更多事件处理
					this.totalLocalPagingList = data;
					const localPageNo = this.defaultPageNo;
					const localPageSize = this.queryFrom !== Enum.QueryFrom.Refresh ? this.defaultPageSize : this.currentRefreshPageSize;
					this._localPagingQueryList(localPageNo, localPageSize, 0, res => {
						u.delay(() => {
							this.completeByTotal(res, this.totalLocalPagingList.length);;
						}, 0)
					})
				} else {
					// 如果当前不是本地分页，则按照正常分页逻辑进行数据处理&emit数据
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
				if (this.isHandlingRefreshToPage) {
					this.isHandlingRefreshToPage = false;
					this.pageNo = this.defaultPageNo + Math.ceil(data.length / this.pageSize) - 1;
					if (data.length % this.pageSize !== 0) {
						this.customNoMore = 1;
					}
				}
			} else {
				this._currentDataChange(data, this.currentData);
				this._callDataPromise(false);
				this.loadingStatus = Enum.More.Fail;
				this.isHandlingRefreshToPage = false;
				if (this.loadingType === Enum.LoadingType.LoadMore) {
					this.pageNo --;
				}
			}
		},
		// 所有数据改变时调用
		_totalDataChange(newVal, oldVal, eventThrow=true) {
			if ((!this.isUserReload || !this.autoCleanListWhenReload) && this.firstPageLoaded && !newVal.length && oldVal.length) {
				return;
			}
			this._doCheckScrollViewShouldFullHeight(newVal);
			if(!this.realTotalData.length && !newVal.length){
				eventThrow = false;
			}
			this.realTotalData = newVal;
			// emit列表更新事件
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
					// emit z-paging内容区域高度改变事件
					this._getNodeClientRect('.zp-paging-container-content').then(res => {
						res && this.$emit('contentHeightChanged', res[0].height);
					});
				}, c.delayTime * (this.isIos ? 1 : 3))
				// #ifdef APP-NVUE
				// 在nvue中延时600毫秒展示底部加载更多，避免底部加载更多太早加载闪一下的问题
				u.delay(() => {
					this.nShowBottom = true;
				}, c.delayTime * 6, 'nShowBottomDelay');
				// #endif
			})
		},
		// 当前数据改变时调用
		_currentDataChange(newVal, oldVal) {
			newVal = [...newVal];
			// #ifndef APP-NVUE
			this.finalUseVirtualList && this._setCellIndex(newVal, 'bottom');
			// #endif
			if (this.isFirstPage && this.finalConcat) {
				this.totalData = [];
			}
			// customNoMore：-1代表交由z-paging自行判断；1代表没有更多了；0代表还有更多数据
			if (this.customNoMore !== -1) {
				// 如果customNoMore等于1 或者 customNoMore不是0并且新增数组长度为0(也就是不是明确的还有更多数据并且新增的数组长度为0)，则没有更多数据了
				if (this.customNoMore === 1 || (this.customNoMore !== 0 && !newVal.length)) {
					this.loadingStatus = Enum.More.NoMore;
				}
			} else {
				// 如果新增的数据数组长度为0 或者 新增的数组长度小于默认的pageSize，则没有更多数据了
				if (!newVal.length || (newVal.length && newVal.length < this.defaultPageSize)) {
					this.loadingStatus = Enum.More.NoMore;
				}
			}
			if (!this.totalData.length) {
				// #ifdef APP-NVUE
				// 如果在聊天记录模式+nvue中，并且数据不满一页时需要将列表倒序，因为此时没有将列表旋转180度，数组中第0条数据应当在最底下显示
				if (this.useChatRecordMode && this.finalConcat && this.isFirstPage && this.loadingStatus === Enum.More.NoMore) {
					newVal.reverse();
				}
				// #endif
				this.totalData = newVal;
			} else {
				if (this.finalConcat) {
					const currentScrollTop = this.oldScrollTop;
					this.totalData = [...this.totalData, ...newVal];
					// 此处是为了解决在微信小程序中，在某些情况下滚动到底部加载更多后滚动位置直接变为最底部的问题，因此需要通过代码强制滚动回加载更多前的位置
					// #ifdef MP-WEIXIN
					if (!this.isIos && !this.isOnly && !this.usePageScroll && newVal.length) {
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
			this.privateConcat = true;
		},
		// 根据pageNo处理refresh操作
		_handleRefreshWithDisPageNo(pageNo) {
			if (!this.isHandlingRefreshToPage && !this.realTotalData.length) return this.reload();
			if (pageNo >= 1) {
				this.loading = true;
				this.privateConcat = false;
				const totalPageSize = pageNo * this.pageSize;
				this.currentRefreshPageSize = totalPageSize;
				// 如果调用refresh时是本地分页，则在组件内部自己处理分页逻辑，不emit query相关事件
				if (this.isLocalPaging && this.isHandlingRefreshToPage) {
					this._localPagingQueryList(this.defaultPageNo, totalPageSize, 0, res => {
						this.complete(res);
					})
				} else {
					// emit query相关事件
					this._emitQuery(this.defaultPageNo, totalPageSize, Enum.QueryFrom.Refresh);
					this._callMyParentQuery(this.defaultPageNo, totalPageSize);
				}
			}
			return new Promise((resolve, reject) => {
				this.dataPromiseResultMap.reload = { resolve, reject };
			});
		},
		// 本地分页请求
		_localPagingQueryList(pageNo, pageSize, localPagingLoadingTime, callback) {
			pageNo = Math.max(1, pageNo);
			pageSize = Math.max(1, pageSize);
			const totalPagingList = [...this.totalLocalPagingList];
			const pageNoIndex = (pageNo - 1) * pageSize;
			const finalPageNoIndex = Math.min(totalPagingList.length, pageNoIndex + pageSize);
			const resultPagingList = totalPagingList.splice(pageNoIndex, finalPageNoIndex - pageNoIndex);
			u.delay(() => callback(resultPagingList), localPagingLoadingTime)
		},
		// 从顶部添加数据，不会影响分页的pageNo和pageSize
		_addDataFromTop(data, toTop = true, toTopWithAnimate = true) {
			// 数据是否拼接到顶部，如果是聊天记录模式并且列表没有倒置，则应该拼接在底部
			let addFromTop = !this.isChatRecordModeAndNotInversion;
			data = Object.prototype.toString.call(data) !== '[object Array]' ? [data] : (addFromTop ? data.reverse() : data);
			// #ifndef APP-NVUE
			this.finalUseVirtualList && this._setCellIndex(data, 'top')
			// #endif
			
			this.totalData = addFromTop ? [...data, ...this.totalData] : [...this.totalData, ...data];
			if (toTop) {
				u.delay(() => this.useChatRecordMode ? this.scrollToBottom(toTopWithAnimate) : this.scrollToTop(toTopWithAnimate));
			}
		},
		// 存储列表缓存数据
		_saveLocalCache(data) {
			uni.setStorageSync(this.finalCacheKey, data);
		},
		// 通过缓存数据填充列表数据
		_setListByLocalCache() {
			this.totalData = uni.getStorageSync(this.finalCacheKey) || [];
			this.isSettingCacheList = true;
		},
		// 修改父view的list
		_callMyParentList(newVal) {
			if (this.autowireListName.length) {
				const myParent = u.getParent(this.$parent);
				if (myParent && myParent[this.autowireListName]) {
					myParent[this.autowireListName] = newVal;
				}
			}
		},
		// 调用父view的query
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
		// emit query事件
		_emitQuery(pageNo, pageSize, from){
			this.queryFrom = from;
			this.requestTimeStamp = u.getTime();
			const [lastItem] = this.realTotalData.slice(-1);
			if (this.fetch) {
				const fetchParams = interceptor._handleFetchParams({pageNo, pageSize, from, lastItem: lastItem || null}, this.fetchParams);
				const fetchResult = this.fetch(fetchParams);
				if (!interceptor._handleFetchResult(fetchResult, this, fetchParams)) {
					u.isPromise(fetchResult) ? fetchResult.then(res => {
						this.complete(res);
					}).catch(err => {
						this.complete(false);
					}) : this.complete(fetchResult)
				}
			} else {
				this.$emit('query', ...interceptor._handleQuery(pageNo, pageSize, from, lastItem || null));
			}
		},
		// 触发数据改变promise
		_callDataPromise(success, totalList) {
			for (const key in this.dataPromiseResultMap) {
				const obj = this.dataPromiseResultMap[key];
				if (!obj) continue;
				success ? obj.resolve({ totalList, noMore: this.loadingStatus === Enum.More.NoMore }) : this.callNetworkReject && obj.reject(`z-paging-${key}-error`);
			}
		},
		// 检查complete data的类型
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
