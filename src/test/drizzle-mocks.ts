/** `await db.select().from(...).where?...` resolves to `rows`. */
export function makeSelectFromRows(rows: unknown[]) {
  const self = Promise.resolve(rows) as Promise<unknown[]> &
    Record<string, () => typeof self>
  self.from = () => self
  self.where = () => self
  self.orderBy = () => self
  self.limit = () => self
  self.offset = () => self
  return {
    from: () => self,
  }
}
