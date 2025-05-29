 <!--                        _             
  ____     _ __   __ _  __ _(_)_ __   __ _ 
 |_  /____| '_ \ / _` |/ _` | | '_ \ / _` |
  / /_____| |_) | (_| | (_| | | | | | (_| |
 /___|    | .__/ \__,_|\__, |_|_| |_|\__, |
          |_|          |___/         |___/ 
v2.8.7 (2025-05-30)
@author ZXLee <admin@zxlee.cn>
-->
<!-- 文档地址：https://z-paging.zxlee.cn -->
<!-- github地址：https://github.com/SmileZXLee/uni-z-paging -->
<!-- dcloud地址：https://ext.dcloud.net.cn/plugin?id=3935 -->
<!-- 反馈QQ群：343409055 -->

<template name="z-paging">
	<!-- #ifndef APP-NVUE -->
	<view :class="[{'z-paging-content':true,'z-paging-content-full':!usePageScroll,'z-paging-content-fixed':!usePageScroll&&fixed,'z-paging-content-page':usePageScroll,'z-paging-reached-top':renderPropScrollTop<1,'z-paging-use-chat-record-mode':useChatRecordMode}, pagingClass]" :style="[finalPagingStyle]">
		<!-- #ifndef APP-PLUS -->
		<view v-if="cssSafeAreaInsetBottom===-1" class="zp-safe-area-inset-bottom"></view>
		<!-- #endif -->
		<!-- 二楼view -->
		<view v-if="showF2 && showRefresherF2" @touchmove.stop.prevent class="zp-f2-content" :style="[{'transform': f2Transform, 'transition': `transform .2s linear`, 'height': superContentHeight + 'px', 'z-index': f2ZIndex}]">
			<slot name="f2"/>
		</view>
		<!-- 顶部固定的slot -->
		<template v-if="zSlots.top">
			<slot v-if="!usePageScroll" name="top" />
			<view v-else class="zp-page-top" @touchmove.stop.prevent :style="[{'top':`${windowTop}px`,'z-index':topZIndex}]">
				<slot name="top" />
			</view>
		</template>
		<view :class="{'zp-view-super':true,'zp-scroll-view-super':!usePageScroll}" :style="[finalScrollViewStyle]">
			<view v-if="zSlots.left" :class="{'zp-page-left':true,'zp-absoulte':finalIsOldWebView}">
				<slot name="left" />
			</view>
			<view :class="{'zp-scroll-view-container':true,'zp-absoulte':finalIsOldWebView}" :style="[scrollViewContainerStyle]">
				<scroll-view
					ref="zp-scroll-view" :class="{'zp-scroll-view':true,'zp-scroll-view-absolute':!usePageScroll,'zp-scroll-view-hide-scrollbar':!showScrollbar}" :style="[chatRecordRotateStyle]"
					:scroll-top="scrollTop" :scroll-left="scrollLeft" :scroll-x="scrollX"
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
						:data-refresherEnabled="finalRefresherEnabled" :data-useCustomRefresher="useCustomRefresher" :data-pageScrollTop="wxsPageScrollTop"
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
										:defaultThemeStyle="finalRefresherThemeStyle" :defaultText="finalRefresherDefaultText" :isIos="isIos"
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
								<view class="zp-paging-container-content" :style="[finalPlaceholderTopHeightStyle,finalPagingContentStyle]">
									<!-- #ifdef VUE3 -->
									<!-- 虚拟列表顶部占位view -->
									<view v-if="useVirtualList" class="zp-virtual-placeholder" :style="[{height:virtualPlaceholderTopHeight+'px'}]"/>
									<!-- #endif -->
									<slot />
									<!-- 内置列表&虚拟列表 -->
									<template v-if="finalUseInnerList">
										<slot name="header"/>
										<view class="zp-list-container" :style="[innerListStyle]">
											<template v-if="finalUseVirtualList">
												<view class="zp-list-cell" :style="[innerCellStyle]" :id="`${fianlVirtualCellIdPrefix}-${item[virtualCellIndexKey]}`" v-for="(item,index) in virtualList" :key="item['zp_unique_index']" @click="_innerCellClick(item,virtualTopRangeIndex+index)">
													<view v-if="useCompatibilityMode">使用兼容模式请在组件源码z-paging.vue第105行中注释这一行，并打开下面一行注释</view>
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
									<!-- 底部安全区域useSafeAreaPlaceholder模式占位，此时占位不再固定在底部而是跟随页面一起滚动 -->
									<!-- 如果底部slot=bottom存在，占位区域会插入在slot=bottom下方，不再跟随页面滚动，因此这里就没必要显示了 -->
									<!-- 聊天记录模式因为列表倒置，此处不需要显示底部安全区域，另行处理 -->
									<view v-if="safeAreaInsetBottom&&finalUseSafeAreaPlaceholder&&!useChatRecordMode" class="zp-safe-area-placeholder" :style="[{height:safeAreaBottom+'px'}]" />
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
			<template v-if="zSlots.bottom">
				<!-- 非页面滚动底部插槽(父容器开启flex，中间列表设置了flex:1，通过中间列表撑开固定在底部) -->
				<slot v-if="!usePageScroll" name="bottom" />
				<!-- 页面滚动底部插槽(通过position: fixed固定在底部) -->
				<view v-else class="zp-page-bottom" @touchmove.stop.prevent :style="[{'bottom': `${windowBottom}px`, 'background': bottomBgColor}]">
					<slot name="bottom" />
					<!-- 页面滚动底部安全区域占位(仅slot=bottom存在时展示在slot=bottom插入的view下方，当slot=bottom不存在时，通过控制容器的marginBottom设置底部安全区域间距) -->
					<view v-if="safeAreaInsetBottom" :style="[{height:safeAreaBottom+'px'}]" />
				</view>
			</template>
			<!-- 非页面滚动底部安全区域占位(无论slot=bottom是否存在)-->
			<!-- 如果useSafeAreaPlaceholder开启了并且slot=bottom不存在就不显示这个占位view了，因为此时useSafeAreaPlaceholder会是跟随滚动的状态 -->
			<!-- 聊天记录模式因为列表倒置，此处不需要显示底部安全区域，另行处理 -->
			<view v-if="safeAreaInsetBottom&&!usePageScroll&&!(finalUseSafeAreaPlaceholder)&&!useChatRecordMode" :style="[{height:safeAreaBottom+'px'}]" />
			
			<!-- 聊天记录模式底部占位 -->
			<template v-if="useChatRecordMode&&autoAdjustPositionWhenChat">
				<view :style="[{height:chatRecordModeSafeAreaBottom+'px'}]" />
				<view class="zp-page-bottom-keyboard-placeholder-animate" :style="[{height:keyboardHeight+'px'}]" />
			</template>
		</view>
		<!-- 点击返回顶部view -->
		<view v-if="showBackToTopClass" :class="finalBackToTopClass" :style="[finalBackToTopStyle]" @click.stop="_backToTopClick">
			<slot v-if="zSlots.backToTop" name="backToTop" />
			<image v-else class="zp-back-to-top-img" :class="{'zp-back-to-top-img-inversion': useChatRecordMode&&!backToTopImg.length}" :src="backToTopImg.length?backToTopImg:base64BackToTop" />
		</view>
		<!-- 全屏Loading(铺满z-paging并固定) -->
		<view v-if="showLoading&&zSlots.loading&&loadingFullFixed" class="zp-loading-fixed">
			<slot name="loading" />
		</view>
	</view>
	<!-- #endif -->
	<!-- #ifdef APP-NVUE -->
	<component ref="z-paging-content" :is="finalNvueSuperListIs" :style="[finalPagingStyle]" :class="[{'z-paging-content-fixed':fixed&&!usePageScroll}, pagingClass]" :scrollable="false">
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
			<!-- 因在nvue+vue3+waterfall中，使用<component is="waterfall" />设置的瀑布流无效，因此此处只能单独判断finalNvueListIs等于waterfall时，直接写<waterfall />标签暂时解决 -->
			<!-- 下方的v-if和v-else中的代码完全一致，仅标签不同，等待官方解决后再统一，已提issue：https://ask.dcloud.net.cn/question/168505 -->
			<component v-if="finalNvueListIs !== 'waterfall'" :is="finalNvueListIs" ref="zp-n-list" :id="nvueListId" :style="[{'flex': 1,'top':isIos?'0px':'-1px'},usePageScroll?scrollViewStyle:{},chatRecordRotateStyle]" :alwaysScrollableVertical="true"
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
						<z-paging-refresh ref="refresh" v-else :status="refresherStatus" :defaultThemeStyle="finalRefresherThemeStyle" :isIos="isIos"
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
					<z-paging-refresh ref="refresh" v-else :status="R.Loading" :defaultThemeStyle="finalRefresherThemeStyle" :isIos="isIos"
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
				<component :is="nViewIs" v-if="!isOnly&&loadingMoreEnabled&&!showEmpty">
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
					
					<view :style="nLoadingMoreFixedHeight?{height:loadingMoreCustomStyle&&loadingMoreCustomStyle.height?loadingMoreCustomStyle.height:loadingMoreFixedHeight}:{}">
						<slot v-if="showLoadingMoreDefault" name="loadingMoreDefault" />
						<slot v-else-if="showLoadingMoreLoading" name="loadingMoreLoading" />
						<slot v-else-if="showLoadingMoreNoMore" name="loadingMoreNoMore" />
						<slot v-else-if="showLoadingMoreFail" name="loadingMoreFail" />
						<z-paging-load-more @doClick="_onLoadingMore('click')" v-else-if="showLoadingMoreCustom" :zConfig="zLoadMoreConfig" />
						<!-- 底部安全区域useSafeAreaPlaceholder模式占位，此时占位不再固定在底部而是跟随页面一起滚动 -->
						<!-- 如果底部slot=bottom存在，占位区域会插入在slot=bottom下方，不再跟随页面滚动，因此这里就没必要显示了 -->
						<!-- 聊天记录模式因为列表倒置，此处不需要显示底部安全区域，另行处理 -->
						<view v-if="safeAreaInsetBottom&&finalUseSafeAreaPlaceholder&&!useChatRecordMode" class="zp-safe-area-placeholder" :style="[{height:safeAreaBottom+'px'}]" />
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
				<component :is="nViewIs" v-if="!hideNvueBottomTag" ref="zp-n-list-bottom-tag" class="zp-n-list-bottom-tag"></component>
			</component>
			<waterfall v-else :is="finalNvueListIs" ref="zp-n-list" :id="nvueListId" :style="[{'flex': 1,'top':isIos?'0px':'-1px'},usePageScroll?scrollViewStyle:{},chatRecordRotateStyle]" :alwaysScrollableVertical="true"
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
						<z-paging-refresh ref="refresh" v-else :status="refresherStatus" :defaultThemeStyle="finalRefresherThemeStyle" :isIos="isIos"
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
					<z-paging-refresh ref="refresh" v-else :status="R.Loading" :defaultThemeStyle="finalRefresherThemeStyle" :isIos="isIos"
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
				<component :is="nViewIs" v-if="!isOnly&&loadingMoreEnabled&&!showEmpty">
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
					
					<view :style="nLoadingMoreFixedHeight?{height:loadingMoreCustomStyle&&loadingMoreCustomStyle.height?loadingMoreCustomStyle.height:loadingMoreFixedHeight}:{}">
						<slot v-if="showLoadingMoreDefault" name="loadingMoreDefault" />
						<slot v-else-if="showLoadingMoreLoading" name="loadingMoreLoading" />
						<slot v-else-if="showLoadingMoreNoMore" name="loadingMoreNoMore" />
						<slot v-else-if="showLoadingMoreFail" name="loadingMoreFail" />
						<z-paging-load-more @doClick="_onLoadingMore('click')" v-else-if="showLoadingMoreCustom" :zConfig="zLoadMoreConfig" />
						<!-- 底部安全区域useSafeAreaPlaceholder模式占位，此时占位不再固定在底部而是跟随页面一起滚动 -->
						<!-- 如果底部slot=bottom存在，占位区域会插入在slot=bottom下方，不再跟随页面滚动，因此这里就没必要显示了 -->
						<!-- 聊天记录模式因为列表倒置，此处不需要显示底部安全区域，另行处理 -->
						<view v-if="safeAreaInsetBottom&&finalUseSafeAreaPlaceholder&&!useChatRecordMode" class="zp-safe-area-placeholder" :style="[{height:safeAreaBottom+'px'}]" />
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
				<component :is="nViewIs" v-if="!hideNvueBottomTag" ref="zp-n-list-bottom-tag" class="zp-n-list-bottom-tag"></component>
			</waterfall>
			<view v-if="zSlots.right" class="zp-page-right">
				<slot name="right" />
			</view>
		</component>
		<!-- 底部固定的slot -->
		<view class="zp-page-bottom-container" :style="{'background': bottomBgColor}">
			<slot name="bottom" />
			<!-- 非页面滚动底部安全区域占位(无论slot=bottom是否存在)-->
			<!-- 如果useSafeAreaPlaceholder开启了并且slot=bottom不存在就不显示这个占位view了，因为此时useSafeAreaPlaceholder会是跟随滚动的状态 -->
			<!-- 聊天记录模式因为列表倒置，此处不需要显示底部安全区域，另行处理 -->
			<view v-if="safeAreaInsetBottom&&!usePageScroll&&!(finalUseSafeAreaPlaceholder)&&!useChatRecordMode" :style="[{height:safeAreaBottom+'px'}]" />
			
			<!-- 聊天记录模式底部占位 -->
			<template v-if="useChatRecordMode&&autoAdjustPositionWhenChat">
				<view :style="[{height:chatRecordModeSafeAreaBottom+'px'}]" />
				<view class="zp-page-bottom-keyboard-placeholder-animate" :style="[{height:keyboardHeight+'px'}]" />
			</template>
		</view>
		<!-- 点击返回顶部view -->
		<view v-if="showBackToTopClass" :class="finalBackToTopClass" :style="[finalBackToTopStyle]" @click.stop="_backToTopClick">
			<slot v-if="zSlots.backToTop" name="backToTop" />
			<image v-else class="zp-back-to-top-img" :class="{'zp-back-to-top-img-inversion': useChatRecordMode&&!backToTopImg.length}" :src="backToTopImg.length?backToTopImg:base64BackToTop" />
		</view>
		<!-- 全屏Loading(铺满z-paging并固定) -->
		<view v-if="showLoading&&zSlots.loading&&loadingFullFixed" class="zp-loading-fixed">
			<slot name="loading" />
		</view>
	</component>
	<!-- #endif -->
</template>
<script module="pagingRenderjs" lang="renderjs">
	import pagingRenderjs from './wxs/z-paging-renderjs.js';
	/**
	 * z-paging 分页组件
	 * @description z-paging 分页组件，高性能，全平台兼容。支持自定义下拉刷新、上拉加载更多、虚拟列表、下拉进入二楼、自动管理空数据图、全自动分页、无闪动聊天分页、本地分页等，也支持作为基本布局容器使用
	 * @tutorial https://z-paging.zxlee.cn
	 * @property {Array} value 父组件v-model所绑定的list的值，默认为[]
	 * @property {Number|String} defaultPageNo 自定义初始的pageNo，默认为1
	 * @property {Number|String} defaultPageSize 自定义pageSize(每页显示多少条)，默认为10
	 * @property {Boolean} fixed z-paging是否使用fixed布局，默认为true
	 * @property {Boolean} safeAreaInsetBottom 是否开启底部安全区域适配，默认为false
	 * @property {Boolean} useSafeAreaPlaceholder 开启底部安全区域适配后，是否使用placeholder形式实现，默认为false
	 * @property {Boolean} usePageScroll 使用页面滚动，默认为false
	 * @property {Boolean} autoFullHeight 使用页面滚动时，是否在不满屏时自动填充满屏幕，默认为true
	 * @property {String} defaultThemeStyle loading(下拉刷新、上拉加载更多)的主题样式，支持black，white，默认为black
	 * @property {Object} pagingStyle 设置z-paging的style，部分平台(如微信小程序)无法直接修改组件的style，可使用此属性代替
	 * @property {String|Array|Object} pagingClass 设置z-paging的class，优先级低于pagingStyle和height、width、maxWidth、bgColor
	 * @property {String} height z-paging的高度，优先级低于pagingStyle中设置的height，传字符串，如100px、100rpx、100%
	 * @property {String} width z-paging的宽度，优先级低于pagingStyle中设置的width，传字符串，如100px、100rpx、100%
	 * @property {String} maxWidth z-paging的最大宽度，优先级低于pagingStyle中设置的max-width，默认为空
	 * @property {String} bgColor z-paging的背景色(为css中的background，因此也可以设置渐变，背景图片等)，优先级低于pagingStyle中设置的background-color
	 * @property {Boolean} watchTouchDirectionChange 是否监听列表触摸方向改变，默认为false
	 * @property {Boolean} watchScrollDirectionChange 是否监听列表滚动方向改变，默认为false
	 * @property {Boolean} layoutOnly 是否只使用基础布局，设置为true后将关闭mounted自动请求数据、关闭下拉刷新和滚动到底部加载更多，强制隐藏空数据图。默认为否
	 * @property {Number|String} delay 调用complete后延迟处理的时间，单位为毫秒，优先级高于min-delay，默认为0
	 * @property {Number|String} minDelay 触发@query后最小延迟处理的时间，单位为毫秒，优先级低于delay，默认为0
	 * @property {Boolean} callNetworkReject 请求失败是否触发reject，默认为true
	 * @property {String} unit z-paging中默认布局的单位，默认为rpx
	 * @property {Boolean} concat 自动拼接complete中传过来的数组，默认为true
	 * @property {Number|String|Object} dataKey 为保证数据一致，设置当前tab切换时的标识key，并在complete中传递相同key，若二者不一致，则complete将不会生效
	 * @property {String} autowireListName 【极简写法】自动注入的list名，可自动修改父view(包含ref="paging")中对应name的list值
	 * @property {String} autowireQueryName 【极简写法】自动注入的query名，可自动调用父view(包含ref="paging")中的query方法
	 * @property {Function} fetch 【极简写法】获取分页数据Function，功能与@query类似。若设置了fetch则@query将不再触发
	 * @property {Object} fetchParams fetch的附加参数，fetch配置后有效
	 * @property {Boolean} auto [z-paging]mounted后是否自动调用reload方法(mounted后自动调用接口)，默认为true
	 * @property {Boolean} autoScrollToTopWhenReload reload时自动滚动到顶部，默认为true
	 * @property {Boolean} autoCleanListWhenReload reload时立即自动清空原list，默认为true
	 * @property {Boolean} showRefresherWhenReload 列表刷新时自动显示下拉刷新view，默认为false
	 * @property {Boolean} showLoadingMoreWhenReload 列表刷新时自动显示加载更多view，且为加载中状态，默认为false
	 * @property {Boolean} createdReload 组件created时立即触发reload，默认为false
	 * @property {Boolean} refresherEnabled 是否开启下拉刷新，默认为true
	 * @property {Number|String} refresherThreshold 设置自定义下拉刷新阈值，默认单位为px，默认为80rpx
	 * @property {Boolean} useRefresherStatusBarPlaceholder 是否开启下拉刷新状态栏占位，默认为false
	 * @property {Boolean} refresherOnly 是否只使用下拉刷新，默认为false
	 * @property {Boolean} useCustomRefresher 是否使用自定义的下拉刷新，默认为true
	 * @property {Boolean} reloadWhenRefresh 用户下拉刷新时是否触发reload方法，默认为true
	 * @property {String} refresherThemeStyle 下拉刷新的主题样式，支持black，white，默认为black
	 * @property {Object} refresherImgStyle 自定义下拉刷新中左侧图标的样式
	 * @property {Object} refresherTitleStyle 自定义下拉刷新中右侧状态描述文字的样式
	 * @property {Object} refresherUpdateTimeStyle 自定义下拉刷新中右侧最后更新时间文字的样式
	 * @property {Boolean} watchRefresherTouchmove 是否实时监听下拉刷新中进度，并通过@refresherTouchmove传递给父组件，默认为false
	 * @property {Boolean} showRefresherUpdateTime 是否显示最后更新时间，默认为false
	 * @property {String|Object} refresherDefaultText 自定义下拉刷新默认状态下的文字
	 * @property {String|Object} refresherPullingText 自定义下拉刷新松手立即刷新状态下的文字
	 * @property {String|Object} refresherRefreshingText 自定义下拉刷新刷新中状态下的文字
	 * @property {String|Object} refresherCompleteText 自定义下拉刷新刷新结束状态下的文字
	 * @property {String} refresherDefaultImg 自定义下拉刷新默认状态下的图片
	 * @property {String} refresherPullingImg 自定义下拉刷新松手立即刷新状态下的图片
	 * @property {String} refresherRefreshingImg 自定义下拉刷新刷新中状态下的图片
	 * @property {String} refresherCompleteImg 自定义下拉刷新刷新结束状态下的图片
	 * @property {Boolean} refresherRefreshingAnimated 自定义下拉刷新刷新中状态下是否展示旋转动画，默认为true
	 * @property {Boolean} refresherEndBounceEnabled 是否开启自定义下拉刷新刷新结束回弹动画效果，默认为true
	 * @property {String} refresherDefaultStyle 设置系统下拉刷新默认样式，支持设置black，white，none，默认为black
	 * @property {String} refresherBackground 设置自定义下拉刷新区域背景颜色，默认为#FFFFFF00
	 * @property {String} refresherFixedBackground 设置固定的自定义下拉刷新区域背景颜色，默认为#FFFFFF00
	 * @property {Number|String} refresherFixedBacHeight 设置固定的自定义下拉刷新区域高度，默认为0
	 * @property {Number|String} refresherDefaultDuration 设置自定义下拉刷新默认状态下回弹动画时间，单位为毫秒，默认为100
	 * @property {Number|String} refresherCompleteDelay 自定义下拉刷新结束以后延迟收回的时间，单位为毫秒，默认为0
	 * @property {Number|String} refresherCompleteDuration 自定义下拉刷新结束收回动画时间，单位为毫秒，默认为300
	 * @property {Boolean} refresherVibrate 下拉刷新时下拉到“松手立即刷新”状态时是否使手机短振动，默认为false
	 * @property {Boolean} refresherRefreshingScrollable 自定义下拉刷新刷新中状态是否允许列表滚动，默认为true
	 * @property {Boolean} refresherCompleteScrollable 自定义下拉刷新结束状态下是否允许列表滚动，默认为false
	 * @property {Number} refresherOutRate 设置自定义下拉刷新下拉超出阈值后继续下拉位移衰减的比例，默认为0.65
	 * @property {Boolean} refresherF2Enabled 是否开启下拉进入二楼功能，默认为false
	 * @property {Number|String} refresherF2Threshold 下拉进入二楼阈值，默认为200rpx
	 * @property {Number|String} refresherF2Duration 下拉进入二楼动画时间，单位为毫秒，默认为200
	 * @property {Boolean} showRefresherF2 下拉进入二楼状态松手后是否弹出二楼，默认为true
	 * @property {Number} refresherPullRate 设置自定义下拉刷新下拉时实际下拉位移与用户下拉距离的比值，默认为0.75
	 * @property {Number|String} refresherFps 自定义下拉刷新下拉帧率，默认为40
	 * @property {Number|String} refresherMaxAngle 自定义下拉刷新允许触发的最大下拉角度，默认为40度
	 * @property {Boolean} refresherAngleEnableChangeContinued 自定义下拉刷新的角度由未达到最大角度变到达到最大角度时，是否继续下拉刷新手势，默认为false
	 * @property {Boolean} refresherNoTransform 下拉刷新时是否禁止下拉刷新view跟随用户触摸竖直移动，默认为false
	 * @property {Boolean} loadingMoreEnabled 是否启用加载更多数据(含滑动到底部加载更多数据和点击加载更多数据)，默认为true
	 * @property {Number|String} lowerThreshold 距底部/右边多远时，触发scrolltolower事件，默认单位为px，默认为100rpx
	 * @property {Boolean} toBottomLoadingMoreEnabled 是否启用滑动到底部加载更多数据，默认为true
	 * @property {String} loadingMoreThemeStyle 底部加载更多的主题样式，支持black，white，默认为black
	 * @property {Object} loadingMoreCustomStyle 自定义底部加载更多样式
	 * @property {Object} loadingMoreTitleCustomStyle 自定义底部加载更多文字样式
	 * @property {Object} loadingMoreLoadingIconCustomStyle 自定义底部加载更多加载中动画样式
	 * @property {String} loadingMoreLoadingIconType 自定义底部加载更多加载中动画图标类型，可选flower或circle，默认为flower
	 * @property {String} loadingMoreLoadingIconCustomImage 自定义底部加载更多加载中动画图标图片
	 * @property {Boolean} loadingMoreLoadingAnimated 底部加载更多加载中view是否展示旋转动画，默认为true
	 * @property {String|Object} loadingMoreDefaultText 滑动到底部"默认"文字
	 * @property {String|Object} loadingMoreLoadingText 滑动到底部"加载中"文字
	 * @property {String|Object} loadingMoreNoMoreText 滑动到底部"没有更多"文字
	 * @property {String|Object} loadingMoreFailText 滑动到底部"加载失败"文字
	 * @property {Boolean} hideNoMoreInside 当没有更多数据且分页内容未超出z-paging时是否隐藏没有更多数据的view，默认为false
	 * @property {Number} hideNoMoreByLimit 当没有更多数据且分页数组长度少于这个值时，隐藏没有更多数据的view，默认为0
	 * @property {Boolean} insideMore 当分页未满一屏时，是否自动加载更多，默认为false
	 * @property {Boolean} loadingMoreDefaultAsLoading 滑动到底部状态为默认状态时，以加载中的状态展示，默认为false
	 * @property {Boolean} showLoadingMoreNoMoreView 是否显示没有更多数据的view，默认为true
	 * @property {Boolean} showDefaultLoadingMoreText 是否显示默认的加载更多text，默认为true
	 * @property {Boolean} showLoadingMoreNoMoreLine 是否显示没有更多数据的分割线，默认为true
	 * @property {Object} loadingMoreNoMoreLineCustomStyle 自定义底部没有更多数据的分割线样式
	 * @property {Boolean} hideEmptyView 是否强制隐藏空数据图，默认为false
	 * @property {Boolean} emptyViewFixed 空数据图片是否铺满z-paging，默认为false
	 * @property {Boolean} emptyViewCenter 空数据图片是否垂直居中，默认为true
	 * @property {String|Object} emptyViewText 空数据图描述文字
	 * @property {String} emptyViewImg 空数据图图片
	 * @property {String} emptyViewErrorImg 空数据图“加载失败”图片
	 * @property {String|Object} emptyViewReloadText 空数据图点击重新加载文字
	 * @property {String|Object} emptyViewErrorText 空数据图“加载失败”描述文字
	 * @property {Object} emptyViewSuperStyle 空数据图父view样式
	 * @property {Object} emptyViewStyle 空数据图样式
	 * @property {Object} emptyViewImgStyle 空数据图img样式
	 * @property {Object} emptyViewTitleStyle 空数据图描述文字样式
	 * @property {Object} emptyViewReloadStyle 空数据图重新加载按钮样式
	 * @property {Boolean} showEmptyViewReload 是否显示空数据图重新加载按钮(无数据时)，默认为false
	 * @property {Boolean} showEmptyViewReloadWhenError 加载失败时是否显示空数据图重新加载按钮，默认为true
	 * @property {Boolean} autoHideEmptyViewWhenLoading 加载中时是否自动隐藏空数据图，默认为true
	 * @property {Boolean} autoHideEmptyViewWhenPull 用户下拉列表触发下拉刷新加载中时是否自动隐藏空数据图，默认为true
	 * @property {Boolean} autoHideLoadingAfterFirstLoaded 第一次加载后自动隐藏loading slot，默认为true
	 * @property {Boolean} loadingFullFixed loading slot的父view是否铺满屏幕并固定，默认为false
	 * @property {Boolean} autoShowSystemLoading 是否自动显示系统Loading：即uni.showLoading，默认为false
	 * @property {String|Object} systemLoadingText 显示系统Loading时显示的文字
	 * @property {Boolean} systemLoadingMask 显示系统Loading时是否显示透明蒙层，防止触摸穿透，默认为true
	 * @property {Boolean} autoShowBackToTop 自动显示点击返回顶部按钮，默认为false
	 * @property {Number|String} backToTopThreshold 点击返回顶部按钮显示/隐藏的阈值(滚动距离)，默认单位为px，默认为400rpx
	 * @property {String} backToTopImg 点击返回顶部按钮的自定义图片地址
	 * @property {Boolean} backToTopWithAnimate 点击返回顶部按钮返回到顶部时是否展示过渡动画，默认为true
	 * @property {Number|String} backToTopBottom 点击返回顶部按钮与底部的距离，默认单位为px，默认为160rpx
	 * @property {Object} backToTopStyle 点击返回顶部按钮的自定义样式
	 * @property {Boolean} useVirtualList 是否使用虚拟列表，默认为false
	 * @property {Boolean} useCompatibilityMode 在使用虚拟列表时，是否使用兼容模式，默认为false
	 * @property {Object} extraData 使用兼容模式时传递的附加数据
	 * @property {String} cellHeightMode 虚拟列表cell高度模式，默认为fixed
	 * @property {Number|String} preloadPage 预加载的列表可视范围(列表高度)页数，默认为12
	 * @property {Number|String} fixedCellHeight 固定的cell高度，`cell-height-mode=fixed`才有效，默认为空
	 * @property {Number|String} virtualListCol 虚拟列表列数，默认为1
	 * @property {Number|String} virtualScrollFps 虚拟列表scroll取样帧率，默认为80
	 * @property {String} virtualCellIdPrefix 虚拟列表cell id的前缀
	 * @property {Boolean} useInnerList 是否在z-paging内部循环渲染列表(使用内置列表)，默认为false
	 * @property {Boolean} forceCloseInnerList 强制关闭inner-list，默认为false
	 * @property {Boolean} virtualInSwiperSlot 虚拟列表是否使用swiper-item包裹，默认为false
	 * @property {String} cellKeyName 内置列表cell的key名称(仅nvue有效)
	 * @property {Object} innerListStyle innerList样式
	 * @property {Object} innerCellStyle innerCell样式
	 * @property {Number|String} localPagingLoadingTime 本地分页时上拉加载更多延迟时间，单位为毫秒，默认为200
	 * @property {Boolean} useChatRecordMode 使用聊天记录模式，默认为false
	 * @property {Boolean} autoHideKeyboardWhenChat 使用聊天记录模式时是否自动隐藏键盘，默认为true
	 * @property {Boolean} autoAdjustPositionWhenChat 使用聊天记录模式中键盘弹出时是否自动调整slot="bottom"高度，默认为true
	 * @property {Boolean} autoToBottomWhenChat 使用聊天记录模式中键盘弹出时是否自动滚动到底部，默认为false
	 * @property {String} chatAdjustPositionOffset 使用聊天记录模式中键盘弹出时占位高度偏移距离，默认为0px
	 * @property {Boolean} showChatLoadingWhenReload 使用聊天记录模式中`reload`时是否显示`chatLoading`，默认为false
	 * @property {String} bottomBgColor `bottom`的背景色，默认透明
	 * @property {Boolean} chatLoadingMoreDefaultAsLoading 在聊天记录模式中滑动到顶部状态为默认状态时，是否以加载中的状态展示，默认为true
	 * @property {Boolean} showScrollbar 控制是否出现滚动条，默认为true
	 * @property {Boolean} scrollable 是否可以滚动，使用内置scroll-view和nvue时有效，默认为true
	 * @property {Boolean} scrollX 是否允许横向滚动，默认为false
	 * @property {Boolean} scrollToTopBounceEnabled iOS设备上滚动到顶部时是否允许回弹效果，默认为false
	 * @property {Boolean} scrollToBottomBounceEnabled iOS设备上滚动到底部时是否允许回弹效果，默认为true
	 * @property {Boolean} scrollWithAnimation 在设置滚动条位置时使用动画过渡，默认为false
	 * @property {String} scrollIntoView 值应为某子元素id（id不能以数字开头）。设置哪个方向可滚动，则在哪个方向滚动到该元素
	 * @property {Boolean} enableBackToTop iOS点击顶部状态栏、安卓双击标题栏时，滚动条返回顶部，默认为true
	 * @property {String} nvueListIs nvue中修改列表类型，默认为list
	 * @property {Object} nvueWaterfallConfig waterfall配置，仅在nvue中且nvueListIs=waterfall时有效
	 * @property {Boolean} nvueBounce nvue控制是否回弹效果，iOS不支持动态修改，默认为true
	 * @property {Boolean} nvueFastScroll nvue中通过代码滚动到顶部/底部时，是否加快动画效果，默认为false
	 * @property {String} nvueListId nvue中list的id
	 * @property {Boolean} hideNvueBottomTag 是否隐藏nvue列表底部的tagView，默认为false
	 * @property {Boolean} nvuePagingEnabled 设置nvue中是否按分页模式(类似竖向swiper)显示List，默认为false
	 * @property {Number} offsetAccuracy nvue中控制onscroll事件触发的频率，默认为空
	 * @property {Boolean} useCache 是否使用缓存，默认为false
	 * @property {String} cacheKey 使用缓存时缓存的key
	 * @property {String} cacheMode 缓存模式，默认为default
	 * @property {Number} topZIndex slot="top"的view的z-index，默认为99
	 * @property {Number} superContentZIndex z-paging内容容器父view的z-index，默认为1
	 * @property {Number} contentZIndex z-paging内容容器部分的z-index，默认为1
	 * @property {Number} emptyViewZIndex 空数据view的z-index，默认为9
	 * @property {Boolean} autoHeight z-paging是否自动高度，默认为false
	 * @property {Number|String} autoHeightAddition z-paging自动高度时的附加高度，默认为0px
	 * @event {Function} input 父组件v-model所绑定的list的值改变时触发此事件
	 * @event {Function} query 下拉刷新或滚动到底部时会自动触发此方法。z-paging加载时也会触发(若要禁止，请设置:auto="false")。pageNo和pageSize会自动计算好，直接传给服务器即可。
	 * @event {Function} listChange 分页渲染的数组改变时触发
	 * @event {Function} refresherStatusChange 自定义下拉刷新状态改变
	 * @event {Function} refresherTouchstart 自定义下拉刷新下拉开始
	 * @event {Function} refresherTouchmove 自定义下拉刷新下拉拖动中
	 * @event {Function} refresherTouchend 自定义下拉刷新下拉结束
	 * @event {Function} refresherF2Change 下拉进入二楼状态改变
	 * @event {Function} refresh 自定义下拉刷新被触发
	 * @event {Function} restore 自定义下拉刷新被复位
	 * @event {Function} loadingStatusChange 自定义下拉刷新状态改变
	 * @event {Function} emptyViewReload 点击了空数据图中的重新加载按钮
	 * @event {Function} emptyViewClick 点击了空数据图view
	 * @event {Function} isLoadFailedChange z-paging请求失败状态改变
	 * @event {Function} backToTopClick 点击了返回顶部按钮
	 * @event {Function} virtualListChange 虚拟列表当前渲染的数组改变时触发
	 * @event {Function} innerCellClick 使用虚拟列表或内置列表时点击了cell
	 * @event {Function} virtualPlaceholderTopHeight 虚拟列表顶部占位高度改变
	 * @event {Function} hidedKeyboard 在聊天记录模式下，触摸列表隐藏了键盘
	 * @event {Function} keyboardHeightChange 键盘高度改变
	 * @event {Function} scroll z-paging列表滚动时触发
	 * @event {Function} scrollTopChange scrollTop改变时触发
	 * @event {Function} scrolltolower z-paging内置的scroll-view/list-view/waterfall滚动底部时触发
	 * @event {Function} scrolltoupper z-paging内置的scroll-view/list-view/waterfall滚动顶部时触发
	 * @event {Function} scrollend z-paging内置的list滚动结束时触发
	 * @event {Function} contentHeightChanged z-paging中内容高度改变时触发
	 * @event {Function} touchDirectionChange 监听列表触摸方向改变(nvue无效)
	 * @event {Function} scrollDirectionChange 监听列表滚动方向改变(页面滚动无效)
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
<!-- #ifdef APP-VUE || MP-WEIXIN || MP-QQ || H5 -->
<script src="./wxs/z-paging-wxs.wxs" module="pagingWxs" lang="wxs"></script>
<!-- #endif -->

	
<style scoped>
	@import "./css/z-paging-main.css";
	@import "./css/z-paging-static.css";
</style>
