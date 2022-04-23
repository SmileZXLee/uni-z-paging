// [z-paging]数据处理模块
import u from '.././z-paging-utils'
import c from '.././z-paging-constant'
import Enum from '.././z-paging-enum'

const ZPData = {
	props: {
		//自定义初始的pageNo，默认为1
		defaultPageNo: {
			type: [Number, String],
			default: u.gc('defaultPageNo', 1),
			observer: function(newVal, oldVal) {
				this.pageNo = newVal;
			},
		},
		//自定义pageSize，默认为10
		defaultPageSize: {
			type: [Number, String],
			default: u.gc('defaultPageSize', 10),
		},
		//为保证数据一致，设置当前tab切换时的标识key，并在complete中传递相同key，若二者不一致，则complete将不会生效
		dataKey: {
			type: [Number, String, Object],
			default: function() {
				return u.gc('dataKey', null);
			},
		},
		//自动注入的list名，可自动修改父view(包含ref="paging")中对应name的list值
		autowireListName: {
			type: String,
			default: function() {
				return u.gc('autowireListName', '');
			},
		},
		//自动注入的query名，可自动调用父view(包含ref="paging")中的query方法
		autowireQueryName: {
			type: String,
			default: function() {
				return u.gc('autowireQueryName', '');
			},
		},
		//z-paging mounted后自动调用reload方法(mounted后自动调用接口)，默认为是。请使用简便写法：auto
		mountedAutoCallReload: {
			type: Boolean,
			default: u.gc('mountedAutoCallReload', true)
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
		//当分页未满一屏时，是否自动加载更多，默认为否(nvue无效)
		insideMore: {
			type: Boolean,
			default: u.gc('insideMore', false)
		},
		//使用聊天记录模式，默认为否
		useChatRecordMode: {
			type: Boolean,
			default: u.gc('useChatRecordMode', false)
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
			pageNo: 1,
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
		}
	},
	computed: {
		pageSize() {
			return this.defaultPageSize;
		},
		finalConcat() {
			return this.concat && this.privateConcat;
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
	},
	methods: {
		//请求结束(成功或者失败)调用此方法，将请求的结果传递给z-paging处理，第一个参数为请求结果数组，第二个参数为是否成功(默认是是）
		complete(data, success = true) {
			this.customNoMore = -1;
			this.addData(data, success);
		},
		//简写，与complete完全相同
		end(data, success = true) {
			this.complete(data, success);
		},
		//【保证数据一致】请求结束(成功或者失败)调用此方法，将请求的结果传递给z-paging处理，第一个参数为请求结果数组，第二个参数为dataKey，需与:data-key绑定的一致，第三个参数为是否成功(默认为是）
		completeByKey(data, dataKey = null, success = true) {
			if (dataKey !== null && this.dataKey !== null && dataKey !== this.dataKey) {
				if (this.isFirstPage) {
					this.endRefresh();
				}
				return;
			}
			this.customNoMore = -1;
			this.addData(data, success);
		},
		//简写，与completeByKey完全相同
		endByKey(data, dataKey = null, success = true) {
			this.completeByKey(data, dataKey, success);
		},
		//【通过totalCount判断是否有更多数据】请求结束(成功或者失败)调用此方法，将请求的结果传递给z-paging处理，第一个参数为请求结果数组，第二个参数为totalCount(列表总数)，第三个参数为是否成功(默认为是）
		completeByTotalCount(data, totalCount, success = true) {
			if (totalCount == 'undefined') {
				this.customNoMore = -1;
			} else {
				let dataTypeRes = this._checkDataType(data, success, false);
				data = dataTypeRes.data;
				success = dataTypeRes.success;
				if (totalCount >= 0 && success) {
					this.$nextTick(() => {
						let nomore = true;
						let realTotalDataCount = this.realTotalData.length;
						if (this.pageNo == this.defaultPageNo) {
							realTotalDataCount = 0;
						}
						let exceedCount = realTotalDataCount + data.length - totalCount;
						if (exceedCount >= 0) {
							nomore = false;
							exceedCount = this.defaultPageSize - exceedCount;
							if (exceedCount > 0 && exceedCount < data.length) {
								data = data.splice(0, exceedCount);
							}
						}
						this.completeByNoMore(data, nomore, success);
					})
					return;
				}
			}
			this.addData(data, success);
		},
		//简写，与completeByTotalCount完全相同
		completeByTotal(data, totalCount, success = true) {
			this.completeByTotalCount(data, totalCount, success);
		},
		//简写，与completeByTotalCount完全相同
		endByTotalCount(data, totalCount, success = true) {
			this.completeByTotalCount(data, totalCount, success);
		},
		//简写，与completeByTotalCount完全相同
		endByTotal(data, totalCount, success = true) {
			this.completeByTotalCount(data, totalCount, success);
		},
		//【自行判断是否有更多数据】请求结束(成功或者失败)调用此方法，将请求的结果传递给z-paging处理，第一个参数为请求结果数组，第二个参数为是否有更多数据，第三个参数为是否成功(默认是是）
		completeByNoMore(data, nomore, success = true) {
			if (nomore != 'undefined') {
				this.customNoMore = nomore == true ? 1 : 0;
			}
			this.addData(data, success);
		},
		//简写，与completeByNoMore完全相同
		endByNoMore(data, nomore, success = true) {
			this.completeByNoMore(data, nomore, success);
		},
		//与上方complete方法功能一致，新版本中设置服务端回调数组请使用complete方法
		addData(data, success = true) {
			if (!this.fromCompleteEmit) {
				this.disabledCompleteEmit = true;
				this.fromCompleteEmit = false;
			}
			const currentTimeStamp = u.getTime();
			let addDataDalay = 0;
			const disTime = currentTimeStamp - this.requestTimeStamp;
			let minDelay = this.minDelay;
			if(this.isFirstPage && this.finalShowRefresherWhenReload){
				minDelay = Math.max(400,minDelay);
			}
			if(this.requestTimeStamp > 0 && disTime < minDelay){
				addDataDalay = minDelay - disTime;
			}
			this.$nextTick(() => {
				let delay = this.delay > 0 ? this.delay : addDataDalay;
				setTimeout(() => {
					this._addData(data, success, false);
				}, delay)
			})
		},
		//从顶部添加数据，不会影响分页的pageNo和pageSize
		addDataFromTop(data, toTop = true, toTopWithAnimate = true) {
			let dataType = Object.prototype.toString.call(data);
			if (dataType !== '[object Array]') {
				data = [data];
			}
			this.totalData = [...data, ...this.totalData];
			if (toTop) {
				setTimeout(() => {
					this._scrollToTop(toTopWithAnimate);
				}, c.delayTime)
			}
		},
		//重新设置列表数据，调用此方法不会影响pageNo和pageSize，也不会触发请求。适用场景：当需要删除列表中某一项时，将删除对应项后的数组通过此方法传递给z-paging。(当出现类似的需要修改列表数组的场景时，请使用此方法，请勿直接修改page中:list.sync绑定的数组)
		resetTotalData(data) {
			if (data == undefined) {
				if (this.showConsoleError) {
					u.consoleErr('方法resetTotalData参数缺失！');
				}
				return;
			}
			this.isTotalChangeFromAddData = true;
			let dataType = Object.prototype.toString.call(data);
			if (dataType !== '[object Array]') {
				data = [data];
			}
			this.totalData = data;
		},
		//添加聊天记录
		addChatRecordData(data, toBottom = true, toBottomWithAnimate = true) {
			let dataType = Object.prototype.toString.call(data);
			if (dataType !== '[object Array]') {
				data = [data];
			}
			if (!this.useChatRecordMode) return;
			this.isTotalChangeFromAddData = true;
			//#ifndef APP-NVUE
			this.totalData = [...this.totalData, ...data];
			//#endif
			//#ifdef APP-NVUE
			this.totalData = this.nIsFirstPageAndNoMore ? [...this.totalData, ...data] : [...data, ...this.totalData];
			//#endif
			if (toBottom) {
				setTimeout(() => {
					//#ifndef APP-NVUE
					this._scrollToBottom(toBottomWithAnimate);
					//#endif
					//#ifdef APP-NVUE
					if (this.nIsFirstPageAndNoMore) {
						this._scrollToBottom(toBottomWithAnimate);
					} else {
						this._scrollToTop(toBottomWithAnimate);
					}
					//#endif
				}, c.delayTime)
			}
		},
		//设置本地分页数据，请求结束(成功或者失败)调用此方法，将请求的结果传递给z-paging作分页处理（若调用了此方法，则上拉加载更多时内部会自动分页，不会触发@query所绑定的事件）
		setLocalPaging(data, success = true) {
			this.isLocalPaging = true;
			this.$nextTick(() => {
				this._addData(data, success, true);
			})
		},
		//重新加载分页数据，pageNo会恢复为默认值，相当于下拉刷新的效果(animate为true时会展示下拉刷新动画，默认为false)
		reload(animate = this.showRefresherWhenReload) {
			if (animate) {
				this.privateShowRefresherWhenReload = animate;
				this.isUserPullDown = true;
			}
			this._preReload(animate, false);
		},
		//刷新列表数据，pageNo和pageSize不会重置，列表数据会重新从服务端获取。必须保证@query绑定的方法中的pageNo和pageSize和传给服务端的一致
		refresh() {
			if(!this.realTotalData.length){
				this.reload();
				return;
			}
			const disPageNo = this.pageNo - this.defaultPageNo + 1;
			if (disPageNo >= 1) {
				this.loading = true;
				this.privateConcat = false;
				const totalPageSize = disPageNo * this.pageSize;
				this._emitQuery(this.defaultPageNo, totalPageSize, Enum.QueryFrom.Refresh);
				this._callMyParentQuery(this.defaultPageNo, totalPageSize);
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
			this.loadingType = Enum.LoadingType.Refresher
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
				this.refresherRevealStackCount++;
				setTimeout(() => {
					this._getNodeClientRect('zp-n-refresh-container', false).then((node) => {
						if (node) {
							let nodeHeight = node[0].height;
							this.nShowRefresherReveal = true;
							this.nShowRefresherRevealHeight = nodeHeight;
							setTimeout(() => {
								this._nDoRefresherEndAnimation(0, -nodeHeight, false, false);
								setTimeout(() => {
									this._nDoRefresherEndAnimation(nodeHeight, 0);
								}, 10)
							}, 10)
						}
						this._reload(false, isFromMounted);
						this._doRefresherLoad(false);
					});
				}, 10)
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
			this.cacheScrollNodeHeight = -1;
			this.insideOfPaging = -1;
			this.pageNo = this.defaultPageNo;
			this._cleanRefresherEndTimeout();
			!this.privateShowRefresherWhenReload && !isClean && this._startLoading(true);
			this.firstPageLoaded = true;
			this.isTotalChangeFromAddData = false;
			this.totalData = [];
			if (!isClean) {
				this._emitQuery(this.pageNo, this.defaultPageSize, isUserPullDown ? Enum.QueryFrom.UserPullDown : Enum.QueryFrom.Reload);
				let delay = 0;
				// #ifdef MP-TOUTIAO
				delay = 5;
				// #endif
				setTimeout(() => {
					this._callMyParentQuery();
				}, delay)
				if (!isFromMounted && this.autoScrollToTopWhenReload) {
					let checkedNRefresherLoading = true;
					// #ifdef APP-NVUE
					checkedNRefresherLoading = !this.nRefresherLoading;
					// #endif
					if (checkedNRefresherLoading) {
						this._scrollToTop(false);
					}
				}
				// #ifndef APP-NVUE
				if (!this.usePageScroll && this.useChatRecordMode) {
					if (this.showConsoleError) {
						u.consoleWarn('使用聊天记录模式时，建议使用页面滚动，可将usePageScroll设置为true以启用页面滚动！！');
					}
				}
				// #endif
			}
			this.$nextTick(() => {
				// #ifdef APP-NVUE
				this.nShowBottom = this.realTotalData.length > 0;
				// #endif
			})
		},
		//处理服务端返回的数组
		_addData(data, success, isLocal) {
			this.isAddedData = true;
			this.fromEmptyViewReload = false;
			this.isTotalChangeFromAddData = true;
			this.refresherTriggered = false;
			!this.useCustomRefresher && uni.stopPullDownRefresh();
			// #ifdef APP-NVUE
			this.usePageScroll && uni.stopPullDownRefresh();
			// #endif
			const tempIsUserPullDown = this.isUserPullDown;
			if (this.showRefresherUpdateTime && this.isFirstPage) {
				u.setRefesrherTime(u.getTime(), this.refresherUpdateTimeKey);
				this.tempLanguageUpdateKey = u.getTime();
				this.$refs.refresh && this.$refs.refresh.updateTime();
			}
			if (tempIsUserPullDown && this.isFirstPage) {
				this.isUserPullDown = false;
			}
			let dataTypeRes = this._checkDataType(data, success, isLocal);
			data = dataTypeRes.data;
			success = dataTypeRes.success;
			let delayTime = c.delayTime;
			let shouldEndLoadingDelay = true;
			// #ifdef APP-NVUE
			if (this.useChatRecordMode) {
				delayTime = 0
			}
			shouldEndLoadingDelay = false;
			// #endif
			this.loadingForNow = false;
			setTimeout(() => {
				this.pagingLoaded = true;
				this.$nextTick(()=>{
					this._refresherEnd(shouldEndLoadingDelay, true, tempIsUserPullDown);
				})
			}, delayTime)
			if (this.isFirstPage) {
				this.isLoadFailed = !success;
			}
			if (success) {
				if (!(this.privateConcat === false && this.loadingStatus === Enum.More.NoMore)) {
					this.loadingStatus = Enum.More.Default;
				}
				if (isLocal) {
					this.totalLocalPagingList = data;
					this._localPagingQueryList(this.defaultPageNo, this.defaultPageSize, 0, (res) => {
						this.complete(res);
					})
				} else {
					let dataChangeDelayTime = 0;
					// #ifdef APP-NVUE
					if (this.privateShowRefresherWhenReload && this.finalNvueListIs === 'waterfall') {
						dataChangeDelayTime = 150;
					}
					// #endif
					setTimeout(() => {
						this._currentDataChange(data, this.currentData);					
					}, dataChangeDelayTime)
				}
			} else {
				this._currentDataChange(data, this.currentData);
				this.loadingStatus = Enum.More.Fail;
				if (this.loadingType === Enum.LoadingType.LoadingMore) {
					this.pageNo--;
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
				setTimeout(()=>{
					this._getNodeClientRect('.zp-paging-container-content').then((res) => {
						if (res) {
							this.$emit('contentHeightChanged', res[0].height);
						}
					});
				},this.isIos?100:300)
				// #ifdef APP-NVUE
				if (this.useChatRecordMode && this.nIsFirstPageAndNoMore && this.isFirstPage && !this.nFirstPageAndNoMoreChecked) {
					this.nFirstPageAndNoMoreChecked = true;
					this._scrollToBottom(false);
				}
				// #endif
			})
		},
		//当前数据改变时调用
		_currentDataChange(newVal, oldVal) {
			newVal = [...newVal];
			// #ifndef APP-NVUE
			this.useChatRecordMode && newVal.reverse();
			// #endif
			if (this.isFirstPage && this.finalConcat) {
				this.totalData = [];
			}
			if (this.customNoMore !== -1) {
				if (this.customNoMore === 0 || !newVal.length) {
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
					if(this.useChatRecordMode && this.isFirstPage && this.loadingStatus === Enum.More.NoMore){
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
						let delayTime = 200;
						this.$emit('update:chatIndex', idIndex);
						setTimeout(() => {
							this._scrollIntoView(idIndexStr, 30 + this.cacheTopHeight, false, () => {
								this.$emit('update:chatIndex', 0);
							});
						}, this.usePageScroll ? 0 : delayTime)
					} else {
						this.$nextTick(() => {
							this._scrollToBottom(false);
						})
					}
					//#endif
		
				} else {
					if (this.finalConcat) {
						this.totalData = [...this.totalData, ...newVal];
						// #ifdef MP-WEIXIN
						if (!this.isIos && !this.refresherOnly && !this.usePageScroll && newVal.length) {
							this.loadingMoreTimeStamp = u.getTime();
							const currentScrollTop = this.oldScrollTop;
							this.scrollToY(currentScrollTop);
						}
						// #endif
					} else {
						this.totalData = [...newVal];
					}
				}
			}
			this.privateConcat = true;
		},
		//本地分页请求
		_localPagingQueryList(pageNo, pageSize, localPagingLoadingTime, callback) {
			pageNo = parseInt(pageNo);
			pageSize = parseInt(pageSize);
			if (pageNo < 0 || pageSize <= 0) {
				callQueryResult(callback, []);
				return;
			}
			pageNo = Math.max(1,pageNo);
			let totalPagingList = [...this.totalLocalPagingList];
			let pageNoIndex = (pageNo - 1) * pageSize;
			if (pageNoIndex + pageSize <= totalPagingList.length) {
				this._localPagingQueryResult(callback, totalPagingList.splice(pageNoIndex, pageSize), localPagingLoadingTime);
			} else if (pageNoIndex < totalPagingList.length) {
				this._localPagingQueryResult(callback, totalPagingList.splice(pageNoIndex, totalPagingList.length - pageNoIndex), localPagingLoadingTime);
			} else {
				this._localPagingQueryResult(callback, [], localPagingLoadingTime);
			}
		},
		//本地分页请求回调
		_localPagingQueryResult(callback, arg, localPagingLoadingTime) {
			setTimeout(() => {
				callback(arg);
			}, localPagingLoadingTime)
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
					if (customPageSize > 0) {
						this.myParentQuery(customPageNo, customPageSize);
					} else {
						this.myParentQuery(this.pageNo, this.defaultPageSize);
					}
				}
			}
		},
		//发射query事件
		_emitQuery(pageNo,pageSize,from){
			this.requestTimeStamp = u.getTime();
			this.$emit('query',pageNo,pageSize,from);
		},
		//检查complete data的类型
		_checkDataType(data, success, isLocal) {
			const dataType = Object.prototype.toString.call(data);
			if (dataType === '[object Boolean]') {
				success = data;
				data = [];
			} else if (dataType !== '[object Array]') {
				data = [];
				let methodStr = isLocal ? 'setLocalPaging' : 'complete';
				if (dataType !== '[object Undefined]') {
					if (this.showConsoleError) {
						u.consoleErr(`${methodStr}参数类型不正确，第一个参数类型必须为Array!`);
					}
				}
			}
			return {data,success};
		},
	}
}

export default ZPData;
