"use client";

import { useEffect, useId, useRef, useState } from "react";
import { authFieldClassName, authLabelClassName } from "@/components/auth/authFormStyles";
import {
  communeToSelection,
  formatCommuneLabel,
  searchCommunes,
  type CitySelection,
  type GeoCommune,
} from "@/lib/onboarding/geoApi";

type GeoCityAutocompleteProps = {
  label: string;
  placeholder: string;
  value: CitySelection | null;
  onChange: (city: CitySelection | null) => void;
  noResultsLabel: string;
};

export function GeoCityAutocomplete({
  label,
  placeholder,
  value,
  onChange,
  noResultsLabel,
}: GeoCityAutocompleteProps) {
  const listId = useId();
  const [query, setQuery] = useState(value ? formatCommuneLabelFromSelection(value) : "");
  const [results, setResults] = useState<GeoCommune[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (value) {
      setQuery(formatCommuneLabelFromSelection(value));
    }
  }, [value]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }

    debounceRef.current = setTimeout(() => {
      setLoading(true);
      void searchCommunes(query)
        .then(setResults)
        .finally(() => setLoading(false));
    }, 280);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  const pick = (commune: GeoCommune) => {
    const selection = communeToSelection(commune);
    onChange(selection);
    setQuery(formatCommuneLabel(commune));
    setOpen(false);
  };

  return (
    <div className="relative">
      <label htmlFor={listId} className={authLabelClassName}>
        {label}
      </label>
      <input
        id={listId}
        type="search"
        autoComplete="off"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
          if (!e.target.value.trim()) onChange(null);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => window.setTimeout(() => setOpen(false), 150)}
        placeholder={placeholder}
        className={authFieldClassName}
        role="combobox"
        aria-expanded={open}
        aria-controls={`${listId}-listbox`}
      />
      {open && query.trim().length >= 2 ? (
        <ul
          id={`${listId}-listbox`}
          role="listbox"
          className="absolute z-20 mt-1 max-h-52 w-full overflow-auto rounded-2xl border border-neutral-200 bg-white py-1 shadow-lg"
        >
          {loading ? (
            <li className="px-4 py-2 text-sm text-neutral-500">…</li>
          ) : results.length === 0 ? (
            <li className="px-4 py-2 text-sm text-neutral-500">{noResultsLabel}</li>
          ) : (
            results.map((commune) => (
              <li key={commune.code} role="option">
                <button
                  type="button"
                  className="w-full px-4 py-2.5 text-left text-sm hover:bg-neutral-50"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => pick(commune)}
                >
                  {formatCommuneLabel(commune)}
                </button>
              </li>
            ))
          )}
        </ul>
      ) : null}
    </div>
  );
}

function formatCommuneLabelFromSelection(city: CitySelection): string {
  return city.postalCode ? `${city.name} (${city.postalCode})` : city.name;
}
