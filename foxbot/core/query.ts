export interface Query<T> {
  value(): Promise<T>;
}
