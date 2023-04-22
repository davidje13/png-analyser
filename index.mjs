#!/usr/bin/env node

import { readFileSync } from 'fs';
import { readPNG } from './src/png.mjs';

const data = readFileSync(process.argv[2]);
readPNG(data);
