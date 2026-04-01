// Compatibility shim for vue/vapor until Vue 3.6+ is available.
// Maps createVaporApp to createApp so that the vue-vapor adapter works
// with Vue 3.5.x. When Vue 3.6+ is installed (which exports vue/vapor
// natively), this shim can be removed along with its alias.
export { createApp as createVaporApp } from 'vue'
