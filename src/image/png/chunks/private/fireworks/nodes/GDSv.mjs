import { MapNode } from './base/CoreNode.mjs';
import { GDKi } from './colours.mjs';
import { GDHv } from './GDHv.mjs';
import { GDVv } from './GDVv.mjs';

/** Guides */
export class GDSv extends MapNode {
	locked = this.optional('GDLb') ?? false;
	colour = this.optional('GDKi', GDKi);
	horizontal = this.optional('GDHv', GDHv) ?? [];
	vertical = this.optional('GDVv', GDVv) ?? [];
}
