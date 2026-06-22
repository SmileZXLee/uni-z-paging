import { AllowedComponentProps, VNodeProps } from './_common'

// ****************************** Props ******************************
declare interface ZPagingLayoutProps {
  /**
   * 是否在 `z-paging-layout` 的主体内容外层包裹 `scroll-view`，默认为是
   * @default true
   */
  scrollable?: boolean

  /**
   * 是否使用fixed布局，若使用fixed布局，则z-paging-layout的父view无需固定高度，z-paging高度默认铺满屏幕，页面中的view请放z-paging-layout标签内，需要固定在顶部的view使用slot="top"包住，需要固定在底部的view使用slot="bottom"包住。
   * @default true
   */
  fixed?: boolean

  /**
   * 是否开启底部安全区域适配
   * @default false
   */
  safeAreaInsetBottom?: boolean

  /**
   * z-paging-layout样式
   */
  layoutStyle?: Partial<CSSStyleDeclaration>
}


// ****************************** Slots ******************************
declare interface ZPagingLayoutSlots {
  // ******************** 主体布局Slot ********************
  /**
   * 默认插入的view
   */
  ['default']?: () => any

  /**
   * 可以将自定义导航栏、tab-view等需要固定的(不需要跟着滚动的)元素放入slot="top"的view中。
   * 注意，当有多个需要固定的view时，请用一个view包住它们，并且在这个view上设置slot="top"。需要固定在顶部的view请勿设置position: fixed;
   */
  ['top']?: () => any

  /**
   * 可以将需要固定在底部的(不需要跟着滚动的)元素放入slot="bottom"的view中。
   * 注意，当有多个需要固定的view时，请用一个view包住它们，并且在这个view上设置slot="bottom"。需要固定在底部的view请勿设置position: fixed;
   */
  ['bottom']?: () => any

  /**
   * 可以将需要固定在左侧的(不需要跟着滚动的)元素放入slot="left"的view中。
   * 注意，当有多个需要固定的view时，请用一个view包住它们，并且在这个view上设置slot="left"。需要固定在左侧的view请勿设置position: fixed;
   */
  ['left']?: () => any

  /**
   * 可以将需要固定在左侧的(不需要跟着滚动的)元素放入slot="right"的view中。
   * 注意，当有多个需要固定的view时，请用一个view包住它们，并且在这个view上设置slot="right"。需要固定在右侧的view请勿设置position: fixed;
   */
  ['right']?: () => any
}

// ****************************** Methods ******************************
declare interface _ZPagingLayoutRef {
  /**
   * 更新slot="left"和slot="right"宽度，当slot="left"或slot="right"宽度动态改变后调用
   */
  updateLeftAndRightWidth: () => void;

  /**
   * 更新fixed模式下z-paging-layout的布局，在onShow时候调用，以修复在iOS+h5+tabbar+fixed+底部有安全区域的设备中从tabbar页面跳转到无tabbar页面后返回，底部有一段空白区域的问题
   */
  updateFixedLayout: () => void;
}

declare interface _ZPagingLayout {
  new (): {
    $props: AllowedComponentProps &
      VNodeProps &
      ZPagingLayoutProps
    $slots: ZPagingLayoutSlots
  }
}

export declare const ZPagingLayout: _ZPagingLayout

export declare const ZPagingLayoutRef: _ZPagingLayoutRef
