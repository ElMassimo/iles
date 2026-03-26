## Summary: îles Codebase Structure and Svelte Hydration
I've conducted a thorough exploration of the îles codebase. Here's the complete picture:
### 1. **Project Structure (Monorepo)**
The îles project is a monorepo using PNPM with the following key packages:
- **Root**: `/home/user/iles/package.json`
- **Main Package**: `/home/user/iles/packages/iles/` (v0.10.0-beta.1) - Core SSG framework
- **Hydration Package**: `/home/user/iles/packages/hydration/` (v0.10.0-beta.1) - Hydration utilities
- **Prerender Package**: `/home/user/iles/packages/prerender/` (v0.10.0-beta.1) - Prerender utilities
- **Blog Example**: `/home/user/iles/playground/the-vue-point/` - Demo blog
- **Documentation**: `/home/user/iles/docs/` - Docs site
### 2. **Svelte Version**
Both `@islands/hydration` and `@islands/prerender` package.json files specify:
- **Svelte**: ^5.1.13 (latest Svelte 5)
- This is Svelte 5, which uses the new `mount` and `unmount` APIs instead of older mounting mechanisms
### 3. **NavBarLinks.svelte Component**
**Location**: `/home/user/iles/playground/the-vue-point/src/components/NavBarLinks.svelte`
This is a simple Svelte component that renders static navigation links. It's used in the blog layout with the `client:none` directive, meaning it's prerendered but not hydrated at runtime.
**Content** (lines 1-20):
- Renders GitHub source link, RSS feed link, and Vue.js link
- Uses Tailwind CSS classes for styling
- No interactivity or state management
**Usage** in layout (default.vue, line 21):
```vue
<NavBarLinks client:none/>
```
### 4. **Svelte Hydration Files**
**Key Files**:
1. **`/home/user/iles/packages/hydration/svelte.ts`** (Main Svelte hydration implementation)
   - Uses `createRawSnippet`, `mount`, `unmount` from Svelte 5
   - Exports `createIsland()` function that:
     - Accepts a Svelte component, DOM element ID, props, and slots
     - Creates `Snippet` objects from pre-rendered HTML slots
     - Mounts the component to the target DOM element using `mount()`
     - Supports disposal/cleanup via `onDispose()` hook
2. **`/home/user/iles/packages/hydration/hydration.ts`** (Core hydration orchestration)
   - `hydrateNow()` - Hydrates immediately (eager hydration)
   - `hydrateWhenIdle()` - Uses `requestIdleCallback` for lazy hydration
   - `hydrateWhenVisible()` - Uses IntersectionObserver for visibility-based hydration
   - `hydrateOnMediaQuery()` - Hydrates when media query matches
   - `onDispose()` - Cleanup/disposal hook for islands
3. **`/home/user/iles/packages/hydration/types.ts`**
   - Framework types: 'vue' | 'preact' | 'solid' | 'svelte' | 'vanilla'
   - Component, Props, Slots, and function type definitions
### 5. **Prerender Package**
**Location**: `/home/user/iles/packages/prerender/`
**Key Files**:
1. **`prerender.ts`** - Exports renderers for each framework
   - `renderers.svelte` calls the `renderSvelteComponent` from `./svelte.ts`
   - Creates Promise-based async functions for dynamic imports

2. **`svelte.ts`** - Svelte prerender implementation
   - Uses `createRawSnippet` from Svelte 5 to wrap slot HTML
   - Uses `render()` from `svelte/server` for server-side rendering
   - Returns HTML string of rendered component
   - Builds the props object with slots as Snippets
### 6. **How Svelte Islands are Mounted/Hydrated**
**Flow Overview**:
1. **Component Registration** (wrap.ts, lines 100-128):
   - Vue components with `client:*` directives are detected during parsing
   - Components are automatically wrapped as `<Island />` components
   - File path is determined from `importFrom` prop (`.svelte` extension detected)
2. **Framework Resolution** (Island.vue, lines 53-59):
   ```typescript
   const ext = props.importFrom.split('.').slice(-1)[0]
   const framework = props.using
     || (ext === 'svelte' && 'svelte')
     || ((ext === 'js' || ext === 'ts') && 'vanilla')
     || ((ext === 'jsx' || ext === 'tsx') && appConfig.jsx)
     || 'vue'
   ```
3. **Prerendering** (Island.vue, lines 107-133):
   - During SSR, `useRenderer(framework)` gets the Svelte renderer from context
   - The prerender function (from `@islands/prerender/svelte.ts`) is called
   - HTML output is wrapped in `createStaticVNode()` for Vue
   - Slot content is pre-rendered as HTML strings
4. **Client-Side Hydration** (Island.vue, lines 91-105):
   - Generates a `<script>` tag with hydration code
   - For eager strategies (client:load), directly imports framework and component
   - For lazy strategies, uses dynamic imports: `() => import(...)`
   - Calls `hydrateNow()`, `hydrateWhenIdle()`, `hydrateWhenVisible()`, or `hydrateOnMediaQuery()`
5. **Runtime Mount** (svelte.ts, lines 27-35):
   - `mount()` from Svelte 5 mounts the component to `<ile-root>` element
   - Passes props and slot Snippets as component props
   - Component is mounted in the browser
### 7. **Key Integration Points**
**Build Process** (`/home/user/iles/packages/iles/src/node/build/render.ts`, lines 15-69):
- `renderPages()` loads the SSR app
- Calls `renderToString()` from Vue with `{ islandsByPath, renderers }`
- Passes the `renderers` object (which includes the Svelte renderer) to Vue's SSR context
- `Island.vue` components use these renderers during prerendering
**Island Configuration Props**:
- `:component` - the imported Svelte component (or null for client:only)
- `componentName` - display name (e.g., "NavBarLinks")
- `importName` - export name from file (usually "default" for .svelte)
- `importFrom` - full file path to .svelte file
- `using` - optional explicit framework override
### 8. **Hydration Strategies**
From `/home/user/iles/packages/iles/src/client/app/hydration.ts`:
```typescript
enum Hydrate {
  WhenIdle = 'client:idle',      // requestIdleCallback
  OnLoad = 'client:load',        // eager/immediate
  MediaQuery = 'client:media',   // when media query matches
  SkipPrerender = 'client:only', // client-only, no prerender
  WhenVisible = 'client:visible',// IntersectionObserver
  None = 'client:none',          // prerender only, no hydration
}
```
Each strategy maps to a hydration function in `hydration.ts`.
### 9. **Blog Example Configuration**
**Config** (`/home/user/iles/playground/the-vue-point/iles.config.ts`, line 39):
```typescript
svelte: true  // Enables Svelte support in the framework
```
This enables Svelte component resolution and the Vite Svelte plugin integration.
---
This architecture allows îles to:
1. Use Svelte 5's new `mount` API for client-side hydration
2. Prerender Svelte components to static HTML at build time
3. Support multiple UI frameworks (Vue, Svelte, Preact, Solid) in the same site
4. Implement island-based hydration strategies for optimal performance
5. Maintain server-side rendering while allowing interactive islands
