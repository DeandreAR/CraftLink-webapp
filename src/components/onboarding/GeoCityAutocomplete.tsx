"use client";

import { useEffect, useId, useRef, useState } from "react";
import { authFieldClassName, authLabelClassName } from "@/components/auth/authFormStyles";
import {
  communeToSelection,
  departementToSelection,
  formatCitySelectionLabel,
  formatCommuneLabel,
  formatDepartementLabel,
  searchGeoLocations,
  type CitySelection,
  type GeoSearchResult,
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
  const [query, setQuery] = useState(value ? formatCitySelectionLabel(value) : "");
  const [results, setResults] = useState<GeoSearchResult[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (value) {
      setQuery(formatCitySelectionLabel(value));
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
      void searchGeoLocations(query)
        .then(setResults)
        .finally(() => setLoading(false));
    }, 280);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  const pick = (result: GeoSearchResult) => {
    const selection =
      result.kind === "departement"
        ? departementToSelection(result.departement)
        : communeToSelection(result.commune);
    onChange(selection);
    setQuery(
      result.kind === "departement"
        ? formatDepartementLabel(result.departement)
        : formatCommuneLabel(result.commune),
    );
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
            results.map((result) => {
              const key =
                result.kind === "departement"
                  ? `dept-${result.departement.code}`
                  : `commune-${result.commune.code}`;
              const labelText =
                result.kind === "departement"
                  ? `Département — ${formatDepartementLabel(result.departement)}`
                  : formatCommuneLabel(result.commune);

              return (
                <li key={key} role="option">
                  <button
                    type="button"
                    className="w-full px-4 py-2.5 text-left text-sm hover:bg-neutral-50"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => pick(result)}
                  >
                    {labelText}
                  </button>
                </li>
              );
            })
          )}
        </ul>
      ) : null}
    </div>
  );
}
