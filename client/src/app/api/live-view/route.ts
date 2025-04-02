// app/api/live-view/route.ts
import Browserbase from "@browserbasehq/sdk";

export async function POST(request: Request) {
    const body = await request.json();

    const bb = new Browserbase({
        apiKey: process.env.BROWSERBASE_API_KEY,
    });

    // Get the session replay for the given session id
    const replay = await bb.sessions.recording.retrieve(body.session_id);
    // console.log("REPLAY:", replay);


    // Return the fetched replay data as JSON
    return new Response(JSON.stringify(replay), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
        },
    });
}
  