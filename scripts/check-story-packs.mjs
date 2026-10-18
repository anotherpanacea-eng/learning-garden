#!/usr/bin/env node
import {parisPacks} from '../dist/packs/index.mjs';
import {parisStories,parisLibraryNodes,parisLibraryHelpers} from '../dist/paris-library.mjs';

// Importing paris-library compiles every registered pack against the existing catalog.
const packed=parisStories.filter(story=>story.packId);
const tasks=Object.values(parisLibraryNodes).filter(node=>node.packId);
if(tasks.some(node=>!parisLibraryHelpers[node.id]))throw new Error('A packed task has no helper');
console.log(`${parisPacks.length} reviewed story pack(s), ${packed.length} story/stories, ${tasks.length} reading tasks validated.`);
