/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.jsonc`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

const LEAGUE_ID = '1313649397514391552';

export default {
	async fetch(request: Request): Promise<Response> {
		const url = new URL(request.url);

		// Simple test endpoint
		if (url.pathname === '/') {
			return new Response('SleeperBridge OK', {
				headers: {
					'Content-Type': 'text/plain',
				},
			});
		}

		// Sleeper league data
		if (url.pathname === '/league') {
			try {
				const sleeperResponse = await fetch(
					`https://api.sleeper.app/v1/league/${LEAGUE_ID}`
				);

				if (!sleeperResponse.ok) {
					return new Response(
						`Sleeper API error: ${sleeperResponse.status}`,
						{ status: 502 }
					);
				}

				const league = await sleeperResponse.json();

				return Response.json(league);
			} catch (error) {
				return new Response(
					`Error contacting Sleeper: ${
						error instanceof Error ? error.message : 'Unknown error'
					}`,
					{ status: 500 }
				);
			}
		}

		return new Response('Not Found', { status: 404 });
	},
};