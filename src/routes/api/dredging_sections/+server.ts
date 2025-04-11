import { json } from '@sveltejs/kit';
import { getDredgingSections, updateDredgingSection } from '$lib/db';
import type { DredgingSection } from '$lib/db';

export async function GET() {
    const sections = getDredgingSections();
    return json(sections);
}

export async function POST({ request }) {
    const data = await request.json() as DredgingSection;
    updateDredgingSection(data);
    return json({ success: true });
} 