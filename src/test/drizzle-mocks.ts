/** `await db.select().from(...).where?...` resolves to `rows`. */
export function makeSelectFromRows(rows: unknown[]) {
  const p = Promise.resolve(rows)
  const chain: Record<string, unknown> = {}
  const self = chain as PromiseLike<unknown[]> & Record<string, () => typeof self>
  self.from = () => self
  self.where = () => self
  self.orderBy = () => self
  self.limit = () => self
  self.offset = () => self
  self.then = p.then.bind(p)
  self.catch = p.catch.bind(p)
  self.finally = p.finally.bind(p)
  return {
    from: () => self,
  }
}
