// Cloudflare Worker for YTDL4U
// This worker handles API requests and proxies to a YouTube download service

export default {
    async fetch(request, env, ctx) {
        const url = new URL(request.url);

        // CORS headers
        const corsHeaders = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        };

        // Handle CORS preflight
        if (request.method === 'OPTIONS') {
            return new Response(null, { headers: corsHeaders });
        }

        // Serve static files
        if (request.method === 'GET' && url.pathname !== '/api/download') {
            return handleStaticFile(url.pathname, env);
        }

        // Handle download API
        if (url.pathname === '/api/download' && request.method === 'POST') {
            try {
                const body = await request.json();
                const { url: videoUrl, format, quality } = body;

                // Validate input
                if (!videoUrl || !format) {
                    return new Response(JSON.stringify({ error: 'Missing required parameters' }), {
                        status: 400,
                        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                    });
                }

                // Extract video ID
                const videoId = extractVideoId(videoUrl);
                if (!videoId) {
                    return new Response(JSON.stringify({ error: 'Invalid YouTube URL' }), {
                        status: 400,
                        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                    });
                }

                // Use a third-party API service for downloading
                // Option 1: Use a public API like cobalt.tools, y2mate API, etc.
                // Option 2: Use YouTube's innertube API (requires more setup)

                // For this example, we'll use a mock response
                // In production, you would integrate with a real service
                const downloadData = await getDownloadUrl(videoId, format, quality);

                return new Response(JSON.stringify(downloadData), {
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                });

            } catch (error) {
                return new Response(JSON.stringify({ error: error.message }), {
                    status: 500,
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                });
            }
        }

        return new Response('Not Found', { status: 404 });
    }
};

// Extract video ID from YouTube URL
function extractVideoId(url) {
    const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/,
        /youtube\.com\/embed\/([\w-]+)/
    ];

    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match) return match[1];
    }
    return null;
}

// Get download URL from a service
async function getDownloadUrl(videoId, format, quality) {
    // IMPORTANT: This is a placeholder implementation
    // You need to integrate with a real YouTube download service

    // Option 1: Use cobalt.tools API (recommended)
    // const response = await fetch('https://api.cobalt.tools/api/json', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     url: `https://www.youtube.com/watch?v=${videoId}`,
    //     vQuality: quality,
    //     aFormat: format === 'mp3' ? 'mp3' : 'best',
    //     filenamePattern: 'basic'
    //   })
    // });

    // Option 2: Use yt-dlp hosted service
    // You would need to deploy yt-dlp on a server and call it here

    // Option 3: Use YouTube's innertube API (more complex)
    // This requires parsing YouTube's internal API

    // For demonstration, return a mock response
    return {
        title: `Video ${videoId}`,
        videoId: videoId,
        format: format,
        quality: quality,
        downloadUrl: `https://example.com/download/${videoId}.${format}`,
        filename: `video_${videoId}.${format}`,
        thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
    };
}

// Serve static files from KV or hardcoded
async function handleStaticFile(pathname, env) {
    // Map paths to files
    const fileMap = {
        '/': 'index.html',
        '/index.html': 'index.html',
        '/styles.css': 'styles.css',
        '/app.js': 'app.js'
    };

    const filename = fileMap[pathname];
    if (!filename) {
        return new Response('Not Found', { status: 404 });
    }

    // In production, you would store these in KV or R2
    // For now, return a redirect to serve from origin
    return new Response('File not found - please upload static files to KV', { status: 404 });
}
