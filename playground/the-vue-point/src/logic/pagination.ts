import type { StaticPath } from 'iles'

export function paginate<T> (items: T[], args: { pageSize?: number; pageParam?: string } = {}): StaticPath[] {
  const { pageSize = 10, pageParam = 'page' } = args
  const pagesCount = Math.max(1, Math.ceil(items.length / pageSize))
  return Array.from({ length: pagesCount }, (_, i) => i + 1)
    .map((pageNumber) => {
      const firstItem = (pageNumber - 1) * pageSize
      return {
        params: { [pageParam]: String(pageNumber) },
        props: {
          items: items.slice(firstItem, firstItem + pageSize),
          nextPage: pageNumber !== pagesCount ? pageNumber + 1 : undefined,
          prevPage: pageNumber === 1 ? undefined : pageNumber - 1,
        },
      }
    })
}
