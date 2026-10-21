import {wordGardenNotes} from './word-garden-ui.mjs';
import {gardenNotes} from './garden-ui.mjs';
import {scienceNotes} from './science-ui.mjs';
import {livingNotes} from './living-ui.mjs';
import {adaptiveNotes} from './living-adaptive-ui.mjs';
import {connectionNotes} from './learning-connections-ui.mjs';
import {workshopNotes} from './workshop-ui.mjs';
import {postOfficeNotes} from './post-office-ui.mjs';
import {factsNotes} from './facts-ui.mjs';
import {cafeNotes} from './cafe-ui.mjs';
import {forageNotes} from './forage-ui.mjs';
import {broadNotes} from './broad-ui.mjs';

// Also used on a detached import before it can become the active explorer.
export function destinationNotes(state,graph=null){return wordGardenNotes(state)+gardenNotes(state)+scienceNotes(state)+livingNotes(state)+adaptiveNotes(state)+connectionNotes(state)+workshopNotes(state)+postOfficeNotes(state)+factsNotes(state)+cafeNotes(state)+forageNotes(state)+broadNotes(state,graph);}
