import React from "react";

/**
 * Defensive rendering utility to ensure that unexpected objects
 * returned from the API do not crash the React rendering cycle.
 * 
 * @param value The value to render safely
 * @param fallback The fallback string to render if the value is null or undefined (default: "-")
 * @returns A safe ReactNode
 */
export function renderSafe(value: any, fallback: string = "-"): React.ReactNode {
  if (value === null || value === undefined) {
    return fallback;
  }

  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return value;
  }

  if (Array.isArray(value)) {
    // If it's an array, map over it safely and join strings if possible, or render them in fragments
    return value.map((v, idx) => 
      React.createElement(React.Fragment, { key: idx }, 
        idx > 0 ? ", " : null, 
        renderSafe(v, fallback)
      )
    );
  }

  if (typeof value === "object") {
    // Check if it is already a valid React element
    if (React.isValidElement(value)) {
      return value;
    }

    // Attempt to find a suitable string property
    const nameKeys = ["name", "title", "label", "displayName", "city", "mode", "category"];
    for (const key of nameKeys) {
      if (typeof value[key] === "string" || typeof value[key] === "number") {
        return value[key];
      }
    }

    return fallback;
  }

  return fallback;
}
