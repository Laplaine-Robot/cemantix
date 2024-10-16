import { serve } from "https://deno.land/std@0.119.0/http/server.ts";

async function handler(req: Request): Promise<Response> {
    try {
        // On récupère le contenu du body de la requête
        const { word1 } = await req.json();
        const word2 = "supelec"; // Le second mot reste statique

        if (!word1) {
            return new Response("Error: 'word1' is required", { status: 400 });
        }

        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const raw = JSON.stringify({
            "word1": word1,
            "word2": word2
        });

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };

        const response = await fetch("http://word2vec.nicolasfley.fr/similarity", requestOptions);

        if (!response.ok) {
            console.error(`Error: ${response.statusText}`);
            return new Response(`Error: ${response.statusText}`, { status: response.status });
        }

        const result = await response.json();

        console.log(result);
        return new Response(JSON.stringify(result), {
            headers: { "Content-Type": "application/json" },
            status: 200
        });
    } catch (error) {
        console.error("Fetch error:", error);
        return new Response(`Error: ${error.message}`, { status: 500 });
    }
}

serve(handler);
