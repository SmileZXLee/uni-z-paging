 <!--                        _             
  ____     _ __   __ _  __ _(_)_ __   __ _ 
 |_  /____| '_ \ / _` |/ _` | | '_ \ / _` |
  / /_____| |_) | (_| | (_| | | | | | (_| |
 /___|    | .__/ \__,_|\__, |_|_| |_|\__, |
          |_|          |___/         |___/ 
V1.5.8
-- >
<!-- github地址:https://github.com/SmileZXLee/uni-z-paging -->
<!-- dcloud地址:https://ext.dcloud.net.cn/plugin?id=3935 -->
<!-- 获取文档和示例请访问上方dcloud地址 -->
<!-- 反馈QQ群：790460711 -->
<template name="z-paging">
	<!-- #ifndef APP-NVUE -->
	<view :class="!usePageScroll&&fixed?'z-paging-content z-paging-content-fixed':'z-paging-content'"
		:style="[finalPagingStyle]">
		<!-- 顶部固定的slot -->
		<slot v-if="!usePageScroll&&$slots.top" name="top"></slot>
		<view class="zp-page-scroll-top" v-else-if="usePageScroll&&$slots.top" :style="[{'top': `${windowTop}px`}]">
			<slot name="top"></slot>
		</view>
		<scroll-view 
			:class="!usePageScroll&&$slots.top?'zp-scroll-view zp-scroll-view-flex1 zp-scroll-view-fix-height':usePageScroll?'zp-scroll-view':'zp-scroll-view zp-scroll-view-flex1'" 
			:style="[scrollViewStyle]" :scroll-top="scrollTop"
			:scroll-y="!usePageScroll&&scrollEnable" :enable-back-to-top="enableBackToTop"
			:show-scrollbar="showScrollbar" :scroll-with-animation="finalScrollWithAnimation"
			:scroll-into-view="scrollIntoView" :lower-threshold="lowerThreshold"
			:refresher-enabled="finalRefresherEnabled&&!useCustomRefresher" :refresher-threshold="refresherThreshold"
			:refresher-default-style="finalRefresherDefaultStyle" :refresher-background="refresherBackground"
			:refresher-triggered="refresherTriggered" @scroll="_scroll" @scrolltolower="_onLoadingMore('toBottom')"
			@scrolltoupper="_scrollToUpper" @refresherrestore="_onRestore" @refresherrefresh="_onRefresh"  
			<!-- #ifndef APP-VUE || MP-WEIXIN || MP-QQ  || H5 -->
			@touchstart="_refresherTouchstart" @touchmove="_refresherTouchmove" @touchend="_refresherTouchend" @touchcancel="_refresherTouchend"
			<!-- #endif -->
			<!-- #ifdef APP-VUE || MP-WEIXIN || MP-QQ || H5 -->
			@touchstart="paging.touchstart" @touchmove="paging.touchmove" @touchend="paging.touchend" @touchcancel="paging.touchend"
			<!-- #endif -->
			>	
			<view class="zp-paging-main" :style="[{'transform': refresherTransform,'transition': refresherTransition}]"
			<!-- #ifdef APP-VUE || MP-WEIXIN || MP-QQ || H5 -->
			:change:prop="paging.propObserver" :prop="wxsPropType"
			:data-refresherThreshold="refresherThreshold" :data-wxsIsScrollTopInTopRange="wxsIsScrollTopInTopRange"
			:data-loading="loading" :data-useChatRecordMode="useChatRecordMode" 
			:data-refresherEnabled="refresherEnabled" :data-useCustomRefresher="useCustomRefresher" :data-pageScrollTop="pageScrollTop"
			:data-scrollTop="scrollTop" :data-refresherMaxAngle="refresherMaxAngle" :data-refresherAecc="refresherAngleEnableChangeContinued"
			:data-isTouchmoving="isTouchmoving" :data-usePageScroll="usePageScroll"
			<!-- #endif -->
			>	
				<view v-if="finalRefresherEnabled&&useCustomRefresher&&isTouchmoving" class="custom-refresher-view"
					:style="[{'margin-top': `-${refresherThreshold}px`,'background-color': refresherBackground}]">
					<view :style="[{'height': `${refresherThreshold}px`,'background-color': refresherBackground}]">
						<!-- 下拉刷新view -->
						<slot 
						<!-- #ifdef MP-WEIXIN || MP-QQ || MP-TOUTIAO || MP-BAIDU  -->
						v-if="zScopedSlots.refresher"
						<!-- #endif -->
						<!-- #ifndef MP-WEIXIN || MP-QQ || MP-TOUTIAO || MP-BAIDU -->
						v-if="$scopedSlots.refresher"
						<!-- #endif -->
						<!-- #ifndef MP-QQ -->
						:refresherStatus="refresherStatus"
						<!-- #endif -->
						name="refresher" />
						<z-paging-refresh  v-else :style="[{'height': `${refresherThreshold}px`}]" :refresherStatus="refresherStatus"
							:defaultThemeStyle="defaultThemeStyle" :refresherDefaultText="refresherDefaultText"
							:refresherPullingText="refresherPullingText"
							:refresherRefreshingText="refresherRefreshingText"></z-paging-refresh>
					</view>
				</view>
				<view class="zp-paging-container">
					<slot v-if="useChatRecordMode&&$slots.chatLoading&&loadingStatus!==2&&realTotalData.length"
						name="chatLoading" />
					<view v-else-if="useChatRecordMode&&loadingStatus!==2&&realTotalData.length"
						class="zp-chat-record-loading-container">
						<text v-if="loadingStatus!==1" @click="_scrollToUpper()"
							:class="defaultThemeStyle==='white'?'zp-loading-more-text zp-loading-more-text-white':'zp-loading-more-text zp-loading-more-text-black'">{{chatRecordLoadingMoreText}}</text>
						<image v-else :src="base64Flower" class="zp-chat-record-loading-custom-image">
						</image>
					</view>
					<slot v-if="$slots.loading&&!firstPageLoaded&&(autoHideLoadingAfterFirstLoaded?!pagingLoaded:true)&&loading" name="loading" />
					<!-- 空数据图 -->
					<view class="zp-empty-view"
						v-if="!totalData.length&&(autoHideEmptyViewWhenLoading?isAddedData:true)&&!hideEmptyView&&(autoHideEmptyViewWhenLoading?(!firstPageLoaded&&!loading):true)">
						<slot v-if="$slots.empty" name="empty" />
						<z-paging-empty-view v-else :emptyViewImg="emptyViewImg" :emptyViewText="emptyViewText">
						</z-paging-empty-view>
					</view>
					<!-- 主体内容 -->
					<view class="zp-paging-container-content" :style="[pagingContentStyle]">
						<slot />
					</view>
					<!-- 上拉加载更多view -->
					<!-- #ifndef MP-ALIPAY -->
					<slot v-if="_shouldShowLoading('loadingMoreDefault')" name="loadingMoreDefault" />
					<slot v-else-if="_shouldShowLoading('loadingMoreLoading')" name="loadingMoreLoading" />
					<slot v-else-if="_shouldShowLoading('loadingMoreNoMore')" name="loadingMoreNoMore" />
					<slot v-else-if="_shouldShowLoading('loadingMoreFail')" name="loadingMoreFail" />
					<z-paging-load-more @click.native="_onLoadingMore('click')"
						v-else-if="_shouldShowLoading('loadingMoreCustom')" :config="zPagingLoadMoreConfig">
					</z-paging-load-more>
					<!-- #endif -->
					<!-- #ifdef MP-ALIPAY -->
					<slot v-if="loadingStatus===0&&$slots.loadingMoreDefault&&showLoadingMore&&loadingMoreEnabled&&!useChatRecordMode"
						name="loadingMoreDefault" />
					<slot v-else-if="loadingStatus===1&&$slots.loadingMoreLoading&&showLoadingMore&&loadingMoreEnabled"
						name="loadingMoreLoading" />
					<slot v-else-if="loadingStatus===2&&$slots.loadingMoreNoMore&&showLoadingMore&&showLoadingMoreNoMoreView&&loadingMoreEnabled&&!useChatRecordMode"
						name="loadingMoreNoMore" />
					<slot v-else-if="loadingStatus===3&&$slots.loadingMoreFail&&showLoadingMore&&loadingMoreEnabled&&!useChatRecordMode"
						name="loadingMoreFail" />
					<z-paging-load-more @click.native="_onLoadingMore('click')" v-else-if="showLoadingMore&&showDefaultLoadingMoreText&&!(loadingStatus===2&&!showLoadingMoreNoMoreView)&&loadingMoreEnabled&&!useChatRecordMode" :config="zPagingLoadMoreConfig">
					</z-paging-load-more>
					<!-- #endif -->
				</view>
			</view>
		</scroll-view>
		<view v-if="showBackToTopClass" :class="backToTopClass" :style="[backToTopStyle]" @click.stop="scrollToTop(backToTopWithAnimate)">
			<image class="zp-back-to-top-img" :src="backToTopImg.length?backToTopImg:base64BackToTop"></image>
		</view>  
	</view>
	<!-- #endif -->
	<!-- #ifdef APP-NVUE -->
	<view ref="n-list" class="zp-n-list" :is="finalNvueListIs" alwaysScrollableVertical="true"
		:fixFreezing="nFixFreezing" :show-scrollbar="showScrollbar" :loadmoreoffset="lowerThreshold"
		:scrollable="scrollEnable" :column-count="nWaterfallColumnCount" :column-width="nWaterfallColumnWidth"
		:column-gap="nWaterfallColumnGap" :left-gap="nWaterfallLeftGap" :right-gap="nWaterfallRightGap"
		@loadmore="_onLoadingMore('toBottom')" @scroll="_nOnScroll">
		<refresh class="zp-n-refresh" v-if="refresherEnabled" :display="nRefresherLoading?'show':'hide'" @refresh="_nOnRrefresh"
			@pullingdown="_nOnPullingdown">
			<view class="zp-n-refresh-container">
				<!-- 下拉刷新view -->
				<slot v-if="zScopedSlots.refresher" :refresherStatus="refresherStatus" name="refresher" />
				<z-paging-refresh v-else :refresherStatus="refresherStatus" :defaultThemeStyle="defaultThemeStyle"
					:refresherDefaultText="refresherDefaultText" :refresherPullingText="refresherPullingText"
					:refresherRefreshingText="refresherRefreshingText"></z-paging-refresh>
			</view>
		</refresh>
		<slot />
		<view :is="finalNvueListIs==='waterfall'?'header':'cell'">
			<slot v-if="useChatRecordMode&&$slots.chatLoading&&loadingStatus!==2&&realTotalData.length"
				name="chatLoading" />
			<view v-else-if="useChatRecordMode&&loadingStatus!==2&&realTotalData.length"
				class="zp-chat-record-loading-container">
				<text v-if="loadingStatus!==1" @click="_scrollToUpper()"
					:class="defaultThemeStyle==='white'?'zp-loading-more-text zp-loading-more-text-white':'zp-loading-more-text zp-loading-more-text-black'">{{chatRecordLoadingMoreText}}</text>
				<image v-else :src="base64Flower" class="zp-chat-record-loading-custom-image">
				</image>
			</view>
			<slot v-if="$slots.loading&&!firstPageLoaded&&(autoHideLoadingAfterFirstLoaded?!pagingLoaded:true)&&loading" name="loading" />
			<!-- 空数据图 -->
			<view class="zp-empty-view"
				v-if="!totalData.length&&(autoHideEmptyViewWhenLoading?isAddedData:true)&&!hideEmptyView&&(autoHideEmptyViewWhenLoading?(!firstPageLoaded&&!loading):true)">
				<slot v-if="$slots.empty" name="empty" />
				<z-paging-empty-view v-else :emptyViewImg="emptyViewImg" :emptyViewText="emptyViewText">
				</z-paging-empty-view>
			</view>
			<templete v-if="nShowBottom">
				<!-- 上拉加载更多view -->
				<slot v-if="_shouldShowLoading('loadingMoreDefault')" name="loadingMoreDefault" />
				<slot v-else-if="_shouldShowLoading('loadingMoreLoading')" name="loadingMoreLoading" />
				<slot v-else-if="_shouldShowLoading('loadingMoreNoMore')" name="loadingMoreNoMore" />
				<slot v-else-if="_shouldShowLoading('loadingMoreFail')" name="loadingMoreFail" />
				<z-paging-load-more @click.native="_onLoadingMore('click')"
					v-else-if="_shouldShowLoading('loadingMoreCustom')" :config="zPagingLoadMoreConfig">
				</z-paging-load-more>
			</templete>
		</view>
	</view>
	<!-- #endif -->
</template>
<script
    src="./z-paging-refresh.wxs"
    module="paging"
    lang="wxs"
></script>
<script>
	import zStatic from './z-paging-static'
	import zPagingRefresh from './z-paging-refresh'
	import zPagingLoadMore from './z-paging-load-more'
	import zPagingEmptyView from '../z-paging-empty-view/z-paging-empty-view'
	import main from '@/main.js'
	
	const systemInfo = uni.getSystemInfoSync();
	const commonDelayTime = 100;
	const config = main['z-paging-config'];
	
	//获取默认配置信息
	function _getConfig(key, defaultValue) {
		if (!config){
			return defaultValue;
		}
		let value = config[toKebab(key)];
		if (value === undefined) {
			value = config[key];
		}
		if (value !== undefined) {
			return value;
		}
		return defaultValue;
	}
	//驼峰转短横线
	function toKebab(value) {
	  return value.replace(/([A-Z])/g,"-$1").toLowerCase();
	}
	
	/**
	 * z-paging 分页组件
	 * @description 【uni-app自动分页器】超简单，低耦合！仅需两步轻松完成完整分页逻辑(下拉刷新、上拉加载更多)，分页全自动处理。支持自定义加载更多的文字或整个view，自定义下拉刷新样式，自动管理空数据view等。
	 * @tutorial https://github.com/SmileZXLee/uni-z-paging
	 * @property {Number|String} default-page-no 自定义pageNo，默认为1
	 * @property {Number|String} default-page-size 自定义pageSize，默认为10
	 * @property {Object} paging-style 设置z-paging的style，部分平台可能无法直接修改组件的style，可使用此属性代替
	 * @property {Object} paging-content-style 设置z-paging的容器(插槽的父view)的style
	 * @property {Boolean} auto-height z-paging是否自动高度，若自动高度则会自动铺满屏幕，默认为否
	 * @property {String} auto-height-addition z-paging是否自动高度时，附加的高度，注意添加单位px或rpx，默认为px，若需要减少高度，请传负数
	 * @property {String} default-theme-style loading(下拉刷新、上拉加载更多)的主题样式，支持black，white，默认black
	 * @property {Boolean} use-page-scroll 使用页面滚动，默认为否，当设置为是时则使用页面的滚动而非此组件内部的scroll-view的滚动，使用页面滚动时z-paging无需设置确定的高度且对于长列表展示性能更高，但配置会略微繁琐
	 * @property {Boolean} fixed z-paging是否使用fixed布局，若使用fixed布局，则z-paging的父view无需固定高度，z-paging高度默认为100%，默认为否(当使用内置scroll-view滚动时有效)
	 * @property {Boolean} mounted-auto-call-reload z-paging mounted后自动调用reload方法(mounted后自动调用接口)，默认为是
	 * @property {Boolean} auto-scroll-to-top-when-reload reload时自动滚动到顶部，默认为是
	 * @property {Boolean} auto-clean-list-when-reload reload时立即自动清空原list，默认为是，若立即自动清空，则在reload之后、请求回调之前页面是空白的
	 * @property {Boolean} show-refresher-when-reload 调用reload方法时自动显示下拉刷新view，默认为否
	 * @property {Boolean} use-custom-refresher 是否使用自定义的下拉刷新，默认为是，即使用z-paging的下拉刷新。设置为false即代表使用uni scroll-view自带的下拉刷新，h5、App、微信小程序以外的平台不支持uni scroll-view自带的下拉刷新
	 * @property {Number|String} refresher-fps 自定义下拉刷新下拉帧率，默认为40，过高可能会出现抖动问题(use-custom-refresher为true时生效)
	 * @property {Number|String} refresher-max-angle 自定义下拉刷新允许触发的最大下拉角度，默认为40度，当下拉角度小于设定值时，自定义下拉刷新动画不会被触发
	 * @property {Boolean} refresher-angle-enable-change-continued 自定义下拉刷新的角度由未达到最大角度变到达到最大角度时，是否继续下拉刷新手势，默认为否
	 * @property {String} refresher-default-text 自定义下拉刷新默认状态下的文字(use-custom-refresher为true时生效)
	 * @property {String} refresher-pulling-text 自定义下拉刷新松手立即刷新状态下的文字(use-custom-refresher为true时生效)
	 * @property {String} refresher-refreshing-text 自定义下拉刷新刷新中状态下的文字(use-custom-refresher为true时生效)
	 * @property {Boolean} refresher-end-bounce-enabled 是否开启自定义下拉刷新刷新结束回弹效果，默认为是(use-custom-refresher为true时生效)
	 * @property {String} loading-more-text 自定义底部加载更多文字
	 * @property {Object} loading-more-custom-style 自定义底部加载更多样式
	 * @property {Object} loading-more-loading-icon-custom-style 自定义底部加载更多加载中动画样式
	 * @property {String} loading-more-loading-icon-type 自定义底部加载更多加载中动画图标类型，可选circle或flower，默认为circle
	 * @property {String} loading-more-loading-icon-custom-image 自定义底部加载更多加载中动画图标图片
	 * @property {Boolean} loading-more-enabled 是否启用加载更多数据(含滑动到底部加载更多数据和点击加载更多数据)，默认为是
	 * @property {Boolean} to-bottom-loading-more-enabled 是否启用滑动到底部加载更多数据
	 * @property {String} loading-more-default-text 滑动到底部"默认"文字，默认为【点击加载更多】
	 * @property {String} loading-more-loading-text 滑动到底部"加载中"文字，默认为【正在加载...】
	 * @property {String} loading-more-no-more-text 滑动到底部"没有更多"文字，默认为【没有更多了】
	 * @property {String} loading-more-fail-text 滑动到底部"加载失败"文字，默认为【加载失败，点击重新加载】
	 * @property {Boolean} hide-loading-more-when-no-more-and-inside-of-paging 当没有更多数据且分页内容未超出z-paging时是否隐藏没有更多数据的view，默认为是
	 * @property {Boolean} show-loading-more-no-more-view 是否显示没有更多数据的view，默认为是
	 * @property {Boolean} show-default-loading-more-text 是否显示默认的加载更多text，默认为是
	 * @property {Boolean} show-loading-more-no-more-line 是否显示没有更多数据的分割线，默认为是
	 * @property {Object} loading-more-no-more-line-custom-style 自定义底部没有更多数据的分割线样式
	 * @property {Boolean} hide-empty-view 是否强制隐藏空数据图，默认为否
	 * @property {String} empty-view-text 空数据图描述文字，默认为“没有数据哦~”
	 * @property {String} empty-view-img 空数据图图片，默认使用z-paging内置的图片
	 * @property {Boolean} auto-hide-empty-view-when-loading 加载中时是否自动隐藏空数据图，默认为是
	 * @property {Boolean} auto-hide-loading-after-first-loaded 第一次加载后自动隐藏loading slot，默认为是
	 * @property {Boolean} auto-show-back-to-top 自动显示点击返回顶部按钮，默认为否
	 * @property {Number} back-to-top-threshold 点击返回顶部按钮显示/隐藏的阈值(滚动距离)，单位为px，默认为200px
	 * @property {String} back-to-top-img 点击返回顶部按钮的自定义图片地址，默认使用z-paging内置的图片
	 * @property {Boolean} back-to-top-with-animate 点击返回顶部按钮返回到顶部时是否展示过渡动画，默认为是
	 * @property {Object} back-to-top-style 点击返回顶部按钮的自定义样式
	 * @property {Boolean} show-scrollbar 在设置滚动条位置时使用动画过渡，默认为否
	 * @property {Boolean} scroll-to-top-bounce-enabled iOS设备上滚动到顶部时是否允许回弹效果，默认为是。关闭回弹效果后可使滚动到顶部与下拉刷新更连贯，但是有吸顶view时滚动到顶部时可能出现抖动。
	 * @property {Boolean} scroll-with-animation 控制是否出现滚动条，默认为否
	 * @property {String} scroll-into-view 值应为某子元素id（id不能以数字开头）。设置哪个方向可滚动，则在哪个方向滚动到该元素
	 * @property {Number} lower-threshold 距底部/右边多远时（单位px），触发 scrolltolower 事件，默认为50
	 * @property {Boolean} enable-back-to-top iOS点击顶部状态栏、安卓双击标题栏时，滚动条返回顶部，只支持竖向，默认为否
	 * @property {Boolean} refresher-enabled 是否开启自定义下拉刷新，默认为是
	 * @property {Number} refresher-threshold 设置自定义下拉刷新阈值，默认为45
	 * @property {String} refresher-default-style 设置自定义下拉刷新默认样式，支持设置 black，white，none，none 表示不使用默认样式，默认为black
	 * @property {String} refresher-background 设置自定义下拉刷新区域背景颜色
	 * @property {Number|String} local-paging-loading-time 本地分页时上拉加载更多延迟时间，单位为毫秒，默认200毫秒
	 * @property {Boolean} use-chat-record-mode 使用聊天记录模式，默认为否
	 * @property {String} nvue-list-is nvue中修改列表类型，可选值有list和waterfall，默认为list
	 * @property {Object} nvue-waterfall-config nvue waterfall配置，仅在nvue中且nvueListIs=waterfall时有效，配置参数详情参见：https://uniapp.dcloud.io/component/waterfall
	 * @event {Function} addData 请求结束(成功或者失败)调用此方法，将请求的结果传递给z-paging处理，第一个参数为请求结果数组，第二个参数为是否成功(默认为是)
	 * @event {Function} setLocalPaging 设置本地分页，请求结束(成功或者失败)调用此方法，将请求的结果传递给z-paging作分页处理（若调用了此方法，则上拉加载更多时内部会自动分页，不会触发@query所绑定的事件）
	 * @event {Function} reload 重新加载分页数据，pageNo恢复为默认值，相当于下拉刷新的效果(animate为true时会展示下拉刷新动画，默认为false)
	 * @event {Function} endRefresh 手动停止下拉刷新加载
	 * @event {Function} loadingStatusChange 分页加载状态改变(0-默认状态 1.加载中 2.没有更多数据 3.加载失败)
	 * @event {Function} refresherStatusChange 自定义下拉刷新状态改变(use-custom-refresher为true时生效)(0-默认状态 1.松手立即刷新 2.刷新中)
	 * @event {Function} refresherTouchstart 自定义下拉刷新下拉开始(use-custom-refresher为true时生效)【注：当需要更细致定制自定义下拉刷新时使用，如果只需监听下拉刷新各个状态改变，使用`refresherStatusChange`即可】
	 * @event {Function} refresherTouchmove 自定义下拉刷新下拉中(use-custom-refresher为true时生效)【注：当需要更细致定制自定义下拉刷新时使用，如果只需监听下拉刷新各个状态改变，使用`refresherStatusChange`即可】
	 * @event {Function} refresherTouchend 自定义下拉刷新下拉结束(use-custom-refresher为true时生效)【注：当需要更细致定制自定义下拉刷新时使用，如果只需监听下拉刷新各个状态改变，使用`refresherStatusChange`即可】
	 * @event {Function} onRefresh 自定义下拉刷新被触发
	 * @event {Function} onRestore 自定义下拉刷新被复位
	 * @event {Function} scroll 滚动时触发，event.detail = {scrollLeft, scrollTop, scrollHeight, scrollWidth, deltaX, deltaY}
	 * @example <z-paging ref="paging" @query="queryList" :list.sync="dataList"></z-paging>
	 */
	export default {
		name: "z-paging",
		components: {
			zPagingRefresh,
			zPagingLoadMore,
			zPagingEmptyView
		},
		data() {
			return {
				base64Arrow: zStatic.base64Arrow,
				base64Flower: zStatic.base64Flower,
				base64BackToTop: zStatic.base64BackToTop,
				systemInfo: {},
				currentData: [],
				totalData: [],
				pageNo: 1,
				showLoadingMore: false,
				refresherTriggered: false,
				loading: false,
				firstPageLoaded: false,
				pagingLoaded: false,
				loaded: false,
				isUserReload: true,
				scrollEnable: true,
				scrollTop: 0,
				oldScrollTop: 0,
				refresherTouchstartY: 0,
				lastRefresherTouchmove: null,
				refresherReachMaxAngle: true,
				refresherTransform: 'translateY(0px)',
				refresherTransition: '0s',
				finalRefresherDefaultStyle: 'black',
				//当前加载类型 0-下拉刷新 1-上拉加载更多
				loadingType: 0,
				//底部加载更多状态 0-默认状态 1.加载中 2.没有更多数据 3.加载失败
				loadingStatus: 0,
				//下拉刷新状态 0-默认状态 1.松手立即刷新 2.刷新中
				refresherStatus: 0,
				scrollViewStyle: {},
				pullDownTimeStamp: 0,
				pageScrollTop: -1,
				isTouchmoving: false,
				isLocalPaging: false,
				totalLocalPagingList: [],
				realTotalData: [],
				isAddedData: false,
				isTotalChangeFromAddData: false,
				isTouchEnded: false,
				privateRefresherEnabled: -1,
				privateScrollWithAnimation: -1,
				chatRecordLoadingMoreText: '',
				moveDistance: 0,
				loadingMoreDefaultSlot: null,
				backToTopClass: 'zp-back-to-top zp-back-to-top-hide',
				showBackToTopClass: false,
				nRefresherLoading: false,
				nListIsDragging: false,
				nShowBottom: true,
				nFixFreezing: false,
				wxsPropType: '',
				wxsIsScrollTopInTopRange: true
			};
		},
		props: {
			//自定义pageNo，默认为1
			defaultPageNo: {
				type: [Number, String],
				default: _getConfig('defaultPageNo',1),
				observer: function(newVal, oldVal) {
					this.pageNo = newVal;
				},
			},
			//自定义pageSize，默认为10
			defaultPageSize: {
				type: [Number, String],
				default: _getConfig('defaultPageSize',10),
			},
			//设置z-paging的style，部分平台可能无法直接修改组件的style，可使用此属性代替
			pagingStyle: {
				type: Object,
				default: function() {
					return _getConfig('pagingStyle',{});
				},
			},
			//设置z-paging的容器(插槽的父view)的style
			pagingContentStyle: {
				type: Object,
				default: function() {
					return _getConfig('pagingContentStyle',{});
				},
			},
			//z-paging是否自动高度，若自动高度则会自动铺满屏幕
			autoHeight: {
				type: Boolean,
				default: _getConfig('autoHeight',false)
			},
			//z-paging是否自动高度时，附加的高度，注意添加单位px或rpx，若需要减少高度，则传负数
			autoHeightAddition: {
				type: String,
				default: _getConfig('autoHeightAddition','0px')
			},
			//loading(下拉刷新、上拉加载更多)的主题样式，支持black，white，默认black
			defaultThemeStyle: {
				type: String,
				default: function() {
					return _getConfig('defaultThemeStyle','black');
				}
			},
			//使用页面滚动，默认为否，当设置为是时则使用页面的滚动而非此组件内部的scroll-view的滚动，使用页面滚动时z-paging无需设置确定的高度且对于长列表展示性能更高，但配置会略微繁琐
			usePageScroll: {
				type: Boolean,
				default: _getConfig('usePageScroll',false)
			},
			//z-paging是否使用fixed布局，若使用fixed布局，则z-paging的父view无需固定高度，z-paging高度默认为100%，默认为否(当使用内置scroll-view滚动时有效)
			fixed: {
				type: Boolean,
				default: _getConfig('fixed',false)
			},
			//z-paging mounted后自动调用reload方法(mounted后自动调用接口)，默认为是
			mountedAutoCallReload: {
				type: Boolean,
				default: _getConfig('mountedAutoCallReload',true)
			},
			//reload时自动滚动到顶部，默认为是
			autoScrollToTopWhenReload: {
				type: Boolean,
				default: _getConfig('autoScrollToTopWhenReload',true)
			},
			//reload时立即自动清空原list，默认为是，若立即自动清空，则在reload之后、请求回调之前页面是空白的
			autoCleanListWhenReload: {
				type: Boolean,
				default: _getConfig('autoCleanListWhenReload',true)
			},
			//调用reload方法时自动显示下拉刷新view，默认为否
			showRefresherWhenReload: {
				type: Boolean,
				default: _getConfig('showRefresherWhenReload',false)
			},
			//是否使用自定义的下拉刷新，默认为是，即使用z-paging的下拉刷新。设置为false即代表使用uni scroll-view自带的下拉刷新，h5、App、微信小程序以外的平台不支持uni scroll-view自带的下拉刷新
			useCustomRefresher: {
				type: Boolean,
				default: _getConfig('useCustomRefresher',true)
			},
			//自定义下拉刷新下拉帧率，默认为40，过高可能会出现抖动问题(use-custom-refresher为true时生效)
			refresherFps: {
				type: [Number, String],
				default: _getConfig('refresherFps',40)
			},
			//自定义下拉刷新允许触发的最大下拉角度，默认为40度，当下拉角度小于设定值时，自定义下拉刷新动画不会被触发
			refresherMaxAngle: {
				type: [Number, String],
				default: _getConfig('refresherMaxAngle',40)
			},
			//自定义下拉刷新的角度由未达到最大角度变到达到最大角度时，是否继续下拉刷新手势，默认为否
			refresherAngleEnableChangeContinued: {
				type: Boolean,
				default: _getConfig('refresherAngleEnableChangeContinued',false)
			},
			//自定义下拉刷新默认状态下的文字(use-custom-refresher为true时生效)
			refresherDefaultText: {
				type: String,
				default: _getConfig('refresherDefaultText','继续下拉刷新')
			},
			//自定义下拉刷新松手立即刷新状态下的文字(use-custom-refresher为true时生效)
			refresherPullingText: {
				type: String,
				default: _getConfig('refresherPullingText','松开立即刷新')
			},
			//自定义下拉刷新刷新中状态下的文字(use-custom-refresher为true时生效)
			refresherRefreshingText: {
				type: String,
				default: _getConfig('refresherRefreshingText','正在刷新...')
			},
			//是否开启自定义下拉刷新刷新结束回弹效果，默认为是(use-custom-refresher为true时生效)
			refresherEndBounceEnabled: {
				type: Boolean,
				default: _getConfig('refresherEndBounceEnabled',true)
			},
			//自定义底部加载更多文字
			loadingMoreText: {
				type: String,
				default: _getConfig('loadingMoreText','')
			},
			//自定义底部加载更多样式
			loadingMoreCustomStyle: {
				type: Object,
				default: function () {
					return _getConfig('loadingMoreCustomStyle',{});
				}
			},
			//自定义底部加载更多加载中动画样式
			loadingMoreLoadingIconCustomStyle: {
				type: Object,
				default: function () {
					return _getConfig('loadingMoreLoadingIconCustomStyle',{});
				}
			},
			//自定义底部加载更多加载中动画图标类型，可选flower或circle，默认为flower
			loadingMoreLoadingIconType: {
				type: String,
				default: _getConfig('loadingMoreLoadingIconType','flower')
			},
			//自定义底部加载更多加载中动画图标图片
			loadingMoreLoadingIconCustomImage: {
				type: String,
				default: _getConfig('loadingMoreLoadingIconCustomImage','')
			},
			//是否启用加载更多数据(含滑动到底部加载更多数据和点击加载更多数据)，默认为是
			loadingMoreEnabled: {
				type: Boolean,
				default: _getConfig('loadingMoreEnabled',true)
			},
			//是否启用滑动到底部加载更多数据，默认为是
			toBottomLoadingMoreEnabled: {
				type: Boolean,
				default: _getConfig('toBottomLoadingMoreEnabled',true)
			},
			//滑动到底部"默认"文字，默认为【点击加载更多】
			loadingMoreDefaultText: {
				type: String,
				default: _getConfig('loadingMoreDefaultText','点击加载更多')
			},
			//滑动到底部"加载中"文字，默认为【正在加载...】
			loadingMoreLoadingText: {
				type: String,
				default: _getConfig('loadingMoreLoadingText','正在加载...')
			},
			//滑动到底部"没有更多"文字，默认为【没有更多了】
			loadingMoreNoMoreText: {
				type: String,
				default: _getConfig('loadingMoreNoMoreText','没有更多了')
			},
			//滑动到底部"加载失败"文字，默认为【加载失败，点击重新加载】
			loadingMoreFailText: {
				type: String,
				default: _getConfig('loadingMoreFailText','加载失败，点击重新加载')
			},
			//当没有更多数据且分页内容未超出z-paging时是否隐藏没有更多数据的view，默认为否
			hideLoadingMoreWhenNoMoreAndInsideOfPaging: {
				type: Boolean,
				default: _getConfig('hideLoadingMoreWhenNoMoreAndInsideOfPaging',false)
			},
			//是否显示默认的加载更多text，默认为是
			showDefaultLoadingMoreText: {
				type: Boolean,
				default: _getConfig('showDefaultLoadingMoreText',true)
			},
			//是否显示没有更多数据的view
			showLoadingMoreNoMoreView: {
				type: Boolean,
				default: _getConfig('showLoadingMoreNoMoreView',true)
			},
			//是否显示没有更多数据的分割线，默认为是
			showLoadingMoreNoMoreLine: {
				type: Boolean,
				default: _getConfig('showLoadingMoreNoMoreLine',true)
			},
			//自定义底部没有更多数据的分割线样式
			loadingMoreNoMoreLineCustomStyle: {
				type: Object,
				default: function() {
					return _getConfig('loadingMoreNoMoreLineCustomStyle',{});
				},
			},
			//是否强制隐藏空数据图，默认为否
			hideEmptyView: {
				type: Boolean,
				default: _getConfig('hideEmptyView',false)
			},
			//空数据图描述文字，默认为“没有数据哦~”
			emptyViewText: {
				type: String,
				default: _getConfig('emptyViewText','没有数据哦~')
			},
			//空数据图图片，默认使用z-paging内置的图片
			emptyViewImg: {
				type: String,
				default: _getConfig('emptyViewImg',zStatic.base64Empty)
			},
			//加载中时是否自动隐藏空数据图，默认为是
			autoHideEmptyViewWhenLoading: {
				type: Boolean,
				default: _getConfig('autoHideEmptyViewWhenLoading',true)
			},
			//第一次加载后自动隐藏loading slot，默认为是
			autoHideLoadingAfterFirstLoaded: {
				type: Boolean,
				default: _getConfig('autoHideLoadingAfterFirstLoaded',true)
			},
			//自动显示点击返回顶部按钮，默认为否
			autoShowBackToTop: {
				type: Boolean,
				default: _getConfig('autoShowBackToTop',false)
			},
			//点击返回顶部按钮显示/隐藏的阈值(滚动距离)，单位为px，默认为200px
			backToTopThreshold: {
				type: Number,
				default: _getConfig('backToTopThreshold',200)
			},
			//点击返回顶部按钮的自定义图片地址，默认使用z-paging内置的图片
			backToTopImg: {
				type: String,
				default: _getConfig('backToTopImg','')
			},
			//点击返回顶部按钮返回到顶部时是否展示过渡动画，默认为是
			backToTopWithAnimate: {
				type: Boolean,
				default: _getConfig('backToTopWithAnimate',true)
			},
			//点击返回顶部按钮的自定义样式
			backToTopStyle: {
				type: Object,
				default: function() {
					return _getConfig('backToTopStyle',{});
				},
			},
			//控制是否出现滚动条，默认为否
			showScrollbar: {
				type: Boolean,
				default: _getConfig('showScrollbar',false)
			},
			//iOS设备上滚动到顶部时是否允许回弹效果，默认为是。关闭回弹效果后可使滚动到顶部与下拉刷新更连贯，但是有吸顶view时滚动到顶部时可能出现抖动。
			scrollToTopBounceEnabled: {
				type: Boolean,
				default: _getConfig('scrollToTopBounceEnabled',true)
			},
			//在设置滚动条位置时使用动画过渡，默认为否
			scrollWithAnimation: {
				type: Boolean,
				default: _getConfig('scrollWithAnimation',false)
			},
			//值应为某子元素id（id不能以数字开头）。设置哪个方向可滚动，则在哪个方向滚动到该元素
			scrollIntoView: {
				type: String,
				default: _getConfig('scrollIntoView','')
			},
			//距底部/右边多远时（单位px），触发 scrolltolower 事件，默认为50
			lowerThreshold: {
				type: Number,
				default: _getConfig('lowerThreshold',50)
			},
			//iOS点击顶部状态栏、安卓双击标题栏时，滚动条返回顶部，只支持竖向，默认为否
			enableBackToTop: {
				type: Boolean,
				default: _getConfig('enableBackToTop',false)
			},
			//是否开启自定义下拉刷新，默认为是
			refresherEnabled: {
				type: Boolean,
				default: _getConfig('refresherEnabled',true)
			},
			//设置自定义下拉刷新阈值，默认为45
			refresherThreshold: {
				type: Number,
				default: _getConfig('refresherThreshold',45)
			},
			//设置系统下拉刷新默认样式，支持设置 black，white，none，none 表示不使用默认样式，默认为black
			refresherDefaultStyle: {
				type: String,
				default: _getConfig('refresherDefaultStyle','black')
			},
			//设置自定义下拉刷新区域背景颜色
			refresherBackground: {
				type: String,
				default: _getConfig('refresherBackground','#ffffff00')
			},
			//本地分页时上拉加载更多延迟时间，单位为毫秒，默认200毫秒
			localPagingLoadingTime: {
				type: [Number, String],
				default: _getConfig('localPagingLoadingTime',200)
			},
			//使用聊天记录模式，默认为否
			useChatRecordMode: {
				type: Boolean,
				default: _getConfig('useChatRecordMode',false)
			},
			//nvue中修改列表类型，可选值有list和waterfall，默认为list
			nvueListIs: {
				type: String,
				default: _getConfig('nvueListIs','list')
			},
			//nvue waterfall配置，仅在nvue中且nvueListIs=waterfall时有效，配置参数详情参见：https://uniapp.dcloud.io/component/waterfall
			nvueWaterfallConfig: {
				type: Object,
				default: function() {
					return _getConfig('nvueWaterfallConfig',{});
				}
			},
		},
		mounted() {
			this.wxsPropType = (new Date()).getTime().toString();
			if (this.mountedAutoCallReload) {
				this.reload();
			}
			this.$nextTick(() => {
				this.systemInfo = uni.getSystemInfoSync();
				if (!this.usePageScroll && this.autoHeight) {
					this._setAutoHeight();
				}
				this.loaded = true;
			})
			this.updatePageScrollTopHeight();
		},
		watch: {
			totalData(newVal, oldVal) {
				if ((!this.isUserReload || !this.autoCleanListWhenReload) && this.firstPageLoaded && !newVal.length &&
					oldVal.length) {
					return;
				}
				newVal = [].concat(newVal);
				if (!this.usePageScroll && this.loadingStatus === 2 && this.hideLoadingMoreWhenNoMoreAndInsideOfPaging &&
					newVal.length) {
					this.$nextTick(() => {
						this._checkShowLoadingMoreWhenNoMoreAndInsideOfPaging(newVal);
					})
				} else {
					this.showLoadingMore = newVal.length;
				}
				if (this.usePageScroll && this.isTotalChangeFromAddData) {
					this.$nextTick(() => {
						this._checkScrollViewShouldFullHeight();
					})
				}
				if (!this.usePageScroll && (this.pageNo === this.defaultPageNo || this.defaultPageNo + 1)) {
					this.$nextTick(() => {
						this._checkScrollViewOutOfPage();
					})
				}
				this.realTotalData = newVal;
				this.$emit('update:list', newVal);
				this.firstPageLoaded = false;
				this.isTotalChangeFromAddData = false;
				this.$nextTick(() => {
					this._getNodeClientRect('.zp-paging-container-content').then((res) => {
						if (res) {
							this.$emit('pagingContentHeightChanged', res[0].height);
						}
					});
				})
			},
			currentData(newVal, oldVal) {
				this._currentDataChange(newVal, oldVal);
			},
			loadingStatus(newVal, oldVal) {
				this.$emit('loadingStatusChange', newVal);
			},
			oldScrollTop(newVal, oldVal) {
				if(!this.usePageScroll){
					this.$emit('scrollTopChange', newVal);
					this.$emit('update:scrollTop', newVal);
					this._checkShouldShowBackToTop(newVal, oldVal);
				}
				const wxsIsScrollTopInTopRange = newVal < 5;
				if(this.wxsIsScrollTopInTopRange !== wxsIsScrollTopInTopRange){
					this.wxsIsScrollTopInTopRange = wxsIsScrollTopInTopRange;
				}
			},
			pageScrollTop(newVal, oldVal) {
				if (this.usePageScroll) {
					this.$emit('scrollTopChange', newVal);
					this.$emit('update:scrollTop', newVal);
					this._checkShouldShowBackToTop(newVal, oldVal);
				}
			},
			defaultThemeStyle: {
				handler(newVal) {
					if (newVal.length) {
						this.finalRefresherDefaultStyle = newVal;
					}
				},
				immediate: true
			},
			usePageScroll(newVal, oldVal) {
				if (this.loaded && this.autoHeight) {
					this._setAutoHeight(!newVal);
				}
			},
			autoHeight(newVal, oldVal) {
				if (this.loaded && !this.usePageScroll) {
					this._setAutoHeight(newVal);
				}
			},
			autoHeightAddition(newVal, oldVal) {
				if (this.loaded && !this.usePageScroll && this.autoHeight) {
					this._setAutoHeight(newVal);
				}
			},
			refresherDefaultStyle: {
				handler(newVal) {
					if (newVal.length) {
						this.finalRefresherDefaultStyle = newVal;
					}
				},
				immediate: true
			},
			refresherStatus(newVal, oldVal) {
				if (newVal !== oldVal) {
					this.$emit('refresherStatusChange', newVal);
					this.$emit('update:refresherStatus', newVal);
				}
			}
		},
		computed: {
			pullDownDisTimeStamp() {
				return 1000 / this.refresherFps;
			},
			finalRefresherEnabled() {
				if (this.useChatRecordMode) {
					return false;
				}
				if (this.privateRefresherEnabled === -1) {
					return this.refresherEnabled;
				}
				return this.privateRefresherEnabled === 1;
			},
			finalScrollWithAnimation() {
				if (this.privateScrollWithAnimation !== -1) {
					const scrollWithAnimation = this.privateScrollWithAnimation === 1;
					this.privateScrollWithAnimation = -1;
					return scrollWithAnimation;
				}
				return this.scrollWithAnimation;
			},
			zPagingLoadMoreConfig() {
				return {
					loadingStatus: this.loadingStatus,
					defaultThemeStyle: this.defaultThemeStyle,
					loadingMoreCustomStyle: this.loadingMoreCustomStyle,
					loadingMoreLoadingIconCustomStyle: this.loadingMoreLoadingIconCustomStyle,
					loadingMoreLoadingIconType: this.loadingMoreLoadingIconType,
					loadingMoreLoadingIconCustomImage: this.loadingMoreLoadingIconCustomImage,
					showLoadingMoreNoMoreLine: this.showLoadingMoreNoMoreLine,
					loadingMoreNoMoreLineCustomStyle: this.loadingMoreNoMoreLineCustomStyle,
					loadingMoreDefaultText: this.loadingMoreDefaultText,
					loadingMoreLoadingText: this.loadingMoreLoadingText,
					loadingMoreNoMoreText: this.loadingMoreNoMoreText,
					loadingMoreFailText: this.loadingMoreFailText,
					loadingMoreText: this.loadingMoreText
				};
			},
			zScopedSlots(){
				return this.$scopedSlots;
			},
			finalNvueListIs() {
				const nvueListIsLowerCase = this.nvueListIs.toLowerCase();
				if (nvueListIsLowerCase === 'list' || nvueListIsLowerCase === 'waterfall') {
					return nvueListIsLowerCase;
				}
				return 'list';
			},
			finalPagingStyle(){
				let pagingStyle = this.pagingStyle;
				const windowTop = this.systemInfo.windowTop;
				const windowBottom = this.systemInfo.windowBottom;
				if(!this.usePageScroll && this.fixed){
					if(windowTop && windowTop !== undefined){
						pagingStyle.top = windowTop + 'px';
					}
					if(windowBottom && windowBottom !== undefined){
						pagingStyle.bottom = windowBottom + 'px';
					}
				}
				return pagingStyle;
			},
			windowTop(){
				const windowTop = this.systemInfo.windowTop;
				return windowTop && windowTop !== undefined ? windowTop : 0;
			},
			nWaterfallColumnCount() {
				return this._getNvueWaterfallSingleConfig('column-count', 2);
			},
			nWaterfallColumnWidth() {
				return this._getNvueWaterfallSingleConfig('column-width', 'auto');
			},
			nWaterfallColumnGap() {
				return this._getNvueWaterfallSingleConfig('column-gap', 'normal');
			},
			nWaterfallLeftGap() {
				return this._getNvueWaterfallSingleConfig('left-gap', 0);
			},
			nWaterfallRightGap() {
				return this._getNvueWaterfallSingleConfig('right-gap', 0);
			}
		},
		methods: {
			//请求结束(成功或者失败)调用此方法，将请求的结果传递给z-paging处理，第一个参数为请求结果数组，第二个参数为是否成功(默认是是）
			complete(data, success = true) {
				this.addData(data, success);
			},
			//与上方complete方法功能一致，新版本中设置服务端回调数组请使用complete方法
			addData(data, success = true) {
				this.$nextTick(() => {
					this._addData(data, success, false);
				})
			},
			//添加聊天记录
			addChatRecordData(data, toBottom = true, toBottomWithAnimate = true) {
				let dataType = Object.prototype.toString.call(data);
				if (dataType !== '[object Array]') {
					data = [data];
				}
				if (!this.useChatRecordMode) {
					return;
				}
				this.isTotalChangeFromAddData = true;
				this.totalData = this.totalData.concat(data);
				if (toBottom) {
					setTimeout(() => {
						this._scrollToBottom(toBottomWithAnimate);
					}, commonDelayTime)
				}
			},
			//从顶部添加数据，不会影响分页的pageNo和pageSize
			addDataFromTop(data, toTop = true, toTopWithAnimate = true) {
				let dataType = Object.prototype.toString.call(data);
				if (dataType !== '[object Array]') {
					data = [data];
				}
				this.totalData = data.concat(this.totalData);
				if (toTop) {
					setTimeout(() => {
						this._scrollToTop(toTopWithAnimate);
					}, commonDelayTime)
				}
			},
			//重新设置列表数据，调用此方法不会影响pageNo和pageSize，也不会触发请求。适用场景：当需要删除列表中某一项时，将删除对应项后的数组通过此方法传递给z-paging。(当出现类似的需要修改列表数组的场景时，请使用此方法，请勿直接修改page中:list.sync绑定的数组)
			resetTotalData(data) {
				if (data == undefined) {
					console.error('[z-paging]方法resetTotalData参数缺失！');
					return;
				}
				this.isTotalChangeFromAddData = true;
				let dataType = Object.prototype.toString.call(data);
				if (dataType !== '[object Array]') {
					data = [data];
				}
				this.totalData = data;
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
				this.isUserReload = true;
				if (animate) {
					if (this.useCustomRefresher) {
						this._doRefresherRefreshAnimate();
					} else {
						this.refresherTriggered = true;
					}
					// #ifdef APP-NVUE
					this.nRefresherLoading = true;
					// #endif
				} else {
					this._refresherEnd(false);
				}
				this._reload();
			},
			//手动触发滚动到顶部加载更多，聊天记录模式时有效
			doChatRecordLoadMore() {
				this._onLoadingMore('click');
			},
			//手动触发上拉加载更多(非必须，可依据具体需求使用)
			doLoadMore() {
				this._onLoadingMore('toBottom');
			},
			//手动停止下拉刷新加载
			endRefresh() {
				this.refresherTriggered = false;
			},
			//滚动到顶部，animate为是否展示滚动动画，默认为是
			scrollToTop(animate) {
				this._scrollToTop(animate);
			},
			//滚动到底部，animate为是否展示滚动动画，默认为是
			scrollToBottom(animate) {
				this._scrollToBottom(animate);
			},
			//滚动到指定view。sel为需要滚动的view的id值，不包含"#"；offset为偏移量，单位为px；animate为是否展示滚动动画，默认为否
			scrollIntoViewById(sel, offset, animate) {
				this._scrollIntoView(sel, offset, animate);
			},
			//当使用页面滚动并且自定义下拉刷新时，请在页面的onPageScroll中调用此方法，告知z-paging当前的pageScrollTop，否则会导致在任意位置都可以下拉刷新
			updatePageScrollTop(value) {
				if (value == undefined) {
					//console.error('[z-paging]updatePageScrollTop方法缺少参数，请将页面onPageScroll事件中的scrollTop传递给此方法');
					return;
				}
				this.pageScrollTop = value;
			},
			//当使用页面滚动并且设置了slot="top"时，默认初次加载会自动获取其高度，并使内部容器下移，当slot="top"的view高度动态改变时，在其高度需要更新时调用此方法
			updatePageScrollTopHeight(){
				this.$nextTick(()=>{
					let delayTime = 0;
					// #ifdef MP-BAIDU
					delayTime = 10;
					// #endif
					setTimeout(()=>{
						this._getNodeClientRect('.zp-page-scroll-top').then((res) => {
							if (res) {
								const pageScrollTopHeight = res[0].height;
								this.$set(this.scrollViewStyle, 'marginTop', `${pageScrollTopHeight}px`);
							}
						});
					},delayTime)
				})
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
			//设置nvue List的specialEffects
			setListSpecialEffects(args) {
				this.nFixFreezing = args !== {};
				this.$refs["n-list"].setSpecialEffects(args);
			},
			handleRefresherStatusChanged(func){
				this.refresherStatusChangedFunc = func;
			},
			//私有的重新加载分页数据方法
			_reload() {
				this.isAddedData = false;
				this.pageNo = this.defaultPageNo;
				// #ifdef APP-NVUE
				if (systemInfo.platform !== 'ios') {
					this.nShowBottom = false;
				}
				// #endif
				this._startLoading(true);
				this.firstPageLoaded = true;
				this.isTotalChangeFromAddData = false;
				this.totalData = [];
				this.$emit('query', this.pageNo, this.defaultPageSize);
				if (this.autoScrollToTopWhenReload) {
					this._scrollToTop();
				}
				if (!this.usePageScroll && this.useChatRecordMode) {
					console.warn('[z-paging]使用聊天记录模式时，建议使用页面滚动，可将usePageScroll设置为true以启用页面滚动！！');
				}
			},
			//私有的处理服务端返回的数组方法
			_addData(data, success, isLocal) {
				this.isAddedData = true;
				this.isTotalChangeFromAddData = true;
				if (!this.useCustomRefresher){
					uni.stopPullDownRefresh();
				}
				let dataType = Object.prototype.toString.call(data);
				if (dataType === '[object Boolean]') {
					success = data;
					data = [];
				} else if (dataType !== '[object Array]') {
					data = [];
					let methodStr = isLocal ? 'setLocalPaging' : 'addData';
					if (dataType !== '[object Undefined]') {
						console.error(`[z-paging]:${methodStr}参数类型不正确，第一个参数类型必须为Array!`);
					}
				}
				if (this.refresherTriggered) {
					this.refresherTriggered = false;
				}
				setTimeout(() => {
					this._refresherEnd();
					this.pagingLoaded = true;
				}, commonDelayTime)
				if (success) {
					this.loadingStatus = 0;
					if (isLocal) {
						this.totalLocalPagingList = data;
						this._localPagingQueryList(this.defaultPageNo, this.defaultPageSize, 0, (res) => {
							this.complete(res);
						})
					} else {
						this._currentDataChange(data, this.currentData);
					}
				} else {
					this.loadingStatus = 3;
					if (this.loadingType === 1) {
						this.pageNo--;
					}
				}
			},
			//当前数据改变时调用
			_currentDataChange(newVal, oldVal) {
				newVal = [].concat(newVal);
				if (this.useChatRecordMode) {
					newVal.reverse();
				}
				if (this.pageNo === this.defaultPageNo) {
					this.totalData = [];
				}
				if (
					!newVal.length ||
					(newVal.length && newVal.length < this.defaultPageSize)
				) {
					this.loadingStatus = 2;
				}
				if (!this.totalData.length) {
					this.totalData = newVal;
					if (this.useChatRecordMode) {
						this.$nextTick(() => {
							this._scrollToBottom(false);
						})
					}
				} else {
					if (this.useChatRecordMode) {
						const idIndex = newVal.length;
						this.totalData = newVal.concat(this.totalData);
						if (this.pageNo !== this.defaultPageNo) {
							this.privateScrollWithAnimation = 0;
							let delayTime = 200;
							//#ifdef H5
							delayTime = 0;
							//#endif
							if (this.usePageScroll) {
								this.$nextTick(() => {
									this._scrollIntoView(`z-paging-${idIndex}`, 30);
								})
							} else {
								setTimeout(() => {
									this._scrollIntoView(`z-paging-${idIndex}`, 30);
								}, delayTime)
							}
						} else {
							this.$nextTick(() => {
								this._scrollToBottom(false);
							})
						}
					} else {
						this.totalData = this.totalData.concat(newVal);
					}
				}
			},
			//触发加载更多时调用,from:0-滑动到底部触发；1-点击加载更多触发
			_onLoadingMore(from = 'click') {
				this.$emit('scrolltolower', from);
				if (from === 'toBottom' && (!this.toBottomLoadingMoreEnabled || this.useChatRecordMode)) {
					return;
				}
				if (!this.loadingMoreEnabled || !(this.loadingStatus === 0 || 3) || this.loading) return;

				this._doLoadingMore();
			},
			//当滚动到顶部时
			_scrollToUpper() {
				this.$nextTick(()=>{
					this.oldScrollTop = 0;
				})
				if (!this.useChatRecordMode) {
					return;
				}
				if (this.loadingStatus === 2) {
					return;
				}
				this._onLoadingMore('click');
			},
			//滚动到顶部
			_scrollToTop(animate) {
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
				} catch (e) {

				}
			},
			//滚动到指定view
			async _scrollIntoView(sel, offset = 0, animate = false, finishCallback) {
				try {
					if (sel.indexOf('#') != -1) {
						sel = sel.replace('#', '');
					}
					const node = await this._getNodeClientRect('#' + sel, false);
					if (node) {
						let nodeTop = node[0].top;
						this.scrollTop = this.oldScrollTop;
						this.privateScrollWithAnimation = animate ? 1 : 0;
						this.$nextTick(() => {
							if (this.usePageScroll) {
								uni.pageScrollTo({
									scrollTop: nodeTop - offset,
									duration: animate ? 100 : 0
								});
							} else {
								nodeTop = nodeTop + this.scrollTop;
								this.scrollTop = nodeTop - offset;
								this.oldScrollTop = this.scrollTop;
							}
							if (finishCallback) {
								finishCallback();
							}
						});
					}
				} catch (e) {

				}
			},
			//是否要展示上拉加载更多view
			_shouldShowLoading(type) {
				if (!this.showLoadingMore || !this.loadingMoreEnabled) {
					return false;
				}
				if (this.useChatRecordMode && type !== 'loadingMoreLoading') {
					return false;
				}
				if(!this.$slots){
					return false;
				}
				if (type === 'loadingMoreDefault') {
					return this.loadingStatus === 0 && this.$slots.loadingMoreDefaul;
				} else if (type === 'loadingMoreLoading') {
					return this.loadingStatus === 1 && this.$slots.loadingMoreLoading;
				} else if (type === 'loadingMoreNoMore') {
					return this.loadingStatus === 2 && this.$slots.loadingMoreNoMore && this.showLoadingMoreNoMoreView;
				} else if (type === 'loadingMoreFail') {
					return this.loadingStatus === 3 && $this.slots.loadingMoreFail;
				} else if (type === 'loadingMoreCustom') {
					return this.showDefaultLoadingMoreText && !(this.loadingStatus === 2 && !this
						.showLoadingMoreNoMoreView);
				}
				return false;
			},
			//处理开始加载更多状态
			_startLoading(isReload = false) {
				if (!isReload) {
					this.loadingStatus = 1;
				}
				this.loading = true;
			},
			//处理开始加载更多
			_doLoadingMore() {
				if (this.pageNo >= this.defaultPageNo && this.loadingStatus !== 2) {
					this.pageNo++;
					this._startLoading(false);
					if (this.isLocalPaging) {
						this._localPagingQueryList(this.pageNo, this.defaultPageSize, this.localPagingLoadingTime, (
							res) => {
							this.addData(res);
						})
					} else {
						this.$emit('query', this.pageNo, this.defaultPageSize);
					}
					this.loadingType = 1;
				}
			},
			_scroll(e) {
				this.$emit('scroll', e);
				this.oldScrollTop = e.detail.scrollTop;
				if (!this.scrollToTopBounceEnabled && e.detail.scrollTop < 0) {
					if (this.scrollEnable) {
						this.scrollEnable = false;
						this.$nextTick(() => {
							this.scrollEnable = true;
						})
					}
				}
			},
			//自定义下拉刷新被触发
			_onRefresh() {
				if (this.loading) {
					return;
				}
				this.isUserReload = false;
				this._startLoading(true);
				this.refresherTriggered = true;
				if (this.useChatRecordMode) {
					this._onLoadingMore('click')
				} else {
					this._reload();
				}
				this.$emit('onRefresh');
				this.loadingType = 0;
			},
			//自定义下拉刷新被复位
			_onRestore() {
				this.refresherTriggered = 'restore';
				this.$emit('onRestore');
			},
			//拖拽开始
			_refresherTouchstart(e) {
				if (this._getRefresherTouchDisabled()) {
					return;
				}
				const touch = this._getCommonTouch(e);
				this._handleRefresherTouchstart(touch);
			},
			//进一步处理拖拽开始结果
			_handleRefresherTouchstart(touch){
				if (!this.loading && this.isTouchEnded) {
					this.isTouchmoving = false;
				}
				this.isTouchEnded = false;
				this.refresherTransition = 'transform .1s linear';
				this.refresherTouchstartY = touch.touchY;
				this.$emit('refresherTouchstart', this.refresherTouchstartY);
				this.lastRefresherTouchmove = touch;
			},
			//拖拽中
			_refresherTouchmove(e) {
				const currentTimeStamp = (new Date()).getTime();
				if (this.pullDownTimeStamp && currentTimeStamp - this.pullDownTimeStamp <= this.pullDownDisTimeStamp) {
					return;
				}
				if (this._getRefresherTouchDisabled()) {
					return;
				}
				this.pullDownTimeStamp = Number(currentTimeStamp);
				const touch = this._getCommonTouch(e);
				let refresherTouchmoveY = touch.touchY;
				let moveDistance = refresherTouchmoveY - this.refresherTouchstartY;
				if (moveDistance < 0) {
					return;
				}
				if (this.refresherMaxAngle >= 0 && this.refresherMaxAngle <= 90 && this.lastRefresherTouchmove && this
					.lastRefresherTouchmove.touchY <= refresherTouchmoveY) {
					if (!this.refresherAngleEnableChangeContinued && this.moveDistance < 1 && !this
						.refresherReachMaxAngle) {
						return;
					}
					const x = Math.abs(touch.touchX - this.lastRefresherTouchmove.touchX);
					const y = Math.abs(refresherTouchmoveY - this.lastRefresherTouchmove.touchY);
					const z = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
					if (x && y) {
						const angle = Math.asin(y / z) / Math.PI * 180;
						if (angle < this.refresherMaxAngle) {
							this.lastRefresherTouchmove = touch;
							this.refresherReachMaxAngle = false;
							return;
						}
					}
				}
				moveDistance = this._getFinalRefresherMoveDistance(moveDistance);
				this._handleRefresherTouchmove(moveDistance,touch);
				
			},
			//进一步处理拖拽中结果
			_handleRefresherTouchmove(moveDistance,touch){
				this.refresherReachMaxAngle = true;
				if (!this.isTouchmoving) {
					this.isTouchmoving = true;
				}
				this.isTouchEnded = false;
				if (moveDistance >= this.refresherThreshold) {
					this.refresherStatus = 1;
				} else {
					this.refresherStatus = 0;
				}
				// #ifndef APP-VUE || MP-WEIXIN || MP-QQ  || H5
				this.scrollEnable = false;
				this.refresherTransform = `translateY(${moveDistance}px)`;
				this.lastRefresherTouchmove = touch;
				// #endif
				this.moveDistance = moveDistance;
				this.$emit('refresherTouchmove', moveDistance);
			},
			//拖拽结束
			_refresherTouchend(e) {
				if (this._getRefresherTouchDisabled() || !this.isTouchmoving) {
					return;
				}
				const touch = this._getCommonTouch(e);
				let refresherTouchendY = touch.touchY;
				let moveDistance = refresherTouchendY - this.refresherTouchstartY;
				moveDistance = this._getFinalRefresherMoveDistance(moveDistance);
				this._handleRefresherTouchend(moveDistance);
			},
			//进一步处理拖拽结束结果
			_handleRefresherTouchend(moveDistance){
				if(!this.isTouchmoving){
					return;
				}
				this.refresherReachMaxAngle = true;
				if (moveDistance < 0 && this.usePageScroll && this.loadingMoreEnabled && this.useCustomRefresher && this.pageScrollTop === -1) {
					console.error(
						'[z-paging]usePageScroll为true并且自定义下拉刷新时必须引入mixin或在page滚动时通过调用z-paging组件的updatePageScrollTop方法设置当前的scrollTop'
					)
				}
				this.isTouchEnded = true;
				if (moveDistance >= this.refresherThreshold && this.refresherStatus === 1) {
					// #ifndef APP-VUE || MP-WEIXIN || MP-QQ  || H5
					this.refresherTransform = `translateY(${this.refresherThreshold}px)`;
					// #endif
					this.moveDistance = this.refresherThreshold;
					this.refresherStatus = 2;
					this._doRefresherLoad();
				} else {
					this._refresherEnd();
					setTimeout(() => {
						this.isTouchmoving = false;
					}, commonDelayTime);
				}
				this.scrollEnable = true;
				this.$emit('refresherTouchend', moveDistance);
			},
			//下拉刷新结束
			_refresherEnd(shouldEndLoadingDelay = true) {
				// #ifndef APP-VUE || MP-WEIXIN || MP-QQ  || H5
				this.refresherTransform = 'translateY(0px)';
				// #endif
				// #ifdef APP-VUE || MP-WEIXIN || MP-QQ || H5
				this.wxsPropType = 'end' + (new Date()).getTime();
				// #endif
				this.moveDistance = 0;
				if (this.refresherEndBounceEnabled) {
					this.refresherTransition = 'transform 0.3s cubic-bezier(0.19,1.64,0.42,0.72)';
				}
				setTimeout(() => {
					this.refresherStatus = 0;
				}, commonDelayTime);
				if (shouldEndLoadingDelay) {
					setTimeout(() => {
						this.loading = false;
					}, commonDelayTime);
				} else {
					this.loading = false;
				}
				this.$emit('onRestore');
				// #ifdef APP-NVUE
				setTimeout(() => {
					this.$nextTick(() => {
						this.nShowBottom = true;
					})
				}, 800);
				this.$refs["n-list"].resetLoadmore();
				this.nRefresherLoading = false;
				// #endif
			},
			//模拟用户手动触发下拉刷新
			_doRefresherRefreshAnimate() {
				this.refresherTransform = `translateY(${this.refresherThreshold}px)`;
				// #ifdef APP-VUE || MP-WEIXIN || MP-QQ || H5
				this.wxsPropType = 'begin' + (new Date()).getTime();
				// #endif
				this.moveDistance = this.refresherThreshold;
				this.refresherStatus = 2;
				this.isTouchmoving = true;
			},
			//触发下拉刷新
			_doRefresherLoad() {
				this._onRefresh();
				this.loading = true;
			},
			//获取处理后的moveDistance
			_getFinalRefresherMoveDistance(moveDistance) {
				moveDistance = moveDistance * 0.7;
				if (moveDistance >= this.refresherThreshold) {
					moveDistance = this.refresherThreshold + (moveDistance - this.refresherThreshold) * 0.3;
				}
				return moveDistance;
			},
			//判断当没有更多数据且分页内容未超出z-paging时是否显示没有更多数据的view
			async _checkShowLoadingMoreWhenNoMoreAndInsideOfPaging(totalData) {
				try {
					let pagingContainerH = 0;
					let scrollViewH = 0;
					const pagingContainerNode = await this._getNodeClientRect('.zp-paging-container-content');
					const scrollViewNode = await this._getNodeClientRect('.zp-scroll-view');
					if (pagingContainerNode) {
						pagingContainerH = pagingContainerNode[0].height;
					}
					if (scrollViewNode) {
						scrollViewH = scrollViewNode[0].height;
					}
					this.showLoadingMore = pagingContainerH >= scrollViewH;
				} catch (e) {
					this.showLoadingMore = totalData.length;
				}
			},
			//检测z-paging是否超出了页面高度
			async _checkScrollViewOutOfPage() {
				try {
					const scrollViewNode = await this._getNodeClientRect('.zp-scroll-view');
					if (scrollViewNode){
						const scrollViewTotalH = scrollViewNode[0].top + scrollViewNode[0].height;
						if (scrollViewTotalH > this.systemInfo.windowHeight + 100) {
							console.error(
								'[z-paging]检测到z-paging的高度超出页面高度，这将导致滚动出现异常，请设置【:fixed="true"】或【确保z-paging有确定的高度(如果通过百分比设置z-paging的高度，请保证z-paging的所有父view已设置高度，同时确保page也设置了height:100%，如：page{height:100%}】，此时z-paging的百分比高度才能生效。详情参照demo或访问：https://ext.dcloud.net.cn/plugin?id=3935)'
							);
						}
					}
				} catch (e) {

				}
			},
			//检测z-paging是否要全屏覆盖(当使用页面滚动并且不满全屏时，默认z-paging需要铺满全屏，避免数据过少时内部的empty-view无法正确展示)
			async _checkScrollViewShouldFullHeight() {
				try {
					const scrollViewNode = await this._getNodeClientRect('.zp-scroll-view');
					const pagingContainerNode = await this._getNodeClientRect('.zp-paging-container-content');
					if (!scrollViewNode || !pagingContainerNode){
						return;
					}
					const scrollViewHeight = pagingContainerNode[0].height;
					const scrollViewTop = scrollViewNode[0].top;
					if (this.isAddedData && scrollViewHeight + scrollViewTop <= this.systemInfo.windowHeight + 10) {
						this._setAutoHeight(true, scrollViewNode);
					} else {
						this._setAutoHeight(false);
					}
				} catch (e) {

				}
			},
			//设置z-paging高度
			async _setAutoHeight(shouldFullHeight = true, scrollViewNode = null) {
				try {
					if (shouldFullHeight) {
						let finalScrollViewNode = scrollViewNode ? scrollViewNode : await this._getNodeClientRect(
							'.scroll-view');
						if(finalScrollViewNode){
							const scrollViewTop = finalScrollViewNode[0].top;
							const scrollViewHeight = this.systemInfo.windowHeight - scrollViewTop;
							let additionHeight = this._convertTextToPx(this.autoHeightAddition);
							this.$set(this.scrollViewStyle, 'height', scrollViewHeight + additionHeight + 'px');
						}
					} else {
						
						this.$delete(this.scrollViewStyle, 'height');
					}
				} catch (e) {

				}
			},
			//获取节点尺寸
			_getNodeClientRect(select, inThis = true) {
				// #ifdef APP-NVUE
				return new Promise((resolve, reject) => {
					resolve(false);
				});
				return;					
				// #endif
				let res = null;
				if (inThis) {
					res = uni.createSelectorQuery().in(this);
				} else {
					res = uni.createSelectorQuery();
				}
				//#ifdef MP-ALIPAY
				res = uni.createSelectorQuery();
				//#endif
				res.select(select).boundingClientRect();
				return new Promise((resolve, reject) => {
					res.exec(data => {
						if(data && data != '' && data != undefined && data.length){
							resolve(data);
						}else{
							resolve(false);
						}
					});
				});
			},
			//判断touch手势是否要触发
			_getRefresherTouchDisabled() {
				let checkOldScrollTop = this.oldScrollTop > 5;
				return this.loading || this.useChatRecordMode || !this.refresherEnabled || !this.useCustomRefresher || (
					this.usePageScroll && this
					.useCustomRefresher && this
					.pageScrollTop > 10) || (!(this.usePageScroll && this.useCustomRefresher) && checkOldScrollTop);
			},
			//本地分页请求
			_localPagingQueryList(pageNo, pageSize, localPagingLoadingTime, callback) {
				pageNo = parseInt(pageNo);
				pageSize = parseInt(pageSize);
				if (pageNo < 0 || pageSize <= 0) {
					callQueryResult(callback, []);
					return;
				}
				if (pageNo == 0) {
					pageNo = 1;
				}
				let totalPagingList = [].concat(this.totalLocalPagingList);
				let pageNoIndex = (pageNo - 1) * pageSize;
				if (pageNoIndex + pageSize <= totalPagingList.length) {
					this._localPagingQueryResult(callback, totalPagingList.splice(pageNoIndex, pageSize),
						localPagingLoadingTime);
				} else if (pageNoIndex < totalPagingList.length) {
					this._localPagingQueryResult(callback, totalPagingList.splice(pageNoIndex, totalPagingList.length -
							pageNoIndex),
						localPagingLoadingTime);
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
			//将文本的px或者rpx转为px的值
			_convertTextToPx(text) {
				let isRpx = false;
				if (text.indexOf('rpx') !== -1) {
					text = text.replace('rpx', '');
					isRpx = true;
				} else if (text.indexOf('px') !== -1) {
					text = text.replace('px', '');
				}
				if (!isNaN(text)) {
					if (isRpx) {
						return Number(uni.upx2px(text));
					}
					return Number(text);
				}
				return 0;
			},
			//获取最终的touch位置
			_getCommonTouch(e) {
				let touch = null;
				if (e.touches && e.touches.length) {
					touch = e.touches[0];
				} else if (e.changedTouches && e.changedTouches.length) {
					touch = e.changedTouches[0];
				} else if (e.datail && e.datail !== {}) {
					touch = e.datail;
				} else {
					return {
						touchX: 0,
						touchY: 0
					}
				}
				return {
					touchX: touch.clientX,
					touchY: touch.clientY
				};
			},
			//判断是否要显示返回顶部按钮
			_checkShouldShowBackToTop(newVal, oldVal){
				if(!this.autoShowBackToTop){
					if(this.showBackToTopClass){
						this.showBackToTopClass = false;
					}
					return;
				}
				if(newVal !== oldVal){
					if(newVal > this.backToTopThreshold){
						if(!this.showBackToTopClass){
							this.showBackToTopClass = true;
							setTimeout(()=>{
								this.backToTopClass = 'zp-back-to-top zp-back-to-top-show';
							},300)
							
						}
					}else{
						if(this.showBackToTopClass){
							this.backToTopClass = 'zp-back-to-top zp-back-to-top-hide';
							setTimeout(()=>{
								this.showBackToTopClass = false;
							},300)
						}
					}
				}
			},
			// ------------nvue独有的方法----------------
			//列表滚动时触发
			_nOnScroll(e) {
				this.$emit('scroll', e);
				this.nListIsDragging = e.isDragging;
			},
			//下拉刷新刷新中
			_nOnRrefresh() {
				this.nRefresherLoading = true;
				this.refresherStatus = 2;
				this._doRefresherLoad();
			},
			//下拉刷新下拉中
			_nOnPullingdown(e) {
				if (this.refresherStatus === 2 || (systemInfo.platform === 'ios' && !this.nListIsDragging)) {
					return;
				}
				const viewHeight = e.viewHeight;
				const pullingDistance = e.pullingDistance;
				if (pullingDistance >= viewHeight) {
					this.refresherStatus = 1;
				} else {
					this.refresherStatus = 0;
				}
			},
			//获取nvue waterfall单项配置
			_getNvueWaterfallSingleConfig(key, defaultValue) {
				const value = this.nvueWaterfallConfig[key];
				if (value) {
					return value;
				}
				return defaultValue;
			}
		},
	};
</script>

<style scoped>
	@import "./z-paging-static.css";

	.z-paging-content,
	.zp-scroll-view {
		/* #ifndef APP-NVUE */
		width: 100%;
		height: 100%;
		/* #endif */
	}
	
	.z-paging-content{
		position: relative;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
	}
	
	.z-paging-content-fixed{
		position: fixed;
		/* #ifndef APP-NVUE */
		height: auto;
		width: auto;
		/* #endif */
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;
	}
	
	.zp-page-scroll-top{
		/* #ifndef APP-NVUE */
		width: auto; 
		/* #endif */
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 999;
	}
	
	.zp-scroll-view-flex1{
		flex: 1;
	}
	
	.zp-scroll-view-fix-height{
		height: 0px;
	}

	.zp-paging-main {
		height: 100%;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
	}

	.zp-paging-container {
		flex: 1;
		position: relative;
	}

	.zp-chat-record-loading-container {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		align-items: center;
		justify-content: center;
		height: 60rpx;
		width: 100%;
		font-size: 26rpx;
	}

	.zp-chat-record-loading-custom-image {
		width: 35rpx;
		height: 35rpx;
		/* #ifndef APP-NVUE */
		animation: loading-flower 1s linear infinite;
		/* #endif */
	}

	.zp-custom-refresher-container {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		justify-content: center;
		align-items: center;
	}
	
	.zp-back-to-top{
		width: 70rpx;
		height: 70rpx;
		z-index: 999;
		position: fixed;
		bottom: 150rpx;
		right: 30rpx;
		transition-duration: .3s;
		transition-property: opacity;
	}
	
	.zp-back-to-top-show{
		opacity: 1;
	}
	
	.zp-back-to-top-hide{
		opacity: 0;
	}
	
	.zp-back-to-top-img{
		width: 100%;
		height: 100%;
		z-index: 999;
	}

	.zp-n-refresh-container {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		justify-content: center;
		width: 750rpx;
	}
</style>
