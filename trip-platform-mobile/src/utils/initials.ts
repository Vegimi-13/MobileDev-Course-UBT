export const getInitials = (
  first?: string | null,
  last?: string | null,
  fallback?: string | null,
) => {
  const firstInitial = first?.trim().charAt(0);
  const lastInitial = last?.trim().charAt(0);

  if (firstInitial && lastInitial) {
    return `${firstInitial}${lastInitial}`.toUpperCase();
  }

  return (firstInitial ?? fallback?.trim().charAt(0) ?? "?").toUpperCase();
};

export const getInitialsFromName = (name?: string | null, fallback?: string | null) => {
  const parts = name?.trim().split(/\s+/).filter(Boolean) ?? [];
  return getInitials(parts[0], parts.length > 1 ? parts[parts.length - 1] : undefined, fallback);
};
