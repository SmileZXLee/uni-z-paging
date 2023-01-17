<!-- z-tabs v0.2.5 by-ZXLee -->
<!-- github地址:https://github.com/SmileZXLee/uni-z-tabs -->
<!-- dcloud地址:https://ext.dcloud.net.cn/plugin?name=z-tabs -->
<!-- 反馈QQ群：790460711 -->

<template name="z-tabs">
	<view class="z-tabs-conatiner" :style="[{background:bgColor}, tabsStyle]">
		<view class="z-tabs-left">
			<slot name="left" />
		</view>
		<view ref="z-tabs-scroll-view-conatiner" class="z-tabs-scroll-view-conatiner">
			<scroll-view ref="z-tabs-scroll-view" class="z-tabs-scroll-view" :scroll-x="true" :scroll-left="scrollLeft" :show-scrollbar="false" :scroll-with-animation="isFirstLoaded" @scroll="scroll">
				<view class="z-tabs-list-container" :style="[tabsListStyle]">
					<view class="z-tabs-list" :style="[tabsListStyle, {marginTop: -finalBottomSpace+'px'}]">
						<view :ref="`z-tabs-item-${index}`" :id="`z-tabs-item-${index}`" class="z-tabs-item" :style="[tabStyle]" v-for="(item,index) in list" :key="index" @click="tabsClick(index,item)">
							<view class="z-tabs-item-title-container">
								<text :class="{'z-tabs-item-title':true,'z-tabs-item-title-disabled':item.disabled}" 
									:style="[{color:item.disabled?disabledColor:(currentIndex===index?activeColor:inactiveColor)},item.disabled?disabledStyle:(currentIndex===index?activeStyle:inactiveStyle)]">
									{{item[nameKey]||item}}
								</text>
								<text v-if="item.badge&&_formatCount(item.badge.count).length" class="z-tabs-item-badge" :style="[badgeStyle]">{{_formatCount(item.badge.count)}}</text>
							</view>
						</view>
					</view>
					<view class="z-tabs-bottom" :style="[{width: tabsContainerWidth+'px', bottom: finalBottomSpace+'px'}]">
						<view ref="z-tabs-bottom-dot" class="z-tabs-bottom-dot"
						<!-- #ifndef APP-NVUE -->
						:style="[{transform:`translateX(${bottomDotX}px)`,transition:dotTransition,background:activeColor},finalDotStyle]"
						<!-- #endif -->
						<!-- #ifdef APP-NVUE -->
						:style="[{background:activeColor},finalDotStyle]"
						<!-- #endif -->
						/>
					</view>	
				</view>
			</scroll-view>
		</view>
		<view class="z-tabs-right">
			<slot name="right" />
		</view>
		
	</view>
</template>

