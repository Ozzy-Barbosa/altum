import fs from 'node:fs';
import { solutions, services, site, projects } from '../src/data/catalog.ts';
import { specifications } from '../src/data/specifications.ts';
fs.mkdirSync('tmp/pdfs', { recursive: true });
fs.writeFileSync(
  'tmp/pdfs/catalog.json',
  JSON.stringify({ solutions, services, site, projects, specifications }, null, 2),
);
