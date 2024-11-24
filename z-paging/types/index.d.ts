/// <reference path="./comps.d.ts" />
declare module 'z-paging' {
  export function install() : void
  /**
   * z-paging全局配置
   * - uni.$zp
   *
   * @since 2.6.5
   */
  interface $zp {
    /**
     * 全局配置
     */
    config : Record<string, any>;
  }
  global {
    interface Uni {
      $zp : $zp
    }
  }
}
declare type ZPagingRef = typeof import('./comps/z-paging')['ZPagingRef']
declare type ZPagingSwiperRef = typeof import('./comps/z-paging-swiper')['ZPagingSwiperRef']
declare type ZPagingSwiperItemRef = typeof import('./comps/z-paging-swiper-item')['ZPagingSwiperItemRef']

// 兼容v2.8.1之前的旧版本
declare type ZPagingInstance = typeof import('./comps/z-paging')['ZPagingRef']