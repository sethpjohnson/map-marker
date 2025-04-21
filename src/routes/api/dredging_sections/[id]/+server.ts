import { json } from '@sveltejs/kit';
import { updateDredgingSection } from '$lib/db';
import type { RequestEvent } from '@sveltejs/kit';

export async function PUT({ params, request }: RequestEvent) {
    try {
        if (!params.id) {
            return new Response('ID is required', { status: 400 });
        }
        const data = await request.json();
        updateDredgingSection({
            feature_id: params.id,
            status: data.status,
            notes: data.notes
        });
        return json({ success: true });
    } catch (error) {
        console.error('Error updating dredging section:', error);
        return new Response('Internal Server Error', { status: 500 });
    }
} 