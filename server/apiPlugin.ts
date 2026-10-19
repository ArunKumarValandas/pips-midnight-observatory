import type { Plugin } from 'vite';
// @ts-expect-error JS import in TS config is supported by Vite
import { handleApiRequest } from './apiHandler.js';

export function apiPlugin(): Plugin {
  return {
    name: 'pip-observatory-api-plugin',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        handleApiRequest(req, res, next);
      });
    },
    configurePreviewServer(server) {
      server.middlewares.use((req, res, next) => {
        handleApiRequest(req, res, next);
      });
    }
  };
}
