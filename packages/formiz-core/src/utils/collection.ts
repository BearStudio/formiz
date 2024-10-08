import ShortUniqueId from "short-unique-id";

const uid = new ShortUniqueId({ length: 19 });

export const insertItemsAtIndex = ({
  source = [],
  target = [],
  index,
  hasToOverrideOldValues = false,
}: {
  source?: Array<unknown>;
  target?: Array<string>;
  index: number;
  hasToOverrideOldValues?: boolean;
}) => {
  const computedIndex = index < 0 ? target.length + 1 + index : index;
  const keysToInsert = Array.from({ length: source.length }, () => uid.rnd());
  const newKeys = [
    ...target.slice(0, computedIndex),
    ...keysToInsert,
    ...target.slice(computedIndex),
  ];

  const newValues = [
    ...target
      .slice(0, computedIndex)
      .map((value) => (hasToOverrideOldValues ? value : undefined)),
    ...source,
    ...target
      .slice(computedIndex)
      .map((value) => (hasToOverrideOldValues ? value : undefined)),
  ];

  return { newKeys, newValues };
};

export const removeItemsAtIndexes = ({
  source,
  indexes,
}: {
  source: Array<string>;
  indexes: Array<number>;
}) => {
  const computedIndexes = indexes.map((index) =>
    index < 0 ? source.length + index : index
  );
  return source.filter((_, index) => !computedIndexes.includes(index));
};
