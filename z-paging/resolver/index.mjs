function kebabCase(key) {
  return key.replace(/([A-Z])/g, " $1")
    .trim()
    .split(" ")
    .join("-")
    .toLowerCase();
}

export function ZPagingResolver(options = {}) {
  return {
    type: "component",
    resolve: (name) => {
      if (options.exclude && name.match(options.exclude)) {
        return undefined;
      }

      const kebabCaseName = kebabCase(name);

      if (/^(?!z-paging-refresh|z-paging-load-more)z-paging(.*)/.test(kebabCaseName)) {
        return {
          name: kebabCaseName,
          from: `z-paging/components/${kebabCaseName}/${kebabCaseName}.vue`
        };
      }
    }
  };
}
