// If you have created a git repo
import { serve } from "https://deno.land/std@0.119.0/http/server.ts";

async function handler(_req: Request): Promise<Response> {
    if (_req.method ==
        "OPTIONS") {

        return
        new Response("Preflight OK!", {
            status: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "content-type"
            }
        });

    }
    const u=new URL(_req.url);
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
        "word1":u.searchParams.get('param1'), //value1,
        "word2": "supelec"
    });

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
    };

    try {
        const response = await fetch("http://word2vec.nicolasfley.fr/similarity", requestOptions);
        
        if (!response.ok) {
            console.error(`Error: ${response.statusText}`);
            return new Response(`Error: ${response.statusText}`, { 
            status: 200,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "content-type"
	            } 
            });
        }

        const result = await response.json();

        console.log(result);
        return new Response(JSON.stringify(result), {
            headers: { "Content-Type": "application/json" },
            status: 200
        }, {
            status: 200,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "content-type"
            }

        });
        
    } catch (error) {
        console.error("Fetch error:", error);
        return new Response(`Error: ${error.message}`, { status: 500 });
    }
}

serve(handler);