import { Page } from 'playwright';

let page: Page | null = null;

export const setPage = (newPage: Page) => {
  page = newPage;
}

export const getPage = (): Page => {
  if (!page) {
    throw new Error("Page not set");
  }
  return page;
}