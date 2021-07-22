 <!--                        _             
  ____     _ __   __ _  __ _(_)_ __   __ _ 
 |_  /____| '_ \ / _` |/ _` | | '_ \ / _` |
  / /_____| |_) | (_| | (_| | | | | | (_| |
 /___|    | .__/ \__,_|\__, |_|_| |_|\__, |
          |_|          |___/         |___/ 
V1.9.4
by ZXLee 2021-07-21
-- >
<!-- API文档地址：http://z-paging.com -->
<!-- github地址:https://github.com/SmileZXLee/uni-z-paging -->
<!-- dcloud地址:https://ext.dcloud.net.cn/plugin?id=3935 -->
<!-- 反馈QQ群：790460711 -->

<template name="z-paging">
	<!-- #ifndef APP-NVUE -->
	<view :class="!usePageScroll&&fixed?'z-paging-content z-paging-content-fixed':'z-paging-content'"
		:style="[finalPagingStyle]">
		<!-- 顶部固定的slot -->
		<slot v-if="!usePageScroll&&$slots.top" name="top"></slot>
		<view class="zp-page-scroll-top" v-else-if="usePageScroll&&$slots.top" :style="[{'top':`${windowTop}px`,'z-index':topZIndex}]">
			<slot name="top"></slot>
		</view>
		<view :class="{'zp-scroll-view-super':!usePageScroll}" :style="[finalScrollViewStyle]">
			<scroll-view
				:class="{'zp-scroll-view':true,'zp-scroll-view-absolute':!usePageScroll}"
				:scroll-top="scrollTop"
				:scroll-y="scrollable&&!usePageScroll&&scrollEnable" :enable-back-to-top="finalEnableBackToTop"
				:show-scrollbar="showScrollbar" :scroll-with-animation="finalScrollWithAnimation"
				:scroll-into-view="scrollIntoView" :lower-threshold="finalLowerThreshold" :upper-threshold="5"
				:refresher-enabled="finalRefresherEnabled&&!useCustomRefresher" :refresher-threshold="finalRefresherThreshold"
				:refresher-default-style="finalRefresherDefaultStyle" :refresher-background="refresherBackground"
				:refresher-triggered="refresherTriggered" @scroll="_scroll" @scrolltolower="_onLoadingMore('toBottom')"
				@scrolltoupper="_scrollToUpper" @refresherrestore="_onRestore" @refresherrefresh="_onRefresh"  
				>	
				<view class="zp-paging-touch-view"
				<!-- #ifndef APP-VUE || MP-WEIXIN || MP-QQ  || H5 -->
				@touchstart="_refresherTouchstart" @touchmove="_refresherTouchmove" @touchend="_refresherTouchend" @touchcancel="_refresherTouchend"
				<!-- #endif -->
				<!-- #ifdef APP-VUE || MP-WEIXIN || MP-QQ || H5 -->
				@touchstart="pagingWxs.touchstart" @touchmove="pagingWxs.touchmove" @touchend="pagingWxs.touchend" @touchcancel="pagingWxs.touchend"
				@mousedown="pagingWxs.mousedown" @mousemove="pagingWxs.mousemove" @mouseup="pagingWxs.mouseup" @mouseleave="pagingWxs.mouseleave"
				<!-- #endif -->
				>	
					<view v-if="finalRefresherFixedBacHeight>0" class="zp-fixed-bac-view" :style="[{'background-color': refresherFixedBackground,'height': `${finalRefresherFixedBacHeight}px`}]"></view>
					<view class="zp-paging-main" :style="[{'transform': finalRefresherTransform,'transition': refresherTransition}]"
					<!-- #ifdef APP-VUE || MP-WEIXIN || MP-QQ || H5 -->
					:change:prop="pagingWxs.propObserver" :prop="wxsPropType"
					:data-refresherThreshold="finalRefresherThreshold" :data-isIos="isIos"
					:data-loading="loading" :data-useChatRecordMode="useChatRecordMode" 
					:data-refresherEnabled="refresherEnabled" :data-useCustomRefresher="useCustomRefresher" :data-pageScrollTop="wxsPageScrollTop"
					:data-scrollTop="wxsScrollTop" :data-refresherMaxAngle="refresherMaxAngle" 
					:data-refresherAecc="refresherAngleEnableChangeContinued" :data-usePageScroll="usePageScroll"
					:data-oldIsTouchmoving="isTouchmoving" :data-refresherOutRate="finalRefresherOutRate"
					<!-- #endif -->
					<!-- #ifdef APP-VUE || H5 -->
					:change:renderPropScrollTop="pagingRenderjs.renderPropScrollTopChange" :renderPropScrollTop="renderPropScrollTop"
					:change:renderUsePageScroll="pagingRenderjs.renderUsePageScrollChange" :renderUsePageScroll="renderUsePageScroll"
					<!-- #endif -->
					>	
						<view v-if="finalRefresherEnabled&&useCustomRefresher&&isTouchmoving" class="zp-custom-refresher-view"
							:style="[{'margin-top': `-${finalRefresherThreshold}px`,'background-color': refresherBackground}]">
							<view :style="[{'height': `${finalRefresherThreshold}px`,'background-color': refresherBackground}]">
								<!-- 下拉刷新view -->
								<slot 
								<!-- #ifdef MP-WEIXIN || MP-QQ || MP-TOUTIAO || MP-BAIDU  -->
								v-if="zScopedSlots.refresher"
								<!-- #endif -->
								<!-- #ifndef MP-WEIXIN || MP-QQ || MP-TOUTIAO || MP-BAIDU -->
								v-if="$scopedSlots.refresher||$slots.refresher"
								<!-- #endif -->
								<!-- #ifndef MP-QQ -->
								:refresherStatus="refresherStatus"
								<!-- #endif -->
								name="refresher" />
								<z-paging-refresh ref="refresh" v-else :style="[{'height': `${finalRefresherThreshold}px`}]" :refresherStatus="refresherStatus"
									:defaultThemeStyle="finalRefresherThemeStyle" :refresherDefaultText="finalRefresherDefaultText"
									:refresherPullingText="finalRefresherPullingText" :refresherRefreshingText="finalRefresherRefreshingText" 
									:showRefresherUpdateTime="showRefresherUpdateTime" :refresherUpdateTimeKey="refresherUpdateTimeKey"></z-paging-refresh>
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
								v-if="showEmpty">
								<slot v-if="$slots.empty" name="empty" />
								<z-paging-empty-view v-else :emptyViewImg="finalEmptyViewImg" :emptyViewText="finalEmptyViewText" :showEmptyViewReload="finalShowEmptyViewReload" :emptyViewReloadText="finalEmptyViewReloadText" :isLoadFailed="isLoadFailed" :emptyViewStyle="emptyViewStyle" :emptyViewTitleStyle="emptyViewTitleStyle" :emptyViewImgStyle="emptyViewImgStyle" :emptyViewReloadStyle="emptyViewReloadStyle" :emptyViewZIndex="emptyViewZIndex" @reload="_emptyViewReload">
								</z-paging-empty-view>
							</view>
							<!-- 主体内容 -->
							<view class="zp-paging-container-content" :style="[finalPagingContentStyle]">
								<slot />
							</view>
							<!-- 上拉加载更多view -->
							<!-- #ifndef MP-ALIPAY -->
							<slot v-if="_shouldShowLoading('loadingMoreDefault')" name="loadingMoreDefault" />
							<slot v-else-if="_shouldShowLoading('loadingMoreLoading')" name="loadingMoreLoading" />
							<slot v-else-if="_shouldShowLoading('loadingMoreNoMore')" name="loadingMoreNoMore" />
							<slot v-else-if="_shouldShowLoading('loadingMoreFail')" name="loadingMoreFail" />
							<z-paging-load-more @click.native="_onLoadingMore('click')"
								v-else-if="_shouldShowLoading('loadingMoreCustom')" :zConfig="zPagingLoadMoreConfig">
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
							<z-paging-load-more @click.native="_onLoadingMore('click')" v-else-if="showLoadingMore&&showDefaultLoadingMoreText&&!(loadingStatus===2&&!showLoadingMoreNoMoreView)&&loadingMoreEnabled&&!useChatRecordMode" :zConfig="zPagingLoadMoreConfig">
							</z-paging-load-more>
							<!-- #endif -->
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
		<slot v-if="!usePageScroll&&$slots.bottom" name="bottom"></slot>
		<view class="zp-page-scroll-bottom" v-else-if="usePageScroll&&$slots.bottom" :style="[{'bottom': `${windowBottom}px`}]">
			<slot name="bottom"></slot>
		</view>
		<view v-if="showBackToTopClass" :class="backToTopClass" :style="[finalBackToTopStyle]" @click.stop="_backToTopClick">
			<slot v-if="$slots.backToTop" name="backToTop" />
			<image v-else class="zp-back-to-top-img" :src="backToTopImg.length?backToTopImg:base64BackToTop"></image>
		</view>  
	</view>
	<!-- #endif -->
	<!-- #ifdef APP-NVUE -->
	<view :is="finalNvueSuperListIs">
		<view ref="zp-page-scroll-top" :is="nViewIs" class="zp-page-scroll-top" v-if="$slots.top" :style="[{'top':`${windowTop}px`,'z-index':topZIndex}]">
			<slot name="top"></slot>
		</view>
		<view ref="n-list" id="z-paging-nlist" :style="[scrollViewStyle,useChatRecordMode ? {transform: nIsFirstPageAndNoMore?'rotate(0deg)':'rotate(180deg)'}:{}]" :is="finalNvueListIs" alwaysScrollableVertical="true"
			:fixFreezing="nFixFreezing" :show-scrollbar="showScrollbar" :loadmoreoffset="finalLowerThreshold"
			:scrollable="scrollable&&scrollEnable" :bounce="nvueBounce" :column-count="nWaterfallColumnCount" :column-width="nWaterfallColumnWidth"
			:column-gap="nWaterfallColumnGap" :left-gap="nWaterfallLeftGap" :right-gap="nWaterfallRightGap"
			@loadmore="_nOnLoadmore" @scroll="_nOnScroll">
			<refresh class="zp-n-refresh" v-if="finalNvueListIs!=='view'&&refresherEnabled&&!nShowRefresherReveal&&!useChatRecordMode" :display="nRefresherLoading?'show':'hide'" @refresh="_nOnRrefresh"
				@pullingdown="_nOnPullingdown">
				<view ref="zp-n-refresh-container" class="zp-n-refresh-container">
					<!-- 下拉刷新view -->
					<slot v-if="zScopedSlots.refresher" :refresherStatus="refresherStatus" name="refresher" />
					<z-paging-refresh ref="refresh" v-else :refresherStatus="refresherStatus" :defaultThemeStyle="finalRefresherThemeStyle"
						:refresherDefaultText="finalRefresherDefaultText" :refresherPullingText="finalRefresherPullingText" :refresherRefreshingText="finalRefresherRefreshingText" 
						:showRefresherUpdateTime="showRefresherUpdateTime" :refresherUpdateTimeKey="refresherUpdateTimeKey"></z-paging-refresh>
				</view>
			</refresh>
			<view ref="zp-n-list-top-tag" class="zp-n-list-top-tag" :is="nViewIs"></view>
			<view v-if="nShowRefresherReveal" ref="zp-n-list-refresher-reveal" :style="[{transform:`translateY(-${nShowRefresherRevealHeight}px)`,height:'0px'}]" :is="nViewIs">
				<slot v-if="zScopedSlots.refresher" :refresherStatus="refresherStatus" name="refresher" />
				<z-paging-refresh ref="refresh" v-else :refresherStatus="refresherStatus" :defaultThemeStyle="finalRefresherThemeStyle"
					:refresherDefaultText="finalRefresherDefaultText" :refresherPullingText="finalRefresherPullingText" :refresherRefreshingText="finalRefresherRefreshingText" 
					:showRefresherUpdateTime="showRefresherUpdateTime" :refresherUpdateTimeKey="refresherUpdateTimeKey"></z-paging-refresh>
			</view>
			<slot />
			<!-- 空数据图 -->
			<view style="flex: 1;" key="z-paging-empty-view" :style="[scrollViewStyle,useChatRecordMode ? {transform: nIsFirstPageAndNoMore?'rotate(0deg)':'rotate(180deg)'}:{}]" v-if="showEmpty" :is="finalNvueListIs==='scroller'?'view':finalNvueListIs==='waterfall'?'header':'cell'">
				<view class="zp-empty-view">
					<slot v-if="$slots.empty" name="empty" />
					<z-paging-empty-view v-else :emptyViewImg="finalEmptyViewImg" :emptyViewText="finalEmptyViewText" :showEmptyViewReload="finalShowEmptyViewReload" :emptyViewReloadText="finalEmptyViewReloadText" :isLoadFailed="isLoadFailed" :emptyViewStyle="emptyViewStyle" :emptyViewTitleStyle="emptyViewTitleStyle" :emptyViewImgStyle="emptyViewImgStyle" :emptyViewReloadStyle="emptyViewReloadStyle" :emptyViewZIndex="emptyViewZIndex" @reload="_emptyViewReload">
					</z-paging-empty-view>
				</view>
			</view>
			<view ref="zp-n-list-bottom-tag" class="zp-n-list-bottom-tag" is="header"></view>
			<!-- 全屏 -->
			<view style="flex: 1;" :style="[scrollViewStyle,useChatRecordMode ? {transform: nIsFirstPageAndNoMore?'rotate(0deg)':'rotate(180deg)'}:{}]" v-if="$slots.loading&&!firstPageLoaded&&(autoHideLoadingAfterFirstLoaded?!pagingLoaded:true)&&loading" :is="finalNvueListIs==='scroller'?'view':finalNvueListIs==='waterfall'?'header':'cell'">
				<slot name="loading" />
			</view>
			<!-- 上拉加载更多view -->
			<view :is="nViewIs">
				<view v-if="useChatRecordMode">
					<view v-if="loadingStatus!==2&&realTotalData.length">
						<slot v-if="$slots.chatLoading"
							name="chatLoading" />
						<view v-else class="zp-chat-record-loading-container">
							<text v-if="loadingStatus!==1" @click="_scrollToUpper()"
								:class="defaultThemeStyle==='white'?'zp-loading-more-text zp-loading-more-text-white':'zp-loading-more-text zp-loading-more-text-black'">{{chatRecordLoadingMoreText}}</text>
							<view>
								<loading-indicator v-if="loadingStatus===1" :animating="true"
									class="zp-loading-more-line-loading-image">
								</loading-indicator>
							</view>
						</view>
					</view>
				</view>
				<view :style="nLoadingMoreFixedHeight?{height:loadingMoreCustomStyle&&loadingMoreCustomStyle.height?loadingMoreCustomStyle.height:'80rpx'}:{}">
					<slot v-if="_shouldShowLoading('loadingMoreDefault')" name="loadingMoreDefault" />
					<slot v-else-if="_shouldShowLoading('loadingMoreLoading')" name="loadingMoreLoading" />
					<slot v-else-if="_shouldShowLoading('loadingMoreNoMore')" name="loadingMoreNoMore" />
					<slot v-else-if="_shouldShowLoading('loadingMoreFail')" name="loadingMoreFail" />
					<z-paging-load-more @click.native="_onLoadingMore('click')"
						v-else-if="_shouldShowLoading('loadingMoreCustom')" :zConfig="zPagingLoadMoreConfig">
					</z-paging-load-more>
				</view>
			</view>
		</view>
		<slot name="bottom"></slot>
		<view v-if="showBackToTopClass" :class="backToTopClass" :style="[finalBackToTopStyle]" @click.stop="_backToTopClick">
			<slot v-if="$slots.backToTop" name="backToTop" />
			<image v-else class="zp-back-to-top-img" :src="backToTopImg.length?backToTopImg:base64BackToTop"></image>
		</view>
	</view>
	<!-- #endif -->
</template>

<script
    src="./js/z-paging-main.js"></script>
<!-- #ifdef APP-VUE || MP-WEIXIN || MP-QQ || H5 -->
<script
    src="./wxs/z-paging-wxs.wxs"
    module="pagingWxs"
    lang="wxs"
></script>
<!-- #endif -->

<!-- #ifdef APP-VUE || H5 -->
<script module="pagingRenderjs" lang="renderjs">
	import pagingRenderjs from './wxs/z-paging-renderjs.js';
	export default {
		mixins: [pagingRenderjs]
	}
</script>
<!-- #endif -->

<style scoped>
	@import "./css/z-paging-main.css";
	@import "./css/z-paging-static.css";
</style>
