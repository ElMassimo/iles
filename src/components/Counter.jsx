import { defineComponent, ref } from 'vue'

export default defineComponent({
  setup () {
    return {
      count: ref(5),
    }
  },
  render (options) {
    const { count } = options
    return <button onClick={() => options.count++}>Count is {count}</button>
  },
})