<script>
	// #ifdef APP-NVUE
	const weexDom = weex.requireModule('dom');
	const weexAnimation = weex.requireModule('animation');
	// #endif
	import zTabsConfig from './config/index'
	
	//获取默认配置信息
	function _gc(key, defaultValue) {
		let config = null;
		if (zTabsConfig && Object.keys(zTabsConfig).length) {
			config = zTabsConfig;
		} else {
			return defaultValue;
		}
		const value = config[_toKebab(key)];
		return value === undefined ? defaultValue : value;
	}
	//驼峰转短横线
	function _toKebab(value) {
		return value.replace(/([A-Z])/g, "-$1").toLowerCase();
	}
	
	/**
	 * z-tabs 标签
	 * @description 一个简单轻量的tabs标签，全平台兼容，支持nvue、vue3
	 * @tutorial https://ext.dcloud.net.cn/plugin?name=z-tabs
	 * @property {Array} list 数据源数组，支持形如['tab1','tab2']的格式或[{name:'tab1',value:1}]的格式
	 * @property {Number|String} current 当前选中的index，默认为0
	 * @property {Number|String} scroll-count list数组长度超过scrollCount时滚动显示(不自动铺满全屏)，默认为5
	 * @property {Number|String} tab-width 自定义每个tab的宽度，默认为0，即代表根据内容自动撑开，单位rpx，支持传100、"100px"或"100rpx"
	 * @property {Number|String} bar-width 滑块宽度，单位rpx，支持传100、"100px"或"100rpx"
	 * @property {Number|String} bar-height 滑块高度，单位rpx，支持传100、"100px"或"100rpx"
	 * @property {Object} bar-style 滑块样式，其中的width和height将被bar-width和bar-height覆盖
	 * @property {Number|String} bottom-space tabs与底部的间距，单位rpx，支持传100、"100px"或"100rpx"
	 * @property {String} bar-animate-mode 切换tab时滑块动画模式，与swiper联动时有效，点击切换tab时无效，必须调用setDx。默认为line，即切换tab时滑块宽度保持不变，线性运动。可选值为worm，即为类似毛毛虫蠕动效果
	 * @property {String} name-key list中item的name(标题)的key，默认为name
	 * @property {String} value-key list中item的value的key，默认为value
	 * @property {String} active-color 激活状态tab的颜色
	 * @property {String} inactive-color 未激活状态tab的颜色
	 * @property {String} disabled-color 禁用状态tab的颜色
	 * @property {Object} active-style 激活状态tab的样式
	 * @property {Object} inactive-style 未激活状态tab的样式
	 * @property {Object} disabled-style 禁用状态tab的样式
	 * @property {Number|String} badge-max-count 徽标数最大数字限制，超过这个数字将变成badge-max-count+，默认为99
	 * @property {Object} badge-style 徽标样式，例如可自定义背景色，字体等等
	 * @property {String} bg-color z-tabs背景色
	 * @property {Object} tabs-style z-tabs样式
	 * @property {Boolean} init-trigger-change 初始化时是否自动触发change事件
	 * @event {Function(index,value)} change tabs改变时触发，index:当前切换到的index；value:当前切换到的value
	 * @example <z-tabs :list="list"></z-tabs>
	 */
	export default {
		name: 'z-tabs',
		data() {
			return {
				currentIndex: 0,
				currentSwiperIndex: 0,
				bottomDotX: -1,
				bottomDotXForIndex: 0,
				showBottomDot: false,
				shouldSetDx: true,
				
				barCalcedWidth: 0,
				pxBarWidth: 0,
				scrollLeft: 0,
				tabsSuperWidth: uni.upx2px(750),
				tabsWidth: uni.upx2px(750),
				tabsHeight: uni.upx2px(80),
				tabsLeft: 0,
				tabsContainerWidth: 0,
				itemNodeInfos: [],
				isFirstLoaded: false,
				currentScrollLeft: 0,
				changeTriggerFailed: false,
				currentChanged: false
			};
		},
		props: {
			//数据源数组，支持形如['tab1','tab2']的格式或[{name:'tab1',value:1}]的格式
			list: {
				type: Array,
				default: function() {
					return [];
				}
			},
			//当前选中的index
			current: {
				type: [Number, String],
				default: _gc('current',0)
			},
			//list数组长度超过scrollCount时滚动显示(不自动铺满全屏)
			scrollCount: {
				type: [Number, String],
				default: _gc('scrollCount',5)
			},
			//z-tabs样式
			tabsStyle: {
				type: Object,
				default: function() {
					return _gc('tabsStyle',{})
				}
			},
			//自定义每个tab的宽度，默认为0，即代表根据内容自动撑开，单位rpx，支持传100、"100px"或"100rpx"
			tabWidth: {
				type: [Number, String],
				default: _gc('tabWidth',0)
			},
			//滑块宽度，单位rpx，支持传100、"100px"或"100rpx"
			barWidth: {
				type: [Number, String],
				default: _gc('barWidth',45)
			},
			//滑块高度，单位rpx，支持传100、"100px"或"100rpx"
			barHeight: {
				type: [Number, String],
				default: _gc('barHeight',8)
			},
			//滑块样式，其中的width和height将被barWidth和barHeight覆盖
			barStyle: {
				type: Object,
				default: function() {
					return _gc('barStyle',{});
				}
			},
			//tabs与底部的间距，单位rpx，支持传100、"100px"或"100rpx"
			bottomSpace: {
				type: [Number, String],
				default: _gc('bottomSpace',8)
			},
			//切换tab时滑块动画模式，与swiper联动时有效，点击切换tab时无效，必须调用setDx。默认为line，即切换tab时滑块宽度保持不变，线性运动。可选值为worm，即为类似毛毛虫蠕动效果
			barAnimateMode: {
				type: String,
				default: _gc('barAnimateMode','line')
			},
			//list中item的name(标题)的key
			nameKey: {
				type: String,
				default: _gc('nameKey','name')
			},
			//list中item的value的key
			valueKey: {
				type: String,
				default: _gc('valueKey','value')
			},
			//激活状态tab的颜色
			activeColor: {
				type: String,
				default: _gc('activeColor','#007AFF')
			},
			//未激活状态tab的颜色
			inactiveColor: {
				type: String,
				default: _gc('inactiveColor','#666666')
			},
			//禁用状态tab的颜色
			disabledColor: {
				type: String,
				default: _gc('disabledColor','#bbbbbb')
			},
			//激活状态tab的样式
			activeStyle: {
				type: Object,
				default: function() {
					return _gc('activeStyle',{});
				}
			},
			//未激活状态tab的样式
			inactiveStyle: {
				type: Object,
				default: function() {
					return _gc('inactiveStyle',{});
				}
			},
			//禁用状态tab的样式
			disabledStyle: {
				type: Object,
				default: function() {
					return _gc('disabledStyle',{});
				}
			},
			//z-tabs背景色
			bgColor: {
				type: String,
				default: _gc('bgColor','white')
			},
			//徽标数最大数字限制，超过这个数字将变成badgeMaxCount+
			badgeMaxCount: {
				type: [Number, String],
				default: _gc('badgeMaxCount',99)
			},
			//徽标样式，例如可自定义背景色，字体等等
			badgeStyle: {
				type: Object,
				default: function() {
					return _gc('badgeStyle',{})
				}
			},
			//初始化时是否自动触发change事件
			initTriggerChange: {
				type: Boolean,
				default: _gc('initTriggerChange',false)
			}
		},
		mounted() {
			this.updateSubviewLayout();
		},
		watch: {
			current: {
				handler(newVal) {
					this.currentChanged && this._lockDx();
					this.currentIndex = newVal;
					this._preUpdateDotPosition(this.currentIndex);
					if (this.initTriggerChange) {
						if (newVal < this.list.length) {
							this.$emit('change', newVal, this.list[newVal][this.valueKey]);
						}else {
							this.changeTriggerFailed = true;
						}
					}
					this.currentChanged = true;
				},
				immediate: true
			},
			list: {
				handler(newVal) {
					this._handleListChange(newVal);
				},
				immediate: false
			},
			bottomDotX(newVal) {
				if(newVal >= 0){
					// #ifndef APP-NVUE
					this.showBottomDot = true;
					// #endif
					this.$nextTick(() => {
						// #ifdef APP-NVUE
						weexAnimation.transition(this.$refs['z-tabs-bottom-dot'], {
							styles: {
								transform: `translateX(${newVal}px)`
							},
							duration: this.showAnimate ? 200 : 0,
							delay: 0
						})
						setTimeout(() => {
							this.showBottomDot = true;
						},10)
						// #endif
					})
				}
			},
			finalBarWidth: {
				handler(newVal) {
					this.barCalcedWidth = newVal;
					this.pxBarWidth = this.barCalcedWidth;
				},
				immediate: true
			},
			currentIndex: {
				handler(newVal) {
					this.currentSwiperIndex = newVal;
				},
				immediate: true
			}
		},
		computed: {
			shouldScroll(){
				return this.list.length > this.scrollCount;
			},
			finalTabsHeight(){
				return this.tabsHeight;
			},
			tabStyle(){
				const stl = this.shouldScroll ? {'flex-shrink': 0} : {'flex': 1};
				if(this.finalTabWidth > 0){
					stl['width'] = this.finalTabWidth + 'px';
				}else{
					delete stl.width;
				} 
				return stl;
			},
			tabsListStyle(){
				return this.shouldScroll ? {} : {'flex':1};
			},
			showAnimate(){
				return this.isFirstLoaded && !this.shouldSetDx;
			},
			dotTransition(){
				return this.showAnimate ? 'transform .2s linear':'none';
			},
			finalDotStyle(){
				return {...this.barStyle, width: this.barCalcedWidth + 'px', height: this.finalBarHeight + 'px', opacity: this.showBottomDot ? 1 : 0};
			},
			finalTabWidth(){
				return this._convertTextToPx(this.tabWidth);
			},
			finalBarWidth(){
				return this._convertTextToPx(this.barWidth);
			},
			finalBarHeight(){
				return this._convertTextToPx(this.barHeight);
			},
			finalBottomSpace(){
				return this._convertTextToPx(this.bottomSpace);
			}
		},
		methods: {
			//根据swiper的@transition实时更新底部dot位置
			setDx(dx) {
				if (!this.shouldSetDx) return;
				const isLineMode = this.barAnimateMode === 'line';
				const isWormMode = this.barAnimateMode === 'worm';
				let dxRate = dx / this.tabsSuperWidth;
				this.currentSwiperIndex = this.currentIndex + parseInt(dxRate);
				const isRight = dxRate > 0;
				const barWidth = this.pxBarWidth;
				if(this.currentSwiperIndex !== this.currentIndex){
					dxRate = dxRate - (this.currentSwiperIndex - this.currentIndex);
					const currentNode = this.itemNodeInfos[this.currentSwiperIndex];
					if (!!currentNode){
						this.bottomDotXForIndex = this._getBottomDotX(currentNode, barWidth);
					}
				}
				const currentIndex = this.currentSwiperIndex;
				let nextIndex = currentIndex + (isRight ? 1 : -1);
				nextIndex = Math.max(0, nextIndex);
				nextIndex = Math.min(nextIndex, this.itemNodeInfos.length - 1);
				const currentNodeInfo = this.itemNodeInfos[currentIndex];
				const nextNodeInfo = this.itemNodeInfos[nextIndex];
				const nextBottomX = this._getBottomDotX(nextNodeInfo, barWidth);
				if (isLineMode){
					this.bottomDotX = this.bottomDotXForIndex + (nextBottomX - this.bottomDotXForIndex) * Math.abs(dxRate);
				} else if (isWormMode) {
					if ((isRight && currentIndex >= this.itemNodeInfos.length - 1) || (!isRight && currentIndex <= 0)) return;
					const spaceOffset = isRight ? nextNodeInfo.right - currentNodeInfo.left : currentNodeInfo.right - nextNodeInfo.left;
					let barCalcedWidth = barWidth + spaceOffset * Math.abs(dxRate);
					if (isRight) {
						if (barCalcedWidth > nextBottomX - this.bottomDotX + barWidth) {
							const barMinusWidth = barWidth + spaceOffset * (1 - dxRate);
							this.bottomDotX = this.bottomDotXForIndex + (barCalcedWidth - barMinusWidth) / 2;
							barCalcedWidth = barMinusWidth;
						}
					}else if (!isRight) {
						if (barCalcedWidth > this.bottomDotXForIndex + barWidth - nextBottomX){
							const barMinusWidth = barWidth + spaceOffset * (1 + dxRate);
							barCalcedWidth = barMinusWidth;
							this.bottomDotX = nextBottomX;
						} else{
							this.bottomDotX = this.bottomDotXForIndex - (barCalcedWidth - barWidth);
						}
					}
					barCalcedWidth = Math.max(barCalcedWidth, barWidth);
					this.barCalcedWidth = barCalcedWidth;
				}
			},
			//在swiper的@animationfinish中通知z-tabs结束多setDx的锁定，若在父组件中调用了setDx，则必须调用unlockDx
			unlockDx() {
				this.$nextTick(() => {
					this.shouldSetDx = true;
				})
			},
			//更新z-tabs内部布局
			updateSubviewLayout(tryCount = 0) {
				this.$nextTick(() => {
					let delayTime = 10;
					// #ifdef APP-NVUE || MP-BAIDU
					delayTime = 50;
					// #endif
					setTimeout(() => {
						this._getNodeClientRect('.z-tabs-scroll-view-conatiner').then(res=>{
							if (res){ 
								if (!res[0].width && tryCount < 10) {
									setTimeout(() => {
										tryCount ++;
										this.updateSubviewLayout(tryCount);
									}, 50);
									return;
								}
								this.tabsWidth = res[0].width;
								this.tabsHeight = res[0].height;
								this.tabsLeft = res[0].left;
								this._handleListChange(this.list);
							}
						})
						this._getNodeClientRect('.z-tabs-conatiner').then(res=>{
							if(res && res[0].width){
								this.tabsSuperWidth = res[0].width;
							}
						})
					},delayTime)
				})
			},
			//点击了tabs
			tabsClick(index,item) {
				if (item.disabled) return;
				if (this.currentIndex != index) {
					this.shouldSetDx = false;
					this.$emit('change', index, item[this.valueKey]);
					this.currentIndex = index;
					this._preUpdateDotPosition(index);
				} else {
					this.$emit('secondClick',index, item[this.valueKey]);
				}
			},
			//scroll-view滚动
			scroll(e){
				this.currentScrollLeft = e.detail.scrollLeft;
			},
			//锁定dx，用于避免在swiper被动触发滚动时候执行setDx中的代码
			_lockDx() {
				this.shouldSetDx = false;
			},
			//更新底部dot位置之前的预处理
			_preUpdateDotPosition(index) {
				// #ifndef APP-NVUE
				this.$nextTick(() => {
					uni.createSelectorQuery().in(this).select(".z-tabs-scroll-view").fields({
					  scrollOffset: true
					}, data => {
						if (data) {
							this.currentScrollLeft = data.scrollLeft;
							this._updateDotPosition(index);
						} else {
							this._updateDotPosition(index);
						}
					}).exec();
				})
				// #endif
				
				// #ifdef APP-NVUE
				this._updateDotPosition(index);
				// #endif
			},
			//更新底部dot位置
			_updateDotPosition(index){
				if(index >= this.itemNodeInfos.length) return;
				this.$nextTick(async ()=>{
					let node = this.itemNodeInfos[index];
					let offset = 0;
					let tabsContainerWidth = this.tabsContainerWidth;
					if (JSON.stringify(this.activeStyle) !== '{}') {
						const nodeRes = await this._getNodeClientRect(`#z-tabs-item-${index}`,true);
						if (nodeRes) {
							node = nodeRes[0];
							offset = this.currentScrollLeft;
							this.tabsHeight = Math.max(node.height + uni.upx2px(28), this.tabsHeight);
							tabsContainerWidth = 0;
							for(let i = 0;i < this.itemNodeInfos.length;i++){
								let oldNode = this.itemNodeInfos[i];
								tabsContainerWidth += i === index ? node.width : oldNode.width;
							}
						}
					}
					this.bottomDotX = this._getBottomDotX(node, this.finalBarWidth, offset);
					this.bottomDotXForIndex = this.bottomDotX;
					if (this.tabsWidth) {
						setTimeout(()=>{
							let scrollLeft = this.bottomDotX - this.tabsWidth / 2 + this.finalBarWidth / 2;
							scrollLeft = Math.max(0,scrollLeft);
							if (tabsContainerWidth) {
								scrollLeft = Math.min(scrollLeft,tabsContainerWidth - this.tabsWidth + 10);
							}
							if (this.shouldScroll && tabsContainerWidth > this.tabsWidth) {
								this.scrollLeft = scrollLeft;
							}
							this.$nextTick(()=>{
								this.isFirstLoaded = true;
							})
						},200)
					}
				})
			},
			// 处理list改变
			_handleListChange(newVal) {
				this.$nextTick(async ()=>{
					if(newVal.length){
						let itemNodeInfos = [];
						let tabsContainerWidth = 0;
						let delayTime = 0;
						// #ifdef MP-BAIDU
						delayTime = 100;
						// #endif
						setTimeout(async()=>{
							for(let i = 0;i < newVal.length;i++){
								const nodeRes = await this._getNodeClientRect(`#z-tabs-item-${i}`,true);
								if(nodeRes){
									const node = nodeRes[0];
									node.left += this.currentScrollLeft;
									itemNodeInfos.push(node);
									tabsContainerWidth += node.width;
								}
								if (i === this.currentIndex){
									this.itemNodeInfos = itemNodeInfos;
									this.tabsContainerWidth = tabsContainerWidth;
									this._updateDotPosition(this.currentIndex);
								}
							}
							this.itemNodeInfos = itemNodeInfos;
							this.tabsContainerWidth = tabsContainerWidth;
							this._updateDotPosition(this.currentIndex);
						},delayTime)
					}
				})
				
				if (this.initTriggerChange && this.changeTriggerFailed && newVal.length) {
					if (this.current < newVal.length) {
						this.$emit('change', this.current, newVal[this.current][this.valueKey]);
					}
				}
			},
			//根据node获取bottomX
			_getBottomDotX(node, barWidth = this.finalBarWidth, offset = 0){
				return node.left + node.width / 2 - barWidth / 2 + offset - this.tabsLeft;
			},
			//获取节点信息
			_getNodeClientRect(select, withRefArr = false) {
				// #ifdef APP-NVUE
				select = select.replace('.', '').replace('#', '');
				const ref = withRefArr ? this.$refs[select][0] : this.$refs[select];
				return new Promise((resolve, reject) => {
					if (ref) {
						weexDom.getComponentRect(ref, option => {
							if (option && option.result) {
								resolve([option.size]);
							} else resolve(false);
						})
					} else resolve(false);
				});
				return;
				// #endif
				const res = uni.createSelectorQuery().in(this);
				res.select(select).boundingClientRect();
				return new Promise((resolve, reject) => {
					res.exec(data => {
						resolve((data && data != '' && data != undefined && data.length) ? data : false);
					});
				});
			},
			//格式化badge中的count
			_formatCount(count) {
				if (!count) return '';
				if (count > this.badgeMaxCount) {
					return this.badgeMaxCount + '+';
				}
				return count.toString();
			},
			//将文本的px或者rpx转为px的值
			_convertTextToPx(text) {
				const dataType = Object.prototype.toString.call(text);
				if (dataType === '[object Number]') {
					return uni.upx2px(text);
				}
				let isRpx = false;
				if (text.indexOf('rpx') !== -1 || text.indexOf('upx') !== -1) {
					text = text.replace('rpx', '').replace('upx', '');
					isRpx = true;
				} else if (text.indexOf('px') !== -1) {
					text = text.replace('px', '');
				} else {
					text = uni.upx2px(text);
				}
				if (!isNaN(text)) {
					if (isRpx) return Number(uni.upx2px(text));
					return Number(text);
				}
				return 0;
			}
		}
		
	}
