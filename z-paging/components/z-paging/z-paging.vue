 <!--                        _             
  ____     _ __   __ _  __ _(_)_ __   __ _ 
 |_  /____| '_ \ / _` |/ _` | | '_ \ / _` |
  / /_____| |_) | (_| | (_| | | | | | (_| |
 /___|    | .__/ \__,_|\__, |_|_| |_|\__, |
          |_|          |___/         |___/ 
v2.7.11 (2024-06-28)
by ZXLee
-->
<!-- 文档地址：https://z-paging.zxlee.cn -->
<!-- github地址：https://github.com/SmileZXLee/uni-z-paging -->
<!-- dcloud地址：https://ext.dcloud.net.cn/plugin?id=3935 -->
<!-- 反馈QQ群：790460711(已满)、371624008 -->

<template name="z-paging">
	<!-- #ifndef APP-NVUE -->
	<view :class="{'z-paging-content':true,'z-paging-content-full':!usePageScroll,'z-paging-content-fixed':!usePageScroll&&fixed,'z-paging-content-page':usePageScroll,'z-paging-reached-top':renderPropScrollTop<1,'z-paging-use-chat-record-mode':useChatRecordMode}" :style="[finalPagingStyle]">
		<!-- #ifndef APP-PLUS -->
		<view v-if="cssSafeAreaInsetBottom===-1" class="zp-safe-area-inset-bottom"></view>
		<!-- #endif -->
		<!-- 二楼view -->
		<view v-if="showF2 && showRefresherF2" @touchmove.stop.prevent class="zp-f2-content" :style="[{'transform': f2Transform, 'transition': `transform .2s linear`, 'height': superContentHeight + 'px', 'z-index': f2ZIndex}]">
			<slot name="f2"/>
		</view>
		<!-- 顶部固定的slot -->
		<slot v-if="!usePageScroll&&zSlots.top" name="top" />
		<view class="zp-page-top" @touchmove.stop.prevent v-else-if="usePageScroll&&zSlots.top" :style="[{'top':`${windowTop}px`,'z-index':topZIndex}]">
			<slot name="top" />
		</view>
		<view :class="{'zp-view-super':true,'zp-scroll-view-super':!usePageScroll}" :style="[finalScrollViewStyle]">
			<view v-if="zSlots.left" :class="{'zp-page-left':true,'zp-absoulte':finalIsOldWebView}">
				<slot name="left" />
			</view>
			<view :class="{'zp-scroll-view-container':true,'zp-absoulte':finalIsOldWebView}" :style="[scrollViewContainerStyle]">
				<scroll-view
					ref="zp-scroll-view" :class="{'zp-scroll-view':true,'zp-scroll-view-absolute':!usePageScroll,'zp-scroll-view-hide-scrollbar':!showScrollbar}" :style="[chatRecordRotateStyle]"
					:scroll-top="scrollTop" :scroll-x="scrollX"
					:scroll-y="finalScrollable" :enable-back-to-top="finalEnableBackToTop"
					:show-scrollbar="showScrollbar" :scroll-with-animation="finalScrollWithAnimation"
					:scroll-into-view="scrollIntoView" :lower-threshold="finalLowerThreshold" :upper-threshold="5"
					:refresher-enabled="finalRefresherEnabled&&!useCustomRefresher" :refresher-threshold="finalRefresherThreshold"
					:refresher-default-style="finalRefresherDefaultStyle" :refresher-background="refresherBackground"
					:refresher-triggered="finalRefresherTriggered" @scroll="_scroll" @scrolltolower="_onScrollToLower"
					@scrolltoupper="_onScrollToUpper" @refresherrestore="_onRestore" @refresherrefresh="_onRefresh(true)"
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
						<view v-if="finalRefresherFixedBacHeight>0" class="zp-fixed-bac-view" :style="[{'background': refresherFixedBackground,'height': `${finalRefresherFixedBacHeight}px`}]"></view>
						<view class="zp-paging-main" :style="[scrollViewInStyle,{'transform': finalRefresherTransform,'transition': refresherTransition}]"
						<!-- #ifdef APP-VUE || MP-WEIXIN || MP-QQ || H5 -->
						:change:prop="pagingWxs.propObserver" :prop="wxsPropType"
						:data-refresherThreshold="finalRefresherThreshold" :data-refresherF2Enabled="refresherF2Enabled" :data-refresherF2Threshold="finalRefresherF2Threshold" :data-isIos="isIos"
						:data-loading="loading||isRefresherInComplete" :data-useChatRecordMode="useChatRecordMode" 
						:data-refresherEnabled="refresherEnabled" :data-useCustomRefresher="useCustomRefresher" :data-pageScrollTop="wxsPageScrollTop"
						:data-scrollTop="wxsScrollTop" :data-refresherMaxAngle="refresherMaxAngle" :data-refresherNoTransform="refresherNoTransform"
						:data-refresherAecc="refresherAngleEnableChangeContinued" :data-usePageScroll="usePageScroll" :data-watchTouchDirectionChange="watchTouchDirectionChange"
						:data-oldIsTouchmoving="isTouchmoving" :data-refresherOutRate="finalRefresherOutRate" :data-refresherPullRate="finalRefresherPullRate" :data-hasTouchmove="hasTouchmove"
						<!-- #endif -->
						<!-- #ifdef APP-VUE || H5 -->
						:change:renderPropIsIosAndH5="pagingRenderjs.renderPropIsIosAndH5Change" :renderPropIsIosAndH5="isIosAndH5"
						<!-- #endif -->
						>	
							<view v-if="showRefresher" class="zp-custom-refresher-view" :style="[{'margin-top': `-${finalRefresherThreshold+refresherThresholdUpdateTag}px`,'background': refresherBackground,'opacity': isTouchmoving ? 1 : 0}]">
								<view class="zp-custom-refresher-container" :style="[{'height': `${finalRefresherThreshold}px`,'background': refresherBackground}]">
									<view v-if="useRefresherStatusBarPlaceholder" class="zp-custom-refresher-status-bar-placeholder" :style="[{'height': `${statusBarHeight}px`}]" />
									<!-- 下拉刷新view -->
									<view class="zp-custom-refresher-slot-view">
										<slot v-if="!(zSlots.refresherComplete&&refresherStatus===R.Complete)&&!(zSlots.refresherF2&&refresherStatus===R.GoF2)" :refresherStatus="refresherStatus" name="refresher" />
									</view>
									<slot v-if="zSlots.refresherComplete&&refresherStatus===R.Complete" name="refresherComplete" />
									<slot v-else-if="zSlots.refresherF2&&refresherStatus===R.GoF2" name="refresherF2" />
									<z-paging-refresh ref="refresh" v-else-if="!showCustomRefresher" class="zp-custom-refresher-refresh" :style="[{'height': `${finalRefresherThreshold - finalRefresherThresholdPlaceholder}px`}]" :status="refresherStatus"
										:defaultThemeStyle="finalRefresherThemeStyle" :defaultText="finalRefresherDefaultText"
										:pullingText="finalRefresherPullingText" :refreshingText="finalRefresherRefreshingText" :completeText="finalRefresherCompleteText" :goF2Text="finalRefresherGoF2Text"
										:defaultImg="refresherDefaultImg" :pullingImg="refresherPullingImg" :refreshingImg="refresherRefreshingImg" :completeImg="refresherCompleteImg" :refreshingAnimated="refresherRefreshingAnimated"
										:showUpdateTime="showRefresherUpdateTime" :updateTimeKey="refresherUpdateTimeKey" :updateTimeTextMap="finalRefresherUpdateTimeTextMap"
										:imgStyle="refresherImgStyle" :titleStyle="refresherTitleStyle" :updateTimeStyle="refresherUpdateTimeStyle" :unit="unit" />
								</view>
							</view>
							<view class="zp-paging-container" :style="[{justifyContent:useChatRecordMode?'flex-end':'flex-start'}]">
								<!-- 全屏Loading -->
								<slot v-if="showLoading&&zSlots.loading&&!loadingFullFixed" name="loading" />
								<!-- 主体内容 -->
								<view class="zp-paging-container-content" :style="[{transform:virtualPlaceholderTopHeight>0?`translateY(${virtualPlaceholderTopHeight}px)`:'none'},finalPagingContentStyle]">
									<slot />
									<!-- 内置列表&虚拟列表 -->
									<template v-if="finalUseInnerList">
										<slot name="header"/>
										<view class="zp-list-container" :style="[innerListStyle]">
											<template v-if="finalUseVirtualList">
												<view class="zp-list-cell" :style="[innerCellStyle]" :id="`zp-id-${item[virtualCellIndexKey]}`" v-for="(item,index) in virtualList" :key="item['zp_unique_index']" @click="_innerCellClick(item,virtualTopRangeIndex+index)">
													<view v-if="useCompatibilityMode">使用兼容模式请在组件源码z-paging.vue第99行中注释这一行，并打开下面一行注释</view>
													<!-- <zp-public-virtual-cell v-if="useCompatibilityMode" :extraData="extraData" :item="item" :index="virtualTopRangeIndex+index" /> -->
													<slot v-else name="cell" :item="item" :index="virtualTopRangeIndex+index"/>
												</view>
											</template>
											<template v-else>
												<view class="zp-list-cell" v-for="(item,index) in realTotalData" :key="index" @click="_innerCellClick(item,index)">
													<slot name="cell" :item="item" :index="index"/>
												</view>
											</template>
										</view>
										<slot name="footer"/>
									</template>
									<!-- 聊天记录模式加载更多loading -->
									<template v-if="useChatRecordMode&&realTotalData.length>=defaultPageSize&&(loadingStatus!==M.NoMore||zSlots.chatNoMore)&&(realTotalData.length||(showChatLoadingWhenReload&&showLoading))&&!isFirstPageAndNoMore">
										<view :style="[chatRecordRotateStyle]">
											<slot v-if="loadingStatus===M.NoMore&&zSlots.chatNoMore" name="chatNoMore" />
											<template v-else>
												<slot v-if="zSlots.chatLoading" :loadingMoreStatus="loadingStatus" name="chatLoading" />
												<z-paging-load-more v-else @doClick="_onLoadingMore('click')" :zConfig="zLoadMoreConfig" />
											</template>
										</view>
									</template>
									<!-- 虚拟列表底部占位view -->
									<view v-if="useVirtualList" class="zp-virtual-placeholder" :style="[{height:virtualPlaceholderBottomHeight+'px'}]"/>
									<!-- 上拉加载更多view -->
									<!-- #ifndef MP-ALIPAY -->
									<slot v-if="showLoadingMoreDefault" name="loadingMoreDefault" />
									<slot v-else-if="showLoadingMoreLoading" name="loadingMoreLoading" />
									<slot v-else-if="showLoadingMoreNoMore" name="loadingMoreNoMore" />
									<slot v-else-if="showLoadingMoreFail" name="loadingMoreFail" />
									<z-paging-load-more @doClick="_onLoadingMore('click')" v-else-if="showLoadingMoreCustom" :zConfig="zLoadMoreConfig" />
									<!-- #endif -->
									<!-- #ifdef MP-ALIPAY -->
									<slot v-if="loadingStatus===M.Default&&zSlots.loadingMoreDefault&&showLoadingMore&&loadingMoreEnabled&&!useChatRecordMode" name="loadingMoreDefault" />
									<slot v-else-if="loadingStatus===M.Loading&&zSlots.loadingMoreLoading&&showLoadingMore&&loadingMoreEnabled" name="loadingMoreLoading" />
									<slot v-else-if="loadingStatus===M.NoMore&&zSlots.loadingMoreNoMore&&showLoadingMore&&showLoadingMoreNoMoreView&&loadingMoreEnabled&&!useChatRecordMode" name="loadingMoreNoMore" />
									<slot v-else-if="loadingStatus===M.Fail&&zSlots.loadingMoreFail&&showLoadingMore&&loadingMoreEnabled&&!useChatRecordMode" name="loadingMoreFail" />
									<z-paging-load-more @doClick="_onLoadingMore('click')" v-else-if="showLoadingMore&&showDefaultLoadingMoreText&&!(loadingStatus===M.NoMore&&!showLoadingMoreNoMoreView)&&loadingMoreEnabled&&!useChatRecordMode" :zConfig="zLoadMoreConfig" />
									<!-- #endif -->
									<view v-if="safeAreaInsetBottom&&useSafeAreaPlaceholder&&!useChatRecordMode" class="zp-safe-area-placeholder" :style="[{height:safeAreaBottom+'px'}]" />
								</view>
								<!-- 空数据图 -->
								<view v-if="showEmpty" :class="{'zp-empty-view':true,'zp-empty-view-center':emptyViewCenter}" :style="[emptyViewSuperStyle,chatRecordRotateStyle]">
									<slot v-if="zSlots.empty" name="empty" :isLoadFailed="isLoadFailed"/>
									<z-paging-empty-view v-else :emptyViewImg="finalEmptyViewImg" :emptyViewText="finalEmptyViewText" :showEmptyViewReload="finalShowEmptyViewReload" 
									:emptyViewReloadText="finalEmptyViewReloadText" :isLoadFailed="isLoadFailed" :emptyViewStyle="emptyViewStyle" :emptyViewTitleStyle="emptyViewTitleStyle" 
									:emptyViewImgStyle="emptyViewImgStyle" :emptyViewReloadStyle="emptyViewReloadStyle" :emptyViewZIndex="emptyViewZIndex" :emptyViewFixed="emptyViewFixed" :unit="unit" 
									@reload="_emptyViewReload" @viewClick="_emptyViewClick" />
								</view>
							</view>
						</view>
					</view>
				</scroll-view>
			</view>
			<view v-if="zSlots.right" :class="{'zp-page-right':true,'zp-absoulte zp-right':finalIsOldWebView}">
				<slot name="right" />
			</view>
		</view>
		<!-- 底部固定的slot -->
		<view class="zp-page-bottom-container" :style="{'background': bottomBgColor}">
			<slot v-if="!usePageScroll&&zSlots.bottom" name="bottom" />
			<view class="zp-page-bottom" @touchmove.stop.prevent v-else-if="usePageScroll&&zSlots.bottom" :style="[{'bottom': `${windowBottom}px`}]">
				<slot name="bottom" />
			</view>
			<!-- 聊天记录模式底部占位 -->
			<template v-if="useChatRecordMode&&autoAdjustPositionWhenChat">
				<view :style="[{height:chatRecordModeSafeAreaBottom+'px'}]" />
				<view class="zp-page-bottom-keyboard-placeholder-animate" :style="[{height:keyboardHeight+'px'}]" />
			</template>
		</view>
		<!-- 点击返回顶部view -->
		<view v-if="showBackToTopClass" :class="finalBackToTopClass" :style="[finalBackToTopStyle]" @click.stop="_backToTopClick">
			<slot v-if="zSlots.backToTop" name="backToTop" />
			<image v-else class="zp-back-to-top-img" :src="backToTopImg.length?backToTopImg:base64BackToTop" />
		</view>
		<!-- 全屏Loading(铺满z-paging并固定) -->
		<view v-if="showLoading&&zSlots.loading&&loadingFullFixed" class="zp-loading-fixed">
			<slot name="loading" />
		</view>
	</view>
	<!-- #endif -->
	<!-- #ifdef APP-NVUE -->
	<component ref="z-paging-content" :is="finalNvueSuperListIs" :style="[finalPagingStyle]" :class="{'z-paging-content-fixed':fixed&&!usePageScroll}" :scrollable="false">
		<!-- 二楼view -->
		<view v-if="showF2 && showRefresherF2" ref="zp-n-f2" class="zp-f2-content" @touchmove.stop.prevent :style="[{'height': superContentHeight + 'px', 'width': nRefresherWidth + 'px', 'opacity': nF2Opacity}]">
			<slot name="f2"/>
		</view>
		<!-- 顶部固定的slot -->
		<view ref="zp-page-top" v-if="zSlots.top" :class="{'zp-page-top':usePageScroll}" :style="[usePageScroll?{'top':`${windowTop}px`,'z-index':topZIndex}:{}]">
			<slot name="top" />
		</view>
		<!-- 聊天记录模式加载更多loading（loading时候显示） -->
		<view v-if="useChatRecordMode&&loadingStatus!==M.NoMore&&showChatLoadingWhenReload&&showLoading">
			<slot v-if="zSlots.chatLoading" :loadingMoreStatus="loadingStatus" name="chatLoading" />
			<z-paging-load-more v-else @doClick="_onLoadingMore('click')" :zConfig="zLoadMoreConfig" />
		</view>
		<component :is="finalNvueSuperListIs" class="zp-n-list-container" :scrollable="false">
			<view v-if="zSlots.left" class="zp-page-left">
				<slot name="left" />
			</view>
			<component :is="finalNvueListIs" ref="zp-n-list" :id="nvueListId" :style="[{'flex': 1,'top':isIos?'0px':'-1px'},usePageScroll?scrollViewStyle:{},chatRecordRotateStyle]" :alwaysScrollableVertical="true"
				:fixFreezing="nFixFreezing" :show-scrollbar="showScrollbar" :loadmoreoffset="finalLowerThreshold" :enable-back-to-top="enableBackToTop"
				:scrollable="finalScrollable" :bounce="nvueBounce" :column-count="nWaterfallColumnCount" :column-width="nWaterfallColumnWidth"
				:column-gap="nWaterfallColumnGap" :left-gap="nWaterfallLeftGap" :right-gap="nWaterfallRightGap" :pagingEnabled="nvuePagingEnabled" :offset-accuracy="offsetAccuracy"
				@loadmore="_nOnLoadmore" @scroll="_nOnScroll" @scrollend="_nOnScrollend">
				<refresh v-if="(zSlots.top?cacheTopHeight!==-1:true)&&finalNvueRefresherEnabled" class="zp-n-refresh" :style="[nvueRefresherStyle]" :display="nRefresherLoading?'show':'hide'" @refresh="_nOnRrefresh" @pullingdown="_nOnPullingdown">
					<view ref="zp-n-refresh-container" class="zp-n-refresh-container" :style="[{background:refresherBackground,width:nRefresherWidth}]" id="zp-n-refresh-container">
						<view v-if="useRefresherStatusBarPlaceholder" class="zp-custom-refresher-status-bar-placeholder" :style="[{'height': `${statusBarHeight}px`}]" />
						<!-- 下拉刷新view -->
						<slot v-if="zSlots.refresherComplete&&refresherStatus===R.Complete" name="refresherComplete" />
						<slot v-else-if="zSlots.refresherF2&&refresherStatus===R.GoF2" name="refresherF2" />
						<slot v-else-if="(nScopedSlots?nScopedSlots:zSlots).refresher" :refresherStatus="refresherStatus" name="refresher" />
						<z-paging-refresh ref="refresh" v-else :status="refresherStatus" :defaultThemeStyle="finalRefresherThemeStyle"
							:defaultText="finalRefresherDefaultText" :pullingText="finalRefresherPullingText" :refreshingText="finalRefresherRefreshingText" :completeText="finalRefresherCompleteText" :goF2Text="finalRefresherGoF2Text"
							:defaultImg="refresherDefaultImg" :pullingImg="refresherPullingImg" :refreshingImg="refresherRefreshingImg" :completeImg="refresherCompleteImg" :refreshingAnimated="refresherRefreshingAnimated"
							:showUpdateTime="showRefresherUpdateTime" :updateTimeKey="refresherUpdateTimeKey" :updateTimeTextMap="finalRefresherUpdateTimeTextMap"
							:imgStyle="refresherImgStyle" :titleStyle="refresherTitleStyle" :updateTimeStyle="refresherUpdateTimeStyle" :unit="unit" />
					</view>
				</refresh>
				<component :is="nViewIs" v-if="isIos&&!useChatRecordMode?oldScrollTop>10:true" ref="zp-n-list-top-tag" class="zp-n-list-top-tag" style="margin-top: -1rpx;" :style="[{height:finalNvueRefresherEnabled?'0px':'1px'}]"></component>
				<component :is="nViewIs" v-if="nShowRefresherReveal" ref="zp-n-list-refresher-reveal" :style="[{transform:`translateY(-${nShowRefresherRevealHeight}px)`},{background:refresherBackground}]">
					<view v-if="useRefresherStatusBarPlaceholder" class="zp-custom-refresher-status-bar-placeholder" :style="[{'height': `${statusBarHeight}px`}]" />
					<!-- 下拉刷新view -->
					<slot v-if="zSlots.refresherComplete&&refresherStatus===R.Complete" name="refresherComplete" />
					<slot v-else-if="zSlots.refresherF2&&refresherStatus===R.GoF2" name="refresherF2" />
					<slot v-else-if="(nScopedSlots?nScopedSlots:$slots).refresher" :refresherStatus="R.Loading" name="refresher" />
					<z-paging-refresh ref="refresh" v-else :status="R.Loading" :defaultThemeStyle="finalRefresherThemeStyle"
						:defaultText="finalRefresherDefaultText" :pullingText="finalRefresherPullingText" :refreshingText="finalRefresherRefreshingText" :completeText="finalRefresherCompleteText" :goF2Text="finalRefresherGoF2Text"
						:defaultImg="refresherDefaultImg" :pullingImg="refresherPullingImg" :refreshingImg="refresherRefreshingImg" :completeImg="refresherCompleteImg" :refreshingAnimated="refresherRefreshingAnimated"
						:showUpdateTime="showRefresherUpdateTime" :updateTimeKey="refresherUpdateTimeKey" :updateTimeTextMap="finalRefresherUpdateTimeTextMap"
						:imgStyle="refresherImgStyle" :titleStyle="refresherTitleStyle" :updateTimeStyle="refresherUpdateTimeStyle" :unit="unit" />
				</component>
				<!-- 内置列表 -->
				<template v-if="finalUseInnerList">
					<component :is="nViewIs">
						<slot name="header"/>
					</component>	
					<component :is="nViewIs" class="zp-list-cell" v-for="(item,index) in realTotalData" :key="finalCellKeyName.length?item[finalCellKeyName]:index">
						<slot name="cell" :item="item" :index="index"/>
					</component>
					<component :is="nViewIs">
						<slot name="footer"/>
					</component>	
				</template>
				<template v-else>
					<slot />
				</template>
				<!-- 全屏Loading -->
				<component :is="nViewIs" v-if="showLoading&&zSlots.loading&&!loadingFullFixed" :class="{'z-paging-content-fixed':usePageScroll}" style="flex:1" :style="[chatRecordRotateStyle]">
					<slot name="loading" />
				</component>
				<!-- 上拉加载更多view -->
				<component :is="nViewIs" v-if="!refresherOnly&&loadingMoreEnabled&&!showEmpty">
					<!-- 聊天记录模式加载更多loading（滚动到顶部加载更多或无更多数据时显示） -->
					<template v-if="useChatRecordMode&&realTotalData.length>=defaultPageSize&&(loadingStatus!==M.NoMore||zSlots.chatNoMore)&&realTotalData.length&&isChatRecordModeAndInversion">
						<view :style="[chatRecordRotateStyle]">
							<slot v-if="loadingStatus===M.NoMore&&zSlots.chatNoMore" name="chatNoMore" />
							<template v-else>
								<slot v-if="zSlots.chatLoading" :loadingMoreStatus="loadingStatus" name="chatLoading" />
								<z-paging-load-more v-else @doClick="_onLoadingMore('click')" :zConfig="zLoadMoreConfig" />
							</template>
						</view>
					</template>
					
					<view :style="nLoadingMoreFixedHeight?{height:loadingMoreCustomStyle&&loadingMoreCustomStyle.height?loadingMoreCustomStyle.height:'80rpx'}:{}">
						<slot v-if="showLoadingMoreDefault" name="loadingMoreDefault" />
						<slot v-else-if="showLoadingMoreLoading" name="loadingMoreLoading" />
						<slot v-else-if="showLoadingMoreNoMore" name="loadingMoreNoMore" />
						<slot v-else-if="showLoadingMoreFail" name="loadingMoreFail" />
						<z-paging-load-more @doClick="_onLoadingMore('click')" v-else-if="showLoadingMoreCustom" :zConfig="zLoadMoreConfig" />
						<view v-if="safeAreaInsetBottom&&useSafeAreaPlaceholder&&!useChatRecordMode" class="zp-safe-area-placeholder" :style="[{height:safeAreaBottom+'px'}]" />
					</view>
				</component>
				<!-- 空数据图 -->
				<component :is="nViewIs" v-if="showEmpty" :class="{'z-paging-content-fixed':usePageScroll}" :style="[{flex:emptyViewCenter?1:0},emptyViewSuperStyle,chatRecordRotateStyle]">
					<view :class="{'zp-empty-view':true,'zp-empty-view-center':emptyViewCenter}">
						<slot v-if="zSlots.empty" name="empty" :isLoadFailed="isLoadFailed" />
						<z-paging-empty-view v-else :emptyViewImg="finalEmptyViewImg" :emptyViewText="finalEmptyViewText" :showEmptyViewReload="finalShowEmptyViewReload" 
						:emptyViewReloadText="finalEmptyViewReloadText" :isLoadFailed="isLoadFailed" :emptyViewStyle="emptyViewStyle" :emptyViewTitleStyle="emptyViewTitleStyle" 
						:emptyViewImgStyle="emptyViewImgStyle" :emptyViewReloadStyle="emptyViewReloadStyle" :emptyViewZIndex="emptyViewZIndex" :emptyViewFixed="emptyViewFixed" :unit="unit"
						@reload="_emptyViewReload" @viewClick="_emptyViewClick" />
					</view>
				</component>
				<component is="header" v-if="!hideNvueBottomTag" ref="zp-n-list-bottom-tag" class="zp-n-list-bottom-tag"></component>
			</component>
			<view v-if="zSlots.right" class="zp-page-right">
				<slot name="right" />
			</view>
		</component>
		<!-- 底部固定的slot -->
		<view class="zp-page-bottom-container" :style="{'background': bottomBgColor}">
			<slot name="bottom" />
			<!-- 聊天记录模式底部占位 -->
			<template v-if="useChatRecordMode&&autoAdjustPositionWhenChat">
				<view :style="[{height:chatRecordModeSafeAreaBottom+'px'}]" />
				<view class="zp-page-bottom-keyboard-placeholder-animate" :style="[{height:keyboardHeight+'px'}]" />
			</template>
		</view>
		<!-- 点击返回顶部view -->
		<view v-if="showBackToTopClass" :class="finalBackToTopClass" :style="[finalBackToTopStyle]" @click.stop="_backToTopClick">
			<slot v-if="zSlots.backToTop" name="backToTop" />
			<image v-else class="zp-back-to-top-img" :src="backToTopImg.length?backToTopImg:base64BackToTop" />
		</view>
		<!-- 全屏Loading(铺满z-paging并固定) -->
		<view v-if="showLoading&&zSlots.loading&&loadingFullFixed" class="zp-loading-fixed">
			<slot name="loading" />
		</view>
	</component>
	<!-- #endif -->
</template>
<!-- #ifdef APP-VUE || MP-WEIXIN || MP-QQ || H5 -->
<script src="./wxs/z-paging-wxs.wxs" module="pagingWxs" lang="wxs"></script>
<!-- #endif -->
<script module="pagingRenderjs" lang="renderjs">
	import pagingRenderjs from './wxs/z-paging-renderjs.js';
	/**
	 * z-paging 分页组件
	 * @description 高性能，全平台兼容。支持虚拟列表，支持nvue、vue3
	 * @tutorial https://z-paging.zxlee.cn
	 * @notice 以下仅为部分常用属性、方法和事件，完整文档请查阅z-paging官网
	 * @property {Number|String} default-page-no 自定义初始的pageNo，默认为1
	 * @property {Number|String} default-page-size 自定义pageSize，默认为10
	 * @property {Object} paging-style 设置z-paging的style，部分平台(如微信小程序)无法直接修改组件的style，可使用此属性代替
	 * @property {String} height z-paging的高度，优先级低于pagingStyle中设置的height，传字符串，如100px、100rpx、100%
	 * @property {String} width z-paging的宽度，优先级低于pagingStyle中设置的width，传字符串，如100px、100rpx、100%
	 * @property {Boolean} use-page-scroll 使用页面滚动，默认为否
	 * @property {Boolean} use-virtual-list 是否使用虚拟列表，默认为否
	 * @property {Boolean} fixed z-paging是否使用fixed布局，若使用fixed布局，则z-paging的父view无需固定高度，z-paging高度默认为100%，默认为是(当使用内置scroll-view滚动时有效)
	 * @property {Boolean} auto [z-paging]mounted后是否自动调用reload方法(mounted后自动调用接口)，默认为是
	 * @property {Boolean} use-chat-record-mode 使用聊天记录模式，默认为否
	 * @event {Function} query 下拉刷新或滚动到底部时会自动触发此方法。z-paging加载时也会触发(若要禁止，请设置:auto="false")。pageNo和pageSize会自动计算好，直接传给服务器即可。
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
