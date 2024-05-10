type _Arrayable<T> = T | T[];

declare global {
    /**
     * z-paging返回数据
     *
     * @since 2.5.3
     */
    interface ZPagingReturnData<T> {
        /**
         * 总列表
         */
        totalList: T[];
        /**
         * 是否没有更多数据
         */
        noMore: boolean;
    }

    /**
     * 嵌套父容器信息 [list组件](https://uniapp.dcloud.net.cn/component/list.html)
     *
     * @since 2.0.4
     */
    interface ZPagingSetSpecialEffectsArgs {
        /**
         * 和list同时滚动的组件id，应为外层的scroller
         */
        id?: string;
        /**
         * 要吸顶的header顶部距离scroller顶部的距离
         * - Android暂不支持
         *
         * @default 0
         */
        headerHeight?: number;
    }

    /**
     * z-paging组件实例
     */
    interface ZPagingInstance<T = any> {
        /**
         * 重新加载分页数据，pageNo恢复为默认值，相当于下拉刷新的效果
         *
         * @param [animate=false] 是否展示下拉刷新动画
         */
        reload: (animate?: boolean) => Promise<ZPagingReturnData<T>>;

        /**
         * 刷新列表数据，pageNo和pageSize不会重置，列表数据会重新从服务端获取
         *
         * @since 2.0.4
         */
        refresh: () => Promise<ZPagingReturnData<T>>;

        /**
         * 刷新列表数据至指定页
         *
         * @since 2.5.9
         * @param page 目标页数
         */
        refreshToPage: (page: number) => Promise<ZPagingReturnData<T>>;

        /**
         * 请求结束
         * - 当通过complete传进去的数组长度小于pageSize时，则判定为没有更多了
         *
         * @param [data] 请求结果数组
         * @param [success=true] 是否请求成功
         */
        complete: (data?: T[] | false, success?: boolean) => Promise<ZPagingReturnData<T>>;

        /**
         * 请求结束
         * - 通过total判断是否有更多数据
         *
         * @since 2.0.6
         * @param data 请求结果数组
         * @param total 列表总长度
         * @param [success=true] 是否请求成功
         */
        completeByTotal: (data: T[], total: number, success?: boolean) => Promise<ZPagingReturnData<T>>;

        /**
         * 请求结束
         * - 自行判断是否有更多数据
         *
         * @since 1.9.2
         * @param data 请求结果数组
         * @param noMore 是否没有更多数据
         * @param [success=true] 是否请求成功
         */
        completeByNoMore: (data: T[], noMore: boolean, success?: boolean) => Promise<ZPagingReturnData<T>>;

        /**
         * 请求失败
         * - 通过方法传入请求失败原因，将请求失败原因传递给z-paging展示
         *
         * @since 2.6.3
         * @param cause 请求失败原因
         */
        completeByError: (cause: string) => Promise<ZPagingReturnData<T>>;

        /**
         * 请求结束
         * - 保证数据一致
         *
         * @since 1.6.4
         * @param data 请求结果数组
         * @param key dataKey，需与:data-key绑定的一致
         * @param [success=true] 是否请求成功
         */
        completeByKey: (data: T[], key: string, success?: boolean) => Promise<ZPagingReturnData<T>>;

        /**
         * 清空分页数据，pageNo恢复为默认值
         *
         * @since 2.1.0
         */
        clear: () => void;

        /**
         * 从顶部添加数据，不会影响分页的pageNo和pageSize
         *
         * @param data 需要添加的数据，可以是一条数据或一组数据
         * @param [scrollToTop=true] 是否滚动到顶部，不填默认为true
         * @param [animate=true] 是否使用动画滚动到顶部
         */
        addDataFromTop: (data: _Arrayable<T>, scrollToTop?: boolean, animate?: boolean) => void;

        /**
         * 【不推荐】重新设置列表数据，调用此方法不会影响pageNo和pageSize，也不会触发请求
         * - 适用场景：当需要删除列表中某一项时，将删除对应项后的数组通过此方法传递给z-paging
         *
         * @param data 修改后的列表数组
         */
        resetTotalData: (data: T[]) => void;

        /**
         * 终止下拉刷新状态
         *
         * @since 2.1.0
         */
        endRefresh: () => void;

        /**
         * 手动更新自定义下拉刷新view高度
         * - 常用于某些情况下使用slot="refresher"插入的view高度未能正确计算导致异常时手动更新其高度
         *
         * @since 2.6.1
         */
        updateCustomRefresherHeight: () => void;

        /**
         * 手动关闭二楼
         *
         * @since 2.7.7
         */
        closeF2: () => void;

        /**
         * 手动触发上拉加载更多
         * - 非必须，可依据具体需求使用，例如当z-paging未确定高度时，内部的scroll-view会无限增高，此时z-paging无法得知是否滚动到底部，您可以在页面的onReachBottom中手动调用此方法触发上拉加载更多
         *
         * @param [source] 触发加载更多的来源类型
         */
        doLoadMore: (source?: "click" | "toBottom") => void;

        /**
         * 当使用页面滚动并且自定义下拉刷新时，请在页面的onPageScroll中调用此方法，告知z-paging当前的pageScrollTop，否则会导致在任意位置都可以下拉刷新
         * - 若引入了mixins，则不需要调用此方法
         *
         * @param scrollTop 从page的onPageScroll中获取的scrollTop
         */
        updatePageScrollTop: (scrollTop: number) => void;

        /**
         * 在使用页面滚动并且设置了slot="top"时，默认初次加载会自动获取其高度，并使内部容器下移，当slot="top"的view高度动态改变时，在其高度需要更新时调用此方法
         */
        updatePageScrollTopHeight: () => void;

        /**
         * 在使用页面滚动并且设置了slot="bottom"时，默认初次加载会自动获取其高度，并使内部容器下移，当slot="bottom"的view高度动态改变时，在其高度需要更新时调用此方法
         */
        updatePageScrollBottomHeight: () => void;

        /**
         * 更新slot="left"和slot="right"宽度，当slot="left"或slot="right"宽度动态改变后调用
         *
         * @since 2.3.5
         */
        updateLeftAndRightWidth: () => void;

        /**
         * 更新fixed模式下z-paging的布局，在onShow时候调用，以修复在iOS+h5+tabbar+fixed+底部有安全区域的设备中从tabbar页面跳转到无tabbar页面后返回，底部有一段空白区域的问题
         *
         * @since 2.6.5
         */
        updateFixedLayout: () => void;

        /**
         * 在使用动态高度虚拟列表时，若在列表数组中需要插入某个item，需要调用此方法
         *
         * @since 2.5.9
         * @param item 插入的数据项
         * @param index 插入的cell位置，若为2，则插入的item在原list的index=1之后，从0开始
         */
        doInsertVirtualListItem: (item: T, index: number) => void;

        /**
         * 在使用动态高度虚拟列表时，手动更新指定cell的缓存高度
         * - 当cell高度在初始化之后再次改变时调用
         *
         * @since 2.4.0
         * @param index 需要更新的cell在列表中的位置，从0开始
         */
        didUpdateVirtualListCell: (index: number) => void;

        /**
         * 在使用动态高度虚拟列表时，若删除了列表数组中的某个item，需要调用此方法以更新高度缓存数组
         *
         * @since 2.4.0
         * @param index 需要更新的cell在列表中的位置，从0开始
         */
        didDeleteVirtualListCell: (index: number) => void;

        /**
         * 设置本地分页，请求结束(成功或者失败)调用此方法，将请求的结果传递给z-paging作分页处理
         * - 若调用了此方法，则上拉加载更多时内部会自动分页，不会触发@query所绑定的事件
         *
         * @param data 请求结果数组
         * @param [success=true] 是否请求成功
         */
        setLocalPaging: (data: T[], success?: boolean) => Promise<ZPagingReturnData<T>>;

        /**
         * 手动触发滚动到顶部加载更多，聊天记录模式时有效
         */
        doChatRecordLoadMore: () => void;

        /**
         * 添加聊天记录，use-chat-record-mode为true时有效
         *
         * @param data 需要添加的聊天数据，可以是一条数据或一组数据
         * @param [scrollToBottom=true] 是否滚动到底部
         * @param [animate=true] 是否使用动画滚动到底部
         */
        addChatRecordData: (data: _Arrayable<T>, scrollToBottom?: boolean, animate?: boolean) => void;

        /**
         * 滚动到顶部
         *
         * @param [animate=true] 是否有动画效果
         */
        scrollToTop: (animate?: boolean) => void;

        /**
         * 滚动到底部
         *
         * @param [animate=true] 是否有动画效果
         */
        scrollToBottom: (animate?: boolean) => void;

        /**
         * 滚动到指定view
         * - vue中有效，若此方法无效，请使用scrollIntoViewByNodeTop
         *
         * @param id 需要滚动到的view的id值，不包含"#"
         * @param [offset=0] 偏移量，单位为px
         * @param [animate=false] 是否有动画效果
         */
        scrollIntoViewById: (id: string, offset?: number, animate?: boolean) => void;

        /**
         * 滚动到指定view
         * - vue中有效
         *
         * @since 1.7.4
         * @param top 需要滚动的view的top值(通过uni.createSelectorQuery()获取)
         * @param [offset=0] 偏移量，单位为px
         * @param [animate=false] 是否有动画效果
         */
        scrollIntoViewByNodeTop: (top: number, offset?: number, animate?: boolean) => void;

        /**
         * 滚动到指定view
         * - vue中有效
         * - 与scrollIntoViewByNodeTop的不同之处在于，scrollToY传入的是view相对于屏幕的top值，而scrollIntoViewByNodeTop传入的top值并非是固定的，通过uni.createSelectorQuery()获取到的top会因列表滚动而改变
         *
         * @param top 需要滚动到的view的top值，单位为px
         * @param [offset=0] 偏移量，单位为px
         * @param [animate=false] 是否有动画效果
         */
        scrollToY: (top: number, offset?: number, animate?: boolean) => void;

        /**
         * 滚动到指定view
         * - nvue或虚拟列表中有效
         * - 在nvue中的cell必须设置 :ref="`z-paging-${index}`"
         *
         * @param index 需要滚动到的view的index(第几个)
         * @param [offset=0] 偏移量，单位为px
         * @param [animate=false] 是否有动画效果
         */
        scrollIntoViewByIndex: (index: number, offset?: number, animate?: boolean) => void;

        /**
         * 滚动到指定view
         * - nvue中有效
         *
         * @param view 需要滚动到的view(通过this.$refs.xxx获取)
         * @param [offset=0] 偏移量，单位为px
         * @param [animate=false] 是否有动画效果
         */
        scrollIntoViewByView: (view: any, offset?: number, animate?: boolean) => void;

        /**
         * 设置nvue List的specialEffects
         *
         * @since 2.0.4
         * @param args 参见https://uniapp.dcloud.io/component/list?id=listsetspecialeffects
         */
        setSpecialEffects: (args: ZPagingSetSpecialEffectsArgs) => void;

        /**
         * 与{@link setSpecialEffects}相同
         *
         * @since 2.0.4
         */
        setListSpecialEffects: (args: ZPagingSetSpecialEffectsArgs) => void;

        /**
         * 手动更新列表缓存数据，将自动截取v-model绑定的list中的前pageSize条覆盖缓存，请确保在list数据更新到预期结果后再调用此方法
         *
         * @since 2.3.9
         */
        updateCache: () => void;

        /**
         * 获取当前版本号
         */
        getVersion: () => string;
    }

    /**
     * z-paging全局数据
     * - uni.$zp
     *
     * @since 2.6.5
     */
    interface ZPagingGlobal {
        /**
         * 配置
         */
        config: Record<string, any>;
    }

    /**
     * 虚拟列表数据项
     *
     * @since 2.7.7
     */
    type ZPagingVirtualItem<T> = T & {
        /**
         * 元素真实索引
         */
        zp_index: number;
    };
    
    namespace ZPagingEvent {
        /**
         * query的触发来源：0.用户主动下拉刷新 1.通过reload触发 2.通过refresh触发 3.通过滚动到底部加载更多或点击底部加载更多触发
         */
        type _QueryFrom = 0 | 1 | 2 | 3;
        /**
         * 下拉刷新或滚动到底部时会自动触发此方法
         * 
         * @param pageNo 当前第几页
         * @param pageSize 每页多少条
         * @param from query的触发来源：0.用户主动下拉刷新 1.通过reload触发 2.通过refresh触发 3.通过滚动到底部加载更多或点击底部加载更多触发
         */
        interface Query {
            (pageNo: number, pageSize: number, from: _QueryFrom): void;
        }

        /**
         * 分页渲染的数组改变时触发
         * 
         * @param list 最终的分页数据数组
         */
        interface ListChange {
            (list: []): void;
        }

        /**
         * 下拉刷新状态：0-默认状态 1.松手立即刷新 2.刷新中 3.刷新成功(默认情况下看不到此状态，如果需要展示刷新成功状态，请设置刷新结束以后延时收回的时间，如:refresher-complete-delay="200")
         */
        type _RefresherStatus = 0 | 1 | 2 | 3;
        /**
         * 自定义下拉刷新状态改变
         * - use-custom-refresher为false时无效
         * 
         * @param status 下拉刷新状态：0-默认状态 1.松手立即刷新 2.刷新中 3.刷新成功(默认情况下看不到此状态，如果需要展示刷新成功状态，请设置刷新结束以后延时收回的时间，如:refresher-complete-delay="200")
         */
        interface RefresherStatusChange {
            (status: _RefresherStatus): void;
        }

        /**
         * 自定义下拉刷新下拉开始
         * - use-custom-refresher为false时无效，nvue无效
         * 
         * @param y 当前触摸开始的屏幕点的y值(单位px)
         */
        interface RefresherTouchstart {
            (y: number): void;
        }

        /**
         * touchmove信息
         */
        interface _RefresherTouchmoveInfo {
            /** 下拉的距离 */
            pullingDistance: number;
            /** 前后两次回调滑动距离的差值 */
            dy: number;
            /** refresh组件高度 */
            viewHeight: number;
            /** pullingDistance/viewHeight的比值 */
            rate: number;
        }
        /**
         * 自定义下拉刷新下拉拖动中
         * - use-custom-refresher为false时无效
         * - 在使用wxs的平台上，为减少wxs与js通信折损，只有在z-paging添加@refresherTouchmove时，wxs才会实时将下拉拖动事件传给js，在微信小程序和QQ小程序中，因$listeners无效，所以必须设置:watch-refresher-touchmove="true"方可使此事件被触发
         * 
         * @param info touchmove信息
         */
        interface RefresherTouchmove {
            (info: _RefresherTouchmoveInfo): void;
        }

        /**
         * 自定义下拉刷新下拉结束
         * - use-custom-refresher为false时无效，nvue无效
         * 
         * @param y 当前触摸开始的屏幕点的y值(单位px)
         */
        interface RefresherTouchend {
            (y: number): void;
        }

        /**
         * 下拉进入二楼状态：go-二楼开启 close-二楼关闭
         */
        type _RefresherF2ChangeStatus = 'go' | 'close';
        /**
         * 下拉进入二楼状态改变
         * 
         * @since 2.7.7
         * @param status 下拉进入二楼状态：go-二楼开启 close-二楼关闭
         */
        interface RefresherF2Change {
            (status: _RefresherF2ChangeStatus): void;
        }

        /**
         * 自定义下拉刷新被触发
         */
        interface OnRefresh {
            (): void;
        }

        /**
         * 自定义下拉刷新被复位
         */
        interface OnRestore {
            (): void;
        }

        /**
         * 底部加载更多状态：0-默认状态 1.加载中 2.没有更多数据 3.加载失败
         */
        type _LoadingStatus = 0 | 1 | 2 | 3;
        /**
         * 下拉进入二楼状态改变
         * 
         * @param status 底部加载更多状态：0-默认状态 1.加载中 2.没有更多数据 3.加载失败
         */
        interface LoadingStatusChange {
            (status: _LoadingStatus): void;
        }

        /**
         * 点击空数据图中重新加载后是否进行reload操作，默认为是。如果需要禁止reload事件，则调用handler(false)
         */
        type _EmptyViewReloadHandler = (value: boolean) => void;
        /**
         * 点击了空数据图中的重新加载按钮
         * 
         * @since 1.8.0
         * @param handler 点击空数据图中重新加载后是否进行reload操作，默认为是。如果需要禁止reload事件，则调用handler(false)
         */
        interface EmptyViewReload {
            (handler: _EmptyViewReloadHandler): void;
        }

        /**
         * 点击了空数据图view
         * 
         * @since 2.3.3
         */
        interface EmptyViewClick {
            (): void;
        }

        /**
         * 请求失败状态改变
         * 
         * @since 2.5.0
         * @param isLoadFailed 当前是否是请求失败状态，为true代表是，反之为否；默认状态为否
         */
        interface IsLoadFailedChange {
            (isLoadFailed: boolean): void;
        }

        /**
         * 点击返回顶部按钮后是否滚动到顶部，默认为是。如果需要禁止滚动到顶部事件，则调用handler(false)
         */
        type _BackToTopClickHandler = (value: boolean) => void;
        /**
         * 点击了返回顶部按钮
         * 
         * @since 2.6.1
         * @param handler 点击返回顶部按钮后是否滚动到顶部，默认为是。如果需要禁止滚动到顶部事件，则调用handler(false)
         */
        interface BackToTopClick {
            (handler: _BackToTopClickHandler): void;
        }

        /**
         * 虚拟列表当前渲染的数组改变时触发，在虚拟列表中只会渲染可见区域内+预加载页面的数据
         * -nvue无效
         * 
         * @since 2.2.7
         * @param list 虚拟列表当前渲染的数组
         */
        interface VirtualListChange {
            (list: []): void;
        }

        /**
         * 使用虚拟列表或内置列表时点击了cell的信息
         */
        interface _InnerCellClickInfo<T> {
            /** 当前点击的item */
            item: T;
            /** 当前点击的index */
            index: number;
        }
        /**
         * 使用虚拟列表或内置列表时点击了cell
         * -nvue无效
         * 
         * @since 2.4.0
         * @param info 点击cell的信息
         */
        interface InnerCellClick {
            (info: _InnerCellClickInfo<any>): void;
        }

        /**
         * 在聊天记录模式下，触摸列表隐藏了键盘
         * 
         * @since 2.3.6
         */
        interface HidedKeyboard {
            (): void;
        }

        /**
         * 键盘的高度信息
         */
        interface _KeyboardHeightInfo {
            /** 键盘的高度 */
            height: number;
        }
        /**
         * 键盘高度改变
         * -聊天记录模式启用时才有效，如果在聊天记录模式页面需要监听键盘高度改变，请不要直接通过uni.onKeyboardHeightChange监听，否则可能导致z-paging内置的键盘高度改变监听失效。ps:H5、百度小程序、抖音小程序、飞书小程序不支持
         * 
         * @since 2.7.1
         * @param info 键盘高度信息
         */
        interface KeyboardHeightChange {
            (info: _KeyboardHeightInfo): void;
        }

        /**
         * 列表滚动信息(vue)
         */
        interface _ScrollInfo {
            detail: {
                scrollLeft: number;
                scrollTop: number;
                scrollHeight: number;
                scrollWidth: number;
                deltaX: number;
                deltaY: number;
            }
        }
        /**
         * 列表滚动信息(nvue)
         */
        interface _ScrollInfoN {
            contentSize: {
                width: number;
                height: number;
            };
            contentOffset: {
                x: number;
                y: number;
            };
            isDragging: boolean;
        }
        /**
         * 列表滚动时触发
         * 
         * @param event 滚动事件信息，vue使用_ScrollInfo，nvue使用_ScrollInfoN
         */
        interface Scroll {
            (event: _ScrollInfo | _ScrollInfoN): void;
        }

        /**
         * scrollTop改变时触发，使用点击返回顶部时需要获取scrollTop时可使用此事件
         * 
         * @param scrollTop
         */
        interface ScrollTopChange {
            (scrollTop: number): void;
        }

        /**
         * 内置的scroll-view滚动底部时的来源(toBottom滚动到底部；click点击了加载更多view)
         */
        type _ScrolltolowerFrom = 'toBottom' | 'click';
        /**
         * 内置的scroll-view滚动底部时触发
         * 
         * @param from 来源(toBottom滚动到底部；click点击了加载更多view)
         */
        interface Scrolltolower {
            (from: _ScrolltolowerFrom): void;
        }

        /**
         * 内置的scroll-view滚动顶部时触发
         */
        interface Scrolltoupper {
            (): void;
        }

        /**
         * 滚动结束时触发事件信息
         */
        interface _ScrollendEvent {
            contentSize: {
                width: number;
                height: number;
            };
            contentOffset: {
                x: number;
                y: number;
            };
            isDragging: boolean;
        }
        /**
         * 内置的list滚动结束时触发
         * -仅nvue有效
         * 
         * @since 2.7.3
         * @param event 滚动结束时触发事件信息
         */
        interface Scrollend {
            (event: _ScrollendEvent): void;
        }

        /**
         * z-paging中内容高度改变时触发
         * 
         * @since 2.1.3
         * @param height 改变后的高度
         */
        interface ContentHeightChanged {
            (height: number): void;
        }

        /**
         * 列表触摸的方向，top代表用户将列表向上移动(scrollTop不断减小)，bottom代表用户将列表向下移动(scrollTop不断增大)
         */
        type _TouchDirection = 'top' | 'bottom';
        /**
         * 监听列表触摸方向改变
         * 
         * @since 2.3.0
         * @param direction 列表触摸的方向，top代表用户将列表向上移动(scrollTop不断减小)，bottom代表用户将列表向下移动(scrollTop不断增大)
         */
        interface TouchDirectionChange {
            (direction: _TouchDirection): void;
        }
    }
}

export {};