</script>

<style scoped>
	.z-tabs-conatiner{
		/* #ifndef APP-NVUE */
		overflow: hidden;
		display: flex;
		width: 100%;
		/* #endif */
		/* #ifdef APP-NVUE */
		width: 750rpx;
		/* #endif */
		flex-direction: row;
		height: 80rpx;
	}
	
	.z-tabs-scroll-view-conatiner{
		flex: 1;
		position: relative;
		/* #ifndef APP-NVUE */
		display: flex;
		height: 100%;
		width: 100%;
		/* #endif */
		flex-direction: row;
	}
	
	/* #ifndef APP-NVUE */
	.z-tabs-scroll-view ::-webkit-scrollbar {
		display: none;
		-webkit-appearance: none;
		width: 0 !important;
		height: 0 !important;
		background: transparent;
	}
	/* #endif */
	
	.z-tabs-scroll-view{
		flex-direction: row;
		position: absolute;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		/* #ifndef APP-NVUE */
		width: 100%;
		height: 100%;
		/* #endif */
		flex: 1;
	}
	
	.z-tabs-list-container{
		position: relative;
		/* #ifndef APP-NVUE */
		height: 100%;
		/* #endif */
	}
	
	.z-tabs-list,.z-tabs-list-container{
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
	}
	
	.z-tabs-item{
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		justify-content: center;
		align-items: center;
		padding: 0px 20rpx;
	}
	
	.z-tabs-item-title-container{
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		align-items: center;
	}
	
	.z-tabs-item-title{
		font-size: 30rpx;
	}
	
	.z-tabs-item-title-disabled{
		/* #ifndef APP-NVUE */
		cursor: not-allowed;
		/* #endif */
	}
	
	.z-tabs-item-badge{
		margin-left: 8rpx;
		background-color: #ec5b56;
		color: white;
		font-size: 22rpx;
		border-radius: 100px;
		padding: 0rpx 10rpx;
	}
	
	.z-tabs-bottom{
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
	}
	
	.z-tabs-bottom-dot{
		border-radius: 100px;
	}
	
	.z-tabs-left,.z-tabs-right{
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		align-items: center;
	}
</style>

