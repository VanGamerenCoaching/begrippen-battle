const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

export function staticAssetPath(path: string) {
  if (!basePath) {
    return path;
  }

  if (path === "/") {
    return `${basePath}/`;
  }

  return `${basePath}${path}`;
}
