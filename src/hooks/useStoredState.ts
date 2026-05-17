import { useCallback, useEffect, useState } from "react";

interface StoredStateOptions<T> {
  parse?: (rawValue: string | null) => T;
  serialize?: (value: T) => string;
}

export function useStoredState<T>(
  key: string,
  defaultValue: T,
  options: StoredStateOptions<T> = {}
) {
  const { parse = defaultParser(defaultValue), serialize = String } = options;

  const [value, setValue] = useState<T>(() => {
    try {
      return parse(localStorage.getItem(key));
    } catch {
      return defaultValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, serialize(value));
    } catch {
      // Storage can be unavailable in private browsing or restricted embeds.
    }
  }, [key, serialize, value]);

  const updateValue = useCallback((nextValue: T | ((previousValue: T) => T)) => {
    setValue((previousValue) =>
      typeof nextValue === "function"
        ? (nextValue as (previousValue: T) => T)(previousValue)
        : nextValue
    );
  }, []);

  return [value, updateValue] as const;
}

function defaultParser<T>(defaultValue: T) {
  return (rawValue: string | null): T => {
    if (rawValue == null) return defaultValue;
    return rawValue as T;
  };
}
