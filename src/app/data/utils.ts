export type NonEmptyList<T> = readonly [T, ...T[]];

export function nonEmptyList<T>(list: readonly T[]): list is NonEmptyList<T> {
    return list.length > 0;
}
