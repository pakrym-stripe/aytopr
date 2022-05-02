export const addEntry = (
  changelog: string,
  version: string,
  content: string
) => {
  const parts = getVersionRegex(version).exec(changelog);

  if (!parts) {
    throw new Error(`Section for ${version} not found.`);
  }

  let processedContent = content.trim();

  return (
    parts[1] +
    parts[2] +
    parts[3] +
    parts[4] +
    parts[5].trimEnd() +
    "\n" +
    processedContent +
    "\n\n" +
    parts[6]
  );
};

export const updateSection = (
  changelog: string,
  version: string,
  content: string
) => {
  const parts = getVersionRegex(version).exec(changelog);

  if (!parts) {
    throw new Error(`Section for ${version} not found.`);
  }

  let processedContent = content.trim();

  parts[5] =  "\n\n" + processedContent + "\n\n";

  return parts.slice(1).join('');
}

export const updateDate = (
  changelog: string,
  version: string,
  date: string
) => {
  const parts = getVersionRegex(version).exec(changelog);

  if (!parts) {
    throw new Error(`Section for ${version} not found.`);
  }

  parts[4] = date;

  return parts.slice(1).join('');
};

export const hasVersion = (changelog: string, version: string): boolean =>
  !!getVersionRegex(version).exec(changelog);

const escapeRegex = (s: string) => s.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");

const getVersionRegex = (version: string) =>
  new RegExp(
    // 1 - prefix
    `(.*?^## )` +
      // 2 - version
      `(${escapeRegex(version)})` +
      // 3 - delimeter
      `( - )` +
      // 4 - date
      `(.*?)` +
      // 5 - section
      `($.*?(?=^## ))` +
      // 6 - rest
      `(.*)`,
    "ms"
  );
