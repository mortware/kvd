const invalidFolderNameRegex = /[<>:"/\\|?*\x00-\x1F]/g;
const emptySpacesRegex = /\s+/g;

export function urlJoin(...parts: string[]): string {
  return parts
    .map((part, index) => {
      if (index === 0) {
        return part.replace(/\/+$/, '');
      }
      return part.replace(/^\/+/, '').replace(/\/+$/, '');
    })
    .filter(part => part.length > 0)
    .join('/');
}

export function sanitise(value: string): string {
  return value
    .replace(invalidFolderNameRegex, '')
    .replace(emptySpacesRegex, ' ')
    .trim();
}

export function toSnakeCase(value: string): string {
  return value
    .replace(/\W+/g, ' ')
    .trim()
    .replace(/\s+/g, '_')
    .toLowerCase();
}

export function slugify(...values: string[]): string {
  const charMap: Record<string, string> = {
    'à': 'a', 'á': 'a', 'â': 'a', 'ã': 'a', 'ä': 'a', 'å': 'a',
    'è': 'e', 'é': 'e', 'ê': 'e', 'ë': 'e',
    'ì': 'i', 'í': 'i', 'î': 'i', 'ï': 'i',
    'ò': 'o', 'ó': 'o', 'ô': 'o', 'õ': 'o', 'ö': 'o',
    'ù': 'u', 'ú': 'u', 'û': 'u', 'ü': 'u',
    'ñ': 'n', 'ç': 'c',
    'ß': 'ss', 'æ': 'ae', 'œ': 'oe',
    '♀': 'female', '♂': 'male' // Add these special characters
  };

  return values
    .join('-')
    .trim()
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^\u0000-\u007E]/g, char => charMap[char] || '')
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export function rgbToHex(value: string): string {
  const match = value.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);

  if (match) {
    const [, r = '255', g = '255', b = '255'] = match;
    const red = parseInt(r, 10);
    const green = parseInt(g, 10);
    const blue = parseInt(b, 10);
    return `#${((1 << 24) | (red << 16) | (green << 8) | blue).toString(16).slice(1)}`;
  }

  return '#FFFFFF';
}

export function jsonToBase64(jsonObj: unknown): string {
  const jsonString = JSON.stringify(jsonObj);
  return Buffer.from(jsonString).toString('base64');
}

export function encodeBase64ToJson(base64String: string): unknown {
  const jsonString = Buffer.from(base64String, 'base64').toString();
  return JSON.parse(jsonString);
}