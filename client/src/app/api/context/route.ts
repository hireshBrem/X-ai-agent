// app/api/context/route.ts
import Browserbase from "@browserbasehq/sdk";
import { chromium } from "playwright-core";

export async function GET(request: Request) {

    const bb = new Browserbase({ apiKey: process.env.BROWSERBASE_API_KEY! });
    const contextId:any = await bb.contexts.create({
    projectId: process.env.BROWSERBASE_PROJECT_ID!,
    }).then((context) => {
        console.log("Context ID:", context.id);
        return context.id;
    }).catch((error) => {
        console.error("Error:", error);
        return null;
    });


    // Initialize a session with the context
    const session = await bb.sessions.create({
        projectId: process.env.BROWSERBASE_PROJECT_ID!,
        browserSettings: {
          context: {
            id: contextId,
            persist: true,
          },
        },
    });

    console.log("Session ID:", session.id)

    const liveViewLinks = await bb.sessions.debug(session.id);
    const liveViewLink = liveViewLinks.debuggerFullscreenUrl;
    console.log(`🔍 Live View Link: ${liveViewLink}`);

    // const browser = await chromium.connectOverCDP(session.connectUrl);

    // const page = await browser.newPage();

    // await page.goto("https://X.com", { waitUntil: "domcontentloaded" });
    
    // Return the fetched replay data as JSON
    return new Response(JSON.stringify({contextId: contextId, liveViewLink: liveViewLink}), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
        },
    });
}