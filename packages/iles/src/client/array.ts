export function uniq<T> (arr: Array<T>) {
  return [...new Set(arr.filter(x => x))]
}
