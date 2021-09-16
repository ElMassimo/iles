// iles.config.ts
import { defineConfig } from "iles";
import iconsResolver from "unplugin-icons/resolver";
import icons from "unplugin-icons/vite";
import windicss from "vite-plugin-windicss";
import inspect from "vite-plugin-inspect";

// src/markdown/prism.ts
async function prism() {
  const { refractor } = await import("refractor");
  const { default: rehypePrism } = await import("@mapbox/rehype-prism");
  refractor.alias({ markup: ["html", "vue"] });
  return rehypePrism;
}

// iles.config.ts
var iles_config_default = defineConfig({
  components: {
    resolvers: [iconsResolver({ componentPrefix: "" })]
  },
  markdown: {
    rehypePlugins: [prism()]
  },
  pages: {
    extendRoute(route) {
      if (route.path.startsWith("/posts") && route.path !== "/posts")
        return { ...route, meta: { ...route.meta, layout: "post" } };
    }
  },
  vite: {
    plugins: [
      icons(),
      windicss(),
      Boolean(process.env.DEBUG) && inspect()
    ]
  }
});
export {
  iles_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiaWxlcy5jb25maWcudHMiLCAic3JjL21hcmtkb3duL3ByaXNtLnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICdpbGVzJ1xuXG5pbXBvcnQgaWNvbnNSZXNvbHZlciBmcm9tICd1bnBsdWdpbi1pY29ucy9yZXNvbHZlcidcblxuaW1wb3J0IGljb25zIGZyb20gJ3VucGx1Z2luLWljb25zL3ZpdGUnXG5pbXBvcnQgd2luZGljc3MgZnJvbSAndml0ZS1wbHVnaW4td2luZGljc3MnXG5pbXBvcnQgaW5zcGVjdCBmcm9tICd2aXRlLXBsdWdpbi1pbnNwZWN0J1xuaW1wb3J0IHJlaHlwZVByaXNtIGZyb20gJy4vc3JjL21hcmtkb3duL3ByaXNtJ1xuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBjb21wb25lbnRzOiB7XG4gICAgcmVzb2x2ZXJzOiBbaWNvbnNSZXNvbHZlcih7IGNvbXBvbmVudFByZWZpeDogJycgfSldLFxuICB9LFxuICBtYXJrZG93bjoge1xuICAgIHJlaHlwZVBsdWdpbnM6IFtyZWh5cGVQcmlzbSgpXSxcbiAgfSxcbiAgcGFnZXM6IHtcbiAgICBleHRlbmRSb3V0ZSAocm91dGUpIHtcbiAgICAgIGlmIChyb3V0ZS5wYXRoLnN0YXJ0c1dpdGgoJy9wb3N0cycpICYmIHJvdXRlLnBhdGggIT09ICcvcG9zdHMnKVxuICAgICAgICByZXR1cm4geyAuLi5yb3V0ZSwgbWV0YTogeyAuLi5yb3V0ZS5tZXRhLCBsYXlvdXQ6ICdwb3N0JyB9IH1cbiAgICB9LFxuICB9LFxuICB2aXRlOiB7XG4gICAgcGx1Z2luczogW1xuICAgICAgaWNvbnMoKSxcbiAgICAgIHdpbmRpY3NzKCksXG4gICAgICBCb29sZWFuKHByb2Nlc3MuZW52LkRFQlVHKSAmJiBpbnNwZWN0KCksXG4gICAgXSxcbiAgfSxcbn0pXG4iLCAiZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gcHJpc20gKCkge1xuICBjb25zdCB7IHJlZnJhY3RvciB9ID0gYXdhaXQgaW1wb3J0KCdyZWZyYWN0b3InKVxuICAvLyBAdHMtaWdub3JlXG4gIGNvbnN0IHsgZGVmYXVsdDogcmVoeXBlUHJpc20gfSA9IGF3YWl0IGltcG9ydCgnQG1hcGJveC9yZWh5cGUtcHJpc20nKVxuICByZWZyYWN0b3IuYWxpYXMoeyBtYXJrdXA6IFsnaHRtbCcsICd2dWUnXX0pXG4gIHJldHVybiByZWh5cGVQcmlzbVxufVxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7OztBQ05BLHVCQUF1QztBQUNyQyxRQUFNLEVBQUUsY0FBYyxNQUFNLE9BQU87QUFFbkMsUUFBTSxFQUFFLFNBQVMsZ0JBQWdCLE1BQU0sT0FBTztBQUM5QyxZQUFVLE1BQU0sRUFBRSxRQUFRLENBQUMsUUFBUTtBQUNuQyxTQUFPO0FBQUE7OztBRElULElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFlBQVk7QUFBQSxJQUNWLFdBQVcsQ0FBQyxjQUFjLEVBQUUsaUJBQWlCO0FBQUE7QUFBQSxFQUUvQyxVQUFVO0FBQUEsSUFDUixlQUFlLENBQUM7QUFBQTtBQUFBLEVBRWxCLE9BQU87QUFBQSxJQUNMLFlBQWEsT0FBTztBQUNsQixVQUFJLE1BQU0sS0FBSyxXQUFXLGFBQWEsTUFBTSxTQUFTO0FBQ3BELGVBQU8sS0FBSyxPQUFPLE1BQU0sS0FBSyxNQUFNLE1BQU0sUUFBUTtBQUFBO0FBQUE7QUFBQSxFQUd4RCxNQUFNO0FBQUEsSUFDSixTQUFTO0FBQUEsTUFDUDtBQUFBLE1BQ0E7QUFBQSxNQUNBLFFBQVEsUUFBUSxJQUFJLFVBQVU7QUFBQTtBQUFBO0FBQUE7IiwKICAibmFtZXMiOiBbXQp9Cg==
