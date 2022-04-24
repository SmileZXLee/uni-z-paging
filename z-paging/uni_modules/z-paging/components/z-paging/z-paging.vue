 <!--                        _             
  ____     _ __   __ _  __ _(_)_ __   __ _ 
 |_  /____| '_ \ / _` |/ _` | | '_ \ / _` |
  / /_____| |_) | (_| | (_| | | | | | (_| |
 /___|    | .__/ \__,_|\__, |_|_| |_|\__, |
          |_|          |___/         |___/ 
v2.2.4 (2022-04-24)
by ZXLee
-->
<!-- API文档地址：https://z-paging.zxlee.cn -->
<!-- github地址:https://github.com/SmileZXLee/uni-z-paging -->
<!-- dcloud地址:https://ext.dcloud.net.cn/plugin?id=3935 -->
<!-- 反馈QQ群：790460711 -->

<template name="z-paging">
	<!-- #ifndef APP-NVUE -->
	<view :class="!usePageScroll&&fixed?'z-paging-content z-paging-content-fixed':'z-paging-content'" :style="[finalPagingStyle]">
		<!-- #ifndef APP-PLUS -->
		<view v-if="cssSafeAreaInsetBottom===-1" class="zp-safe-area-inset-bottom"></view>
		<!-- #endif -->
		<!-- 顶部固定的slot -->
		<slot v-if="!usePageScroll&&$slots.top" name="top" />
		<view class="zp-page-top" v-else-if="usePageScroll&&$slots.top" :style="[{'top':`${windowTop}px`,'z-index':topZIndex}]">
			<slot name="top" />
		</view>
		<view :class="{'zp-view-super':true,'zp-scroll-view-super':!usePageScroll}" :style="[finalScrollViewStyle]">
			<view v-if="$slots.left" class="zp-page-left">
				<slot name="left" />
			</view>
			<view class="zp-scroll-view-container">
				<scroll-view
					ref="zp-scroll-view" :class="{'zp-scroll-view':true,'zp-scroll-view-absolute':!usePageScroll,'zp-scroll-view-hide-scrollbar':!showScrollbar}"
					:scroll-top="scrollTop" :scroll-x="scrollX"
					:scroll-y="scrollable&&!usePageScroll&&scrollEnable&&(refresherCompleteScrollable?true:refresherStatus!==3)" :enable-back-to-top="finalEnableBackToTop"
					:show-scrollbar="showScrollbar" :scroll-with-animation="finalScrollWithAnimation"
					:scroll-into-view="scrollIntoView" :lower-threshold="finalLowerThreshold" :upper-threshold="5"
					:refresher-enabled="finalRefresherEnabled&&!useCustomRefresher" :refresher-threshold="finalRefresherThreshold"
					:refresher-default-style="finalRefresherDefaultStyle" :refresher-background="refresherBackground"
					:refresher-triggered="finalRefresherTriggered" @scroll="_scroll" @scrolltolower="_onLoadingMore('toBottom')"
					@scrolltoupper="_scrollToUpper" @refresherrestore="_onRestore" @refresherrefresh="_onRefresh(true)">	
					<view class="zp-paging-touch-view"
					<!-- #ifndef APP-VUE || MP-WEIXIN || MP-QQ  || H5 -->
					@touchstart="_refresherTouchstart" @touchmove="_refresherTouchmove" @touchend="_refresherTouchend" @touchcancel="_refresherTouchend"
					<!-- #endif -->
					<!-- #ifdef APP-VUE || MP-WEIXIN || MP-QQ || H5 -->
					@touchstart="pagingWxs.touchstart" @touchmove="pagingWxs.touchmove" @touchend="pagingWxs.touchend" @touchcancel="pagingWxs.touchend"
					@mousedown="pagingWxs.mousedown" @mousemove="pagingWxs.mousemove" @mouseup="pagingWxs.mouseup" @mouseleave="pagingWxs.mouseleave"
					<!-- #endif -->
					>	
						<view v-if="finalRefresherFixedBacHeight>0" class="zp-fixed-bac-view" :style="[{'background': refresherFixedBackground,'height': `${finalRefresherFixedBacHeight}px`}]"></view>
						<view class="zp-paging-main" :style="[scrollViewInStyle,{'transform': finalRefresherTransform,'transition': refresherTransition}]"
						<!-- #ifdef APP-VUE || MP-WEIXIN || MP-QQ || H5 -->
						:change:prop="pagingWxs.propObserver" :prop="wxsPropType"
						:data-refresherThreshold="finalRefresherThreshold" :data-isIos="isIos"
						:data-loading="loading||isRefresherInComplete" :data-useChatRecordMode="useChatRecordMode" 
						:data-refresherEnabled="refresherEnabled" :data-useCustomRefresher="useCustomRefresher" :data-pageScrollTop="wxsPageScrollTop"
						:data-scrollTop="wxsScrollTop" :data-refresherMaxAngle="refresherMaxAngle" 
						:data-refresherAecc="refresherAngleEnableChangeContinued" :data-usePageScroll="usePageScroll"
						:data-oldIsTouchmoving="isTouchmoving" :data-refresherOutRate="finalRefresherOutRate" :data-hasTouchmove="hasTouchmove"
						<!-- #endif -->
						<!-- #ifdef APP-VUE || H5 -->
						:change:renderPropScrollTop="pagingRenderjs.renderPropScrollTopChange" :renderPropScrollTop="renderPropScrollTop"
						:change:renderPropUsePageScroll="pagingRenderjs.renderPropUsePageScrollChange" :renderPropUsePageScroll="renderPropUsePageScroll"
						<!-- #endif -->
						>	
							<view v-if="showRefresher" class="zp-custom-refresher-view" :style="[{'margin-top': `-${finalRefresherThreshold}px`,'background': refresherBackground}]">
								<view class="zp-custom-refresher-container" :style="[{'height': `${finalRefresherThreshold}px`,'background': refresherBackground}]">
									<!-- 下拉刷新view -->
									<view class="zp-custom-refresher-slot-view">
										<slot v-if="!($slots.refresherComplete&&refresherStatus===3)" :refresherStatus="refresherStatus" name="refresher" />
									</view>
									<slot v-if="$slots.refresherComplete&&refresherStatus===3" name="refresherComplete" />
									<z-paging-refresh ref="refresh" v-else-if="!showCustomRefresher" :style="[{'height': `${finalRefresherThreshold}px`}]" :status="refresherStatus"
										:defaultThemeStyle="finalRefresherThemeStyle" :defaultText="finalRefresherDefaultText"
										:pullingText="finalRefresherPullingText" :refreshingText="finalRefresherRefreshingText" :completeText="finalRefresherCompleteText"
										:showUpdateTime="showRefresherUpdateTime" :updateTimeKey="refresherUpdateTimeKey"
										:imgStyle="refresherImgStyle" :titleStyle="refresherTitleStyle" :updateTimeStyle="refresherUpdateTimeStyle" />
								</view>
							</view>
							<view class="zp-paging-container">
								<slot v-if="useChatRecordMode&&$slots.chatLoading&&loadingStatus!==2&&realTotalData.length" name="chatLoading" />
								<view v-else-if="useChatRecordMode&&loadingStatus!==2&&realTotalData.length" class="zp-chat-record-loading-container">
									<text v-if="loadingStatus!==1" @click="_scrollToUpper()"
										:class="defaultThemeStyle==='white'?'zp-loading-more-text zp-loading-more-text-white':'zp-loading-more-text zp-loading-more-text-black'">{{chatRecordLoadingMoreText}}</text>
									<image v-else :src="base64Flower" class="zp-chat-record-loading-custom-image" />
								</view>
								<!-- 全屏Loading -->
								<slot v-if="$slots.loading&&showLoading&&!loadingFullFixed" name="loading" />
								<!-- 主体内容 -->
								<view class="zp-paging-container-content" :style="[finalPagingContentStyle]">
									<slot />
									<!-- 上拉加载更多view -->
									<!-- #ifndef MP-ALIPAY -->
									<slot v-if="_showLoadingMore('Default')" name="loadingMoreDefault" />
									<slot v-else-if="_showLoadingMore('Loading')" name="loadingMoreLoading" />
									<slot v-else-if="_showLoadingMore('NoMore')" name="loadingMoreNoMore" />
									<slot v-else-if="_showLoadingMore('Fail')" name="loadingMoreFail" />
									<z-paging-load-more @click.native="_onLoadingMore('click')" v-else-if="_showLoadingMore('Custom')" :zConfig="zPagingLoadMoreConfig" />
									<!-- #endif -->
									<!-- #ifdef MP-ALIPAY -->
									<slot v-if="loadingStatus===0&&$slots.loadingMoreDefault&&showLoadingMore&&loadingMoreEnabled&&!useChatRecordMode" name="loadingMoreDefault" />
									<slot v-else-if="loadingStatus===1&&$slots.loadingMoreLoading&&showLoadingMore&&loadingMoreEnabled" name="loadingMoreLoading" />
									<slot v-else-if="loadingStatus===2&&$slots.loadingMoreNoMore&&showLoadingMore&&showLoadingMoreNoMoreView&&loadingMoreEnabled&&!useChatRecordMode" name="loadingMoreNoMore" />
									<slot v-else-if="loadingStatus===3&&$slots.loadingMoreFail&&showLoadingMore&&loadingMoreEnabled&&!useChatRecordMode" name="loadingMoreFail" />
									<z-paging-load-more @click.native="_onLoadingMore('click')" v-else-if="showLoadingMore&&showDefaultLoadingMoreText&&!(loadingStatus===2&&!showLoadingMoreNoMoreView)&&loadingMoreEnabled&&!useChatRecordMode" :zConfig="zPagingLoadMoreConfig" />
									<!-- #endif -->
								</view>
								<!-- 空数据图 -->
								<view :class="{'zp-empty-view':true,'zp-empty-view-center':emptyViewCenter}" :style="[{emptyViewSuperStyle}]" v-if="showEmpty">
									<slot v-if="$slots.empty" name="empty" />
									<z-paging-empty-view v-else :emptyViewImg="finalEmptyViewImg" :emptyViewText="finalEmptyViewText" :showEmptyViewReload="finalShowEmptyViewReload" 
									:emptyViewReloadText="finalEmptyViewReloadText" :isLoadFailed="isLoadFailed" :emptyViewStyle="emptyViewStyle" :emptyViewTitleStyle="emptyViewTitleStyle" 
									:emptyViewImgStyle="emptyViewImgStyle" :emptyViewReloadStyle="emptyViewReloadStyle" :emptyViewZIndex="emptyViewZIndex" :emptyViewFixed="emptyViewFixed" 
									@reload="_emptyViewReload" />
								</view>
							</view>
						</view>
					</view>
				</scroll-view>
			</view>
			<view v-if="$slots.right" class="zp-page-right">
				<slot name="right" />
			</view>
		</view>
		<!-- 底部固定的slot -->
		<slot v-if="!usePageScroll&&$slots.bottom" name="bottom" />
		<view class="zp-page-bottom" v-else-if="usePageScroll&&$slots.bottom" :style="[{'bottom': `${windowBottom}px`}]">
			<slot name="bottom" />
		</view>
		<!-- 点击返回顶部view -->
		<view v-if="showBackToTopClass" :class="backToTopClass" :style="[finalBackToTopStyle]" @click.stop="_backToTopClick">
			<slot v-if="$slots.backToTop" name="backToTop" />
			<image v-else class="zp-back-to-top-img" :src="backToTopImg.length?backToTopImg:base64BackToTop" />
		</view>
		<!-- 全屏Loading(铺满z-paging并固定) -->
		<view v-if="$slots.loading&&showLoading&&loadingFullFixed" class="zp-loading-fixed">
			<slot name="loading" />
		</view>
	</view>
	<!-- #endif -->
	<!-- #ifdef APP-NVUE -->
	<view :is="finalNvueSuperListIs" :style="[finalPagingStyle]" :class="{'z-paging-content-fixed':fixed&&!usePageScroll}" :scrollable="false">
		<!-- 顶部固定的slot -->
		<view ref="zp-page-top" :is="nViewIs" class="zp-page-top" v-if="$slots.top" :style="[{'top':`${windowTop}px`,'z-index':topZIndex}]">
			<slot name="top" />
		</view>
		<view :is="finalNvueSuperListIs" class="zp-n-list-container" :scrollable="false">
			<view v-if="$slots.left" class="zp-page-left" :style="[{'marginTop':scrollViewStyle.marginTop,'marginBottom':scrollViewStyle.marginBottom}]">
				<slot name="left" />
			</view>
			<view ref="zp-n-list" :id="nvueListId" :style="[{'flex': 1,'top':isIos?'0px':'-1px'},scrollViewStyle,useChatRecordMode ? {transform: nIsFirstPageAndNoMore?'rotate(0deg)':'rotate(180deg)'}:{}]" :is="finalNvueListIs" alwaysScrollableVertical="true"
				:fixFreezing="nFixFreezing" :show-scrollbar="showScrollbar&&!useChatRecordMode" :loadmoreoffset="finalLowerThreshold" :enable-back-to-top="enableBackToTop"
				:scrollable="scrollable&&scrollEnable&&(refresherCompleteScrollable?true:refresherStatus!==3)" :bounce="nvueBounce" :column-count="nWaterfallColumnCount" :column-width="nWaterfallColumnWidth"
				:column-gap="nWaterfallColumnGap" :left-gap="nWaterfallLeftGap" :right-gap="nWaterfallRightGap"
				@loadmore="_nOnLoadmore" @scroll="_nOnScroll">
				<refresh class="zp-n-refresh" :style="[nvueRefresherStyle]" v-if="finalNvueRefresherEnabled" :display="nRefresherLoading?'show':'hide'" @refresh="_nOnRrefresh" @pullingdown="_nOnPullingdown">
					<view ref="zp-n-refresh-container" class="zp-n-refresh-container" :style="[{background:refresherBackground,width:nRefresherWidth}]" id="zp-n-refresh-container">
						<!-- 下拉刷新view -->
						<slot v-if="zScopedSlots.refresherComplete&&refresherStatus===3" name="refresherComplete" />
						<slot v-else-if="zScopedSlots.refresher" :refresherStatus="refresherStatus" name="refresher" />
						<z-paging-refresh ref="refresh" v-else :status="refresherStatus" :defaultThemeStyle="finalRefresherThemeStyle"
							:defaultText="finalRefresherDefaultText" :pullingText="finalRefresherPullingText" :refreshingText="finalRefresherRefreshingText" :completeText="finalRefresherCompleteText"
							:showUpdateTime="showRefresherUpdateTime" :updateTimeKey="refresherUpdateTimeKey"
							:imgStyle="refresherImgStyle" :titleStyle="refresherTitleStyle" :updateTimeStyle="refresherUpdateTimeStyle" />
					</view>
				</refresh>
				<view ref="zp-n-list-top-tag" class="zp-n-list-top-tag" style="margin-top: -1rpx;" :style="[{height:finalNvueRefresherEnabled?'0px':'1px'}]" :is="nViewIs"></view>
				<view v-if="nShowRefresherReveal" ref="zp-n-list-refresher-reveal" :style="[{transform:`translateY(-${nShowRefresherRevealHeight}px)`,height:'0px'},{background:refresherBackground}]" :is="nViewIs">
					<!-- 下拉刷新view -->
					<slot v-if="zScopedSlots.refresherComplete&&refresherStatus===3" name="refresherComplete" />
					<slot v-else-if="zScopedSlots.refresher" :refresherStatus="refresherStatus" name="refresher" />
					<z-paging-refresh ref="refresh" v-else :status="refresherStatus" :defaultThemeStyle="finalRefresherThemeStyle"
						:defaultText="finalRefresherDefaultText" :pullingText="finalRefresherPullingText" :refreshingText="finalRefresherRefreshingText" :completeText="finalRefresherCompleteText" 
						:showUpdateTime="showRefresherUpdateTime" :updateTimeKey="refresherUpdateTimeKey"
						:imgStyle="refresherImgStyle" :titleStyle="refresherTitleStyle" :updateTimeStyle="refresherUpdateTimeStyle" />
				</view>
				<slot />
				<!-- 全屏Loading -->
				<view :class="{'z-paging-content-fixed':usePageScroll}" style="flex: 1;" :style="[useChatRecordMode ? {transform: nIsFirstPageAndNoMore?'rotate(0deg)':'rotate(180deg)'}:{}]" v-if="$slots.loading&&showLoading&&!loadingFullFixed" :is="nViewIs">
					<slot name="loading" />
				</view>
				<!-- 空数据图 -->
				<view class="z-paging-empty-view" :class="{'z-paging-content-fixed':usePageScroll}" style="flex: 1;" :style="[emptyViewSuperStyle,useChatRecordMode ? {transform: nIsFirstPageAndNoMore?'rotate(0deg)':'rotate(180deg)'}:{}]" v-if="showEmpty" :is="nViewIs">
					<view :class="{'zp-empty-view':true,'zp-empty-view-center':emptyViewCenter}">
						<slot v-if="$slots.empty" name="empty" />
						<z-paging-empty-view v-else :emptyViewImg="finalEmptyViewImg" :emptyViewText="finalEmptyViewText" :showEmptyViewReload="finalShowEmptyViewReload" 
						:emptyViewReloadText="finalEmptyViewReloadText" :isLoadFailed="isLoadFailed" :emptyViewStyle="emptyViewStyle" :emptyViewTitleStyle="emptyViewTitleStyle" 
						:emptyViewImgStyle="emptyViewImgStyle" :emptyViewReloadStyle="emptyViewReloadStyle" :emptyViewZIndex="emptyViewZIndex" :emptyViewFixed="emptyViewFixed" 
						@reload="_emptyViewReload" />
					</view>
				</view>
				<view v-if="!hideNvueBottomTag" ref="zp-n-list-bottom-tag" class="zp-n-list-bottom-tag" is="header"></view>
				<!-- 上拉加载更多view -->
				<view :is="nViewIs" v-if="!refresherOnly&&loadingMoreEnabled">
					<view v-if="useChatRecordMode">
						<view v-if="loadingStatus!==2&&realTotalData.length">
							<slot v-if="$slots.chatLoading" name="chatLoading" />
							<view v-else class="zp-chat-record-loading-container">
								<text v-if="loadingStatus!==1" @click="_scrollToUpper()"
									:class="defaultThemeStyle==='white'?'zp-loading-more-text zp-loading-more-text-white':'zp-loading-more-text zp-loading-more-text-black'">{{chatRecordLoadingMoreText}}</text>
								<view>
									<loading-indicator v-if="loadingStatus===1" class="zp-line-loading-image" animating />
								</view>
							</view>
						</view>
					</view>
					<view :style="nLoadingMoreFixedHeight?{height:loadingMoreCustomStyle&&loadingMoreCustomStyle.height?loadingMoreCustomStyle.height:'80rpx'}:{}">
						<slot v-if="_showLoadingMore('Default')" name="loadingMoreDefault" />
						<slot v-else-if="_showLoadingMore('Loading')" name="loadingMoreLoading" />
						<slot v-else-if="_showLoadingMore('NoMore')" name="loadingMoreNoMore" />
						<slot v-else-if="_showLoadingMore('Fail')" name="loadingMoreFail" />
						<z-paging-load-more @click.native="_onLoadingMore('click')" v-else-if="_showLoadingMore('Custom')" :zConfig="zPagingLoadMoreConfig" />
					</view>
				</view>
			</view>
			<view v-if="$slots.right" class="zp-page-right">
				<slot name="right" />
			</view>
		</view>
		<!-- 底部固定的slot -->
		<slot name="bottom" />
		<!-- 点击返回顶部view -->
		<view v-if="showBackToTopClass" :class="backToTopClass" :style="[finalBackToTopStyle]" @click.stop="_backToTopClick">
			<slot v-if="$slots.backToTop" name="backToTop" />
			<image v-else class="zp-back-to-top-img" :src="backToTopImg.length?backToTopImg:base64BackToTop" />
		</view>
		<!-- 全屏Loading(铺满z-paging并固定) -->
		<view v-if="$slots.loading&&showLoading&&loadingFullFixed" class="zp-loading-fixed">
			<slot name="loading" />
		</view>
	</view>
	<!-- #endif -->
</template>
<!-- #ifdef APP-VUE || MP-WEIXIN || MP-QQ || H5 -->
<script src="./wxs/z-paging-wxs.wxs" module="pagingWxs" lang="wxs"></script>
<!-- #endif -->
<script module="pagingRenderjs" lang="renderjs">
	import pagingRenderjs from './wxs/z-paging-renderjs.js';
	/**
	 * z-paging 分页组件
	 * @description 【uni-app自动分页器】超简单，低耦合！仅需两步轻松完成完整分页逻辑(下拉刷新、上拉加载更多)，分页全自动处理。支持自定义加载更多的文字或整个view，自定义下拉刷新样式，自动管理空数据view等。
	 * @tutorial https://z-paging.zxlee.cn
	 * @property {Number|String} default-page-no 自定义初始的pageNo，默认为1
	 * @property {Number|String} default-page-size 自定义pageSize，默认为10
	 * @property {Number|Object} data-key 为保证数据一致，设置当前tab切换时的标识key，并在complete中传递相同key，若二者不一致，则complete将不会生效
	 * @property {String} autowire-list-name 【极简写法】自动注入的list名，可自动修改父view(包含ref="paging")中对应name的list值(z-paging标签必须设置`ref="paging"`)
	 * @property {String} autowire-query-name 【极简写法】自动注入的query名，可自动调用父view(包含ref="paging")中的query方法(z-paging标签必须设置`ref="paging"`)
	 * @property {Number|String} delay 调用complete后延迟处理的时间，单位为毫秒
	 * @property {Number|String} min-delay 触发@query后最小延迟处理的时间，单位为毫秒，默认0毫秒，优先级低于delay（假设设置为300毫秒，若分页请求时间小于300毫秒，则在调用complete后延迟[300毫秒-请求时长]；若请求时长大于300毫秒，则不延迟），当show-refresher-when-reload为true或reload(true)时，其最小值为400
	 * @property {String} language i18n国际化设置语言，支持简体中文(zh-cn)、繁体中文(zh-hant-cn)和英文(en)
	 * @property {Boolean} follow-system-language i18n国际化默认是否跟随系统语言，默认为是
	 * @property {Object} paging-style 设置z-paging的style，部分平台(如微信小程序)无法直接修改组件的style，可使用此属性代替
	 * @property {String} height z-paging的高度，优先级低于pagingStyle中设置的height，传字符串，如100px、100rpx、100%
	 * @property {String} width z-paging的宽度，优先级低于pagingStyle中设置的width，传字符串，如100px、100rpx、100%
	 * @property {String} bg-color z-paging的背景色，优先级低于pagingStyle中设置的background。传字符串，如"#ffffff"
	 * @property {Object} paging-content-style 设置z-paging的容器(插槽的父view)的style
	 * @property {Boolean} auto-height z-paging是否自动高度，若自动高度则会自动铺满屏幕，默认为否
	 * @property {Number|String} auto-height-addition z-paging是否自动高度时，附加的高度，注意添加单位px或rpx，默认为px，若需要减少高度，请传负数
	 * @property {String} default-theme-style loading(下拉刷新、上拉加载更多)的主题样式，支持black，white，默认black
	 * @property {String} refresher-theme-style 下拉刷新的主题样式，支持black，white，默认black
	 * @property {Object} refresher-img-style 自定义下拉刷新中左侧图标的样式
	 * @property {Object} refresher-title-style 自定义下拉刷新中右侧状态描述文字的样式
	 * @property {Object} refresher-update-time-style 自定义下拉刷新中右侧最后更新时间文字的样式(show-refresher-update-time为true时有效)
	 * @property {Boolean} watch-refresher-touchmove 在微信小程序和QQ小程序中，是否实时监听下拉刷新中进度，默认为否
	 * @property {String} loading-more-theme-style 底部加载更多的主题样式，支持black，white，默认black
	 * @property {Boolean} refresher-only 是否只使用下拉刷新，设置为true后将关闭mounted自动请求数据、关闭滚动到底部加载更多，强制隐藏空数据图。默认为否
	 * @property {Number|String} refresher-complete-delay 自定义下拉刷新结束以后延迟回弹的时间，单位为毫秒，默认为0
	 * @property {Number|String} refresher-complete-duration 自定义下拉刷新结束回弹动画时间，单位为毫秒，默认为300毫秒(refresherEndBounceEnabled为false时，refresherCompleteDuration为设定值的1/3)，nvue无效
	 * @property {Boolean} refresher-complete-scrollable 自定义下拉刷新结束状态下是否允许列表滚动，默认为否
	 * @property {Boolean} use-page-scroll 使用页面滚动，默认为否，当设置为是时则使用页面的滚动而非此组件内部的scroll-view的滚动，使用页面滚动时z-paging无需设置确定的高度且对于长列表展示性能更高，但配置会略微繁琐
	 * @property {Boolean} use-virtual-list 是否使用虚拟列表，默认为否
	 * @property {Boolean} fixed z-paging是否使用fixed布局，若使用fixed布局，则z-paging的父view无需固定高度，z-paging高度默认为100%，默认为是(当使用内置scroll-view滚动时有效)
	 * @property {Boolean} safe-area-inset-bottom 是否开启底部安全区域适配，默认为否
	 * @property {Boolean} scrollable 是否可以滚动，使用内置scroll-view和nvue时有效，默认为是
	 * @property {Boolean} auto [z-paging]mounted后是否自动调用reload方法(mounted后自动调用接口)，默认为是
	 * @property {Boolean} reload-when-refresh 用户下拉刷新时是否触发reload方法，默认为是
	 * @property {Boolean} auto-scroll-to-top-when-reload reload时是否自动滚动到顶部，默认为是
	 * @property {Boolean} auto-clean-list-when-reload reload时是否立即自动清空原list，默认为是，若立即自动清空，则在reload之后、请求回调之前页面是空白的
	 * @property {Boolean} show-refresher-when-reload 列表刷新时是否自动显示下拉刷新view，默认为否
	 * @property {Boolean} show-loading-more-when-reload 列表刷新时自动显示加载更多view，且为加载中状态(仅初始设置有效，不可动态修改)
	 * @property {Boolean} refresher-update-time-key 如果需要区别不同页面的最后更新时间，请为不同页面的z-paging的`refresher-update-time-key`设置不同的字符串
	 * @property {Boolean} use-custom-refresher 是否使用自定义的下拉刷新，默认为是，即使用z-paging的下拉刷新。设置为false即代表使用uni scroll-view自带的下拉刷新，h5、App、微信小程序以外的平台不支持uni scroll-view自带的下拉刷新
	 * @property {Number|String} refresher-fps 自定义下拉刷新下拉帧率，默认为40，过高可能会出现抖动问题
	 * @property {Number|String} refresher-max-angle 自定义下拉刷新允许触发的最大下拉角度，默认为40度，当下拉角度小于设定值时，自定义下拉刷新动画不会被触发
	 * @property {Boolean} refresher-angle-enable-change-continued 自定义下拉刷新的角度由未达到最大角度变到达到最大角度时，是否继续下拉刷新手势，默认为否
	 * @property {String|Object} refresher-default-text 自定义下拉刷新默认状态下的文字
	 * @property {String|Object} refresher-pulling-text 自定义下拉刷新松手立即刷新状态下的文字
	 * @property {String|Object} refresher-refreshing-text 自定义下拉刷新刷新中状态下的文字
	 * @property {String|Object} refresher-complete-text 自定义下拉刷新刷新结束状态下的文字
	 * @property {Boolean} refresher-end-bounce-enabled 是否开启自定义下拉刷新刷新结束回弹效果，默认为是
	 * @property {Object} loading-more-custom-style 自定义底部加载更多样式
	 * @property {Object} loading-more-loading-icon-custom-style 自定义底部加载更多加载中动画样式
	 * @property {String} loading-more-loading-icon-type 自定义底部加载更多加载中动画图标类型，可选circle或flower，默认为circle
	 * @property {String} loading-more-loading-icon-custom-image 自定义底部加载更多加载中动画图标图片
	 * @property {Boolean} loading-more-loading-animated 底部加载更多加载中view是否展示旋转动画(loading-more-loading-icon-custom-image有值时有效，nvue无效)
	 * @property {Boolean} loading-more-enabled 是否启用加载更多数据(含滑动到底部加载更多数据和点击加载更多数据)，默认为是
	 * @property {Boolean} to-bottom-loading-more-enabled 是否启用滑动到底部加载更多数据
	 * @property {String|Object} loading-more-default-text 滑动到底部"默认"文字，默认为【点击加载更多】
	 * @property {String|Object} loading-more-loading-text 滑动到底部"加载中"文字，默认为【正在加载...】
	 * @property {String|Object} loading-more-no-more-text 滑动到底部"没有更多"文字，默认为【没有更多了】
	 * @property {String|Object} loading-more-fail-text 滑动到底部"加载失败"文字，默认为【加载失败，点击重新加载】
	 * @property {Boolean} hide-loading-more-when-no-more-and-inside-of-paging 当没有更多数据且分页内容未超出z-paging时是否隐藏没有更多数据的view，默认为是
	 * @property {Boolean} hide-loading-more-when-no-more-and-inside-of-paging 当没有更多数据且分页内容未超出z-paging时是否隐藏没有更多数据的view，默认为是
	 * @property {Boolean} inside-more 当分页未满一屏时，是否自动加载更多(nvue无效)，默认为否
	 * @property {Boolean} show-default-loading-more-text 是否显示默认的加载更多text，默认为是
	 * @property {Boolean} show-loading-more-no-more-line 是否显示没有更多数据的分割线，默认为是
	 * @property {Object} loading-more-no-more-line-custom-style 自定义底部没有更多数据的分割线样式
	 * @property {Boolean} hide-empty-view 是否强制隐藏空数据图，默认为否
	 * @property {String|Object} empty-view-text 空数据图描述文字，默认为“没有数据哦~”
	 * @property {Boolean} show-empty-view-reload 是否显示空数据图重新加载按钮(无数据时)，默认为否
	 * @property {Boolean} show-empty-view-reload-when-error 加载失败时是否显示空数据图重新加载按钮，默认为是
	 * @property {String} empty-view-img 空数据图图片，默认使用z-paging内置的图片
	 * @property {String|Object} empty-view-reload-text 空数据图点击重新加载文字
	 * @property {String|Object} empty-view-error-text 空数据图“加载失败”描述文字
	 * @property {String} empty-view-error-img 空数据图“加载失败”图片，默认使用z-paging内置的图片(建议使用绝对路径)
	 * @property {Object} empty-view-style 空数据图样式
	 * @property {Object} empty-view-super-style 空数据图容器样式
	 * @property {Object} empty-view-img-style 空数据图img样式
	 * @property {Object} empty-view-title-style 空数据图描述文字样式
	 * @property {Object} empty-view-reload-style 空数据图重新加载按钮样式
	 * @property {Boolean} empty-view-fixed 空数据图片是否铺满z-paging，默认为是。若设置为否，则为填充满z-paging的剩余部分
	 * @property {Boolean} empty-view-center 空数据图片是否垂直居中，默认为是。emptyViewFixed为false时有效
	 * @property {Boolean} auto-hide-empty-view-when-loading 加载中时是否自动隐藏空数据图，默认为是
	 * @property {Boolean} auto-hide-empty-view-when-pull 用户下拉列表触发下拉刷新加载中时是否自动隐藏空数据图，默认为是
	 * @property {Boolean} auto-hide-loading-after-first-loaded 第一次加载后是否自动隐藏loading slot，默认为是
	 * @property {Boolean} loading-full-fixed loading slot是否铺满屏幕并固定，默认为否
	 * @property {Boolean} auto-show-back-to-top 自动显示点击返回顶部按钮，默认为否
	 * @property {Number|String} back-to-top-threshold 点击返回顶部按钮显示/隐藏的阈值(滚动距离)，单位为px，默认为400rpx
	 * @property {String} back-to-top-img 点击返回顶部按钮的自定义图片地址，默认使用z-paging内置的图片
	 * @property {Boolean} back-to-top-with-animate 点击返回顶部按钮返回到顶部时是否展示过渡动画，默认为是
	 * @property {Number|String} back-to-top-bottom 点击返回顶部按钮与底部的距离，注意添加单位px或rpx，默认为160rpx
	 * @property {Object} back-to-top-style 点击返回顶部按钮的自定义样式
	 * @property {Boolean} show-scrollbar 控制是否出现滚动条，默认为是
	 * @property {Boolean} scroll-x 是否允许横向滚动，默认为否
	 * @property {Boolean} scroll-to-top-bounce-enabled iOS设备上滚动到顶部时是否允许回弹效果，默认为否。关闭回弹效果后可使滚动到顶部与下拉刷新更连贯，但是有吸顶view时滚动到顶部时可能出现抖动。
	 * @property {Boolean} scroll-with-animation 控制是否出现滚动条，默认为否
	 * @property {String} scroll-into-view 值应为某子元素id（id不能以数字开头）。设置哪个方向可滚动，则在哪个方向滚动到该元素
	 * @property {Number|String} lower-threshold 距底部/右边多远时（单位px），触发 scrolltolower 事件，默认为100rpx
	 * @property {Boolean} enable-back-to-top iOS点击顶部状态栏、安卓双击标题栏时，滚动条返回顶部，只支持竖向，默认为是
	 * @property {Boolean} refresher-enabled 是否开启自定义下拉刷新，默认为是
	 * @property {Number|String} refresher-threshold 设置自定义下拉刷新阈值，默认为80rpx
	 * @property {String} refresher-default-style 设置自定义下拉刷新默认样式，支持设置 black，white，none，none 表示不使用默认样式，默认为black
	 * @property {String} refresher-background 设置自定义下拉刷新区域背景颜色
	 * @property {Boolean} show-refresher-update-time 是否显示上次下拉刷新更新时间，默认为否
	 * @property {String} refresher-update-time-key 上次下拉刷新更新时间的key，用于区别不同的上次更新时间
	 * @property {Number|String} local-paging-loading-time 本地分页时上拉加载更多延迟时间，单位为毫秒，默认200毫秒
	 * @property {Boolean} use-chat-record-mode 使用聊天记录模式，默认为否
	 * @property {Number} top-z-index slot="top"的view的z-index，仅使用页面滚动时有效，默认为99
	 * @property {Number} super-content-z-index z-paging内容容器父view的z-index，默认为1
	 * @property {Number} content-z-index z-paging内容容器部分的z-index，默认为10
	 * @property {Number} empty-view-z-index 空数据view的z-index，默认为9
	 * @property {Boolean} auto-full-height 使用页面滚动时，是否在不满屏时自动填充满屏幕，默认为是
	 * @property {Boolean} concat 自动拼接complete中传过来的数组(使用聊天记录模式时无效)，默认为是
	 * @property {String} nvue-list-is nvue中修改列表类型，可选值有list、waterfall和scroller，默认为list
	 * @property {Object} nvue-waterfall-config nvue waterfall配置，仅在nvue中且nvueListIs=waterfall时有效，配置参数详情参见：https://uniapp.dcloud.io/component/waterfall
	 * @property {Boolean} nvue-bounce nvue 控制是否回弹效果，iOS不支持动态修改(若禁用回弹效果，下拉刷新将失效)，默认为是
	 * @property {Boolean} nvue-fast-scroll nvue中通过代码滚动到顶部/底部时，是否加快动画效果(无滚动动画时无效)，默认为否
	 * @property {String} nvue-list-id nvue中list的id
	 * @property {Object} nvue-refresher-style nvue中refresh组件的样式
	 * @property {Boolean} hide-nvue-bottom-tag 是否隐藏nvue列表底部的tagView，此view用于标识滚动到底部位置，若隐藏则滚动到底部功能将失效，在nvue中实现吸顶+swiper功能时需将最外层z-paging的此属性设置为true。默认为否
	 * @property {Boolean} show-console-error 是否将错误信息打印至控制台，默认为是
	 * @event {Function} query 下拉刷新或滚动到底部时会自动触发此方法。z-paging加载时也会触发(若要禁止，请设置:auto="false")。pageNo和pageSize会自动计算好，直接传给服务器即可。
	 * @event {Function} refresherStatusChange 自定义下拉刷新状态改变(use-custom-refresher为true时生效)【注：通过`:refresher-status.sync`绑定当前data中的指定变量亦可】
	 * @event {Function} loadingStatusChange 上拉加载更多状态改变
	 * @event {Function} refresherTouchstart 自定义下拉刷新下拉开始(use-custom-refresher为true时生效)【注：当需要更细致定制自定义下拉刷新时使用，如果只需监听下拉刷新各个状态改变，使用`refresherStatusChange`即可】
	 * @event {Function} refresherTouchmove 自定义下拉刷新下拉中开始(use-custom-refresher为true时生效)【注：当需要更细致定制自定义下拉刷新时使用，如果只需监听下拉刷新各个状态改变，使用`refresherStatusChange`即可】
	 * @event {Function} refresherTouchend 自定义下拉刷新下拉结束(use-custom-refresher为true时生效)【注：当需要更细致定制自定义下拉刷新时使用，如果只需监听下拉刷新各个状态改变，使用`refresherStatusChange`即可】
	 * @event {Function} onRefresh 自定义下拉刷新被触发
	 * @event {Function} onRestore 自定义下拉刷新被复位
	 * @event {Function} scroll `z-paging`内置的scroll-view滚动时触发
	 * @event {Function} scrollTopChange scrollTop改变时触发，使用点击返回顶部时需要获取scrollTop时可使用此事件【注：通过`:scroll-top.sync`绑定当前data中的指定变量亦可】(@scrolltoupper触发时，也会自动触发此方法，且scrollTop=0)
	 * @event {Function} scrolltolower `z-paging`内置的scroll-view滚动底部时触发
	 * @event {Function} scrolltoupper `z-paging`内置的scroll-view滚动顶部时触发
	 * @event {Function} listChange 分页渲染的数组改变时触发
	 * @event {Function} emptyViewReload 点击了空数据图中的重新加载按钮
	 * @example <z-paging ref="paging" v-model="dataList" @query="queryList"></z-paging>
	 */
	export default {
		name:"z-paging",
		// #ifdef APP-VUE || H5
		mixins: [pagingRenderjs],
		// #endif
	}
</script>
<script src="./js/z-paging-main.js" />
	
<style scoped>
	@import "./css/z-paging-main.css";
	@import "./css/z-paging-static.css";
</style>
