import { json } from '@sveltejs/kit';
import { getDredgingSections, updateDredgingSection } from '$lib/db';
import type { DredgingSection } from '$lib/db';
import type { RequestEvent } from '@sveltejs/kit';

export async function GET() {
    try {
        const sections = getDredgingSections();
        return json(sections);
    } catch (error) {
        console.error('Error fetching dredging sections:', error);
        return new Response('Internal Server Error', { status: 500 });
    }
}

export async function POST({ request }: RequestEvent) {
    const data = await request.json() as DredgingSection;
    updateDredgingSection(data);
    return json({ success: true });
} 