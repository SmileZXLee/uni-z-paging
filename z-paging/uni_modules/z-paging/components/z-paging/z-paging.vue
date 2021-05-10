 <!--                        _             
  ____     _ __   __ _  __ _(_)_ __   __ _ 
 |_  /____| '_ \ / _` |/ _` | | '_ \ / _` |
  / /_____| |_) | (_| | (_| | | | | | (_| |
 /___|    | .__/ \__,_|\__, |_|_| |_|\__, |
          |_|          |___/         |___/ 
V1.6.1
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
    src="./js/z-paging-main.js"></script>
	
<script
    src="./wxs/z-paging-refresh.wxs"
    module="paging"
    lang="wxs"
></script>

<style scoped>
	@import "./css/z-paging-main.css";
	@import "./css/z-paging-static.css";
</style>
