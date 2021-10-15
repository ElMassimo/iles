export default function Time ({ datetime, children }) {
  console.log('Time', { datetime, children })
  return <time datetime={datetime}>{ children }</time>
}
