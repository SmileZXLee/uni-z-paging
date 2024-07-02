import type { ComponentResolver } from "unplugin-vue-components";

export interface ZPagingResolverOptions {
  exclude?: RegExp;
}

export function ZPagingResolver(options?: ZPagingResolverOptions): ComponentResolver;

export {};
