import * as fs from 'fs';
import { SongInfo } from './models';
import path from 'path';

const invalidFolderNameRegex = /[<>:"/\\|?*\x00-\x1F]/g;
const emptySpacesRegex = /\s+/g;

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
  const charMap: { [key: string]: string } = {
    'à': 'a', 'á': 'a', 'â': 'a', 'ã': 'a', 'ä': 'a', 'å': 'a',
    'è': 'e', 'é': 'e', 'ê': 'e', 'ë': 'e',
    'ì': 'i', 'í': 'i', 'î': 'i', 'ï': 'i',
    'ò': 'o', 'ó': 'o', 'ô': 'o', 'õ': 'o', 'ö': 'o',
    'ù': 'u', 'ú': 'u', 'û': 'u', 'ü': 'u',
    'ñ': 'n', 'ç': 'c',
    'ß': 'ss', 'æ': 'ae', 'œ': 'oe'
  };

  return values
    .join('-')
    .trim()
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^\u0000-\u007E]/g, char => charMap[char] || char)
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export function rgbToHex(value: string): string {
  const match = value.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);

  if (match && match.length > 4) {
    const r = parseInt(match[1] ?? "255", 10);
    const g = parseInt(match[2] ?? "255", 10);
    const b = parseInt(match[3] ?? "255", 10);

    const hex = ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    return `#${hex}`;
  }

  return '#FFFFFF';
}

export function fileExists(filePath: string): boolean {
  return fs.existsSync(filePath);
};

export function getSongInfoFromFile(filePath: string): SongInfo {
  const infoFilePath = path.join(filePath, "_info.json");
  const infoFile = fs.readFileSync(infoFilePath, 'utf8');
  return JSON.parse(infoFile);
}

export function jsonToBase64(jsonObj: any) {
  const jsonString = JSON.stringify(jsonObj)
  return Buffer.from(jsonString).toString('base64')
}

export function encodeBase64ToJson(base64String: string) {
  const jsonString = Buffer.from(base64String, 'base64').toString()
  return JSON.parse(jsonString)
}