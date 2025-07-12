export async function post({ request, env }) {
    try {
        const body = await request.json();
        const token = body.token;
        const ip = request.headers.get('CF-Connecting-IP');

        if (!token) {
            return new Response(JSON.stringify({ success: false, error: 'No token provided' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Turnstile validates the token
        const formData = new FormData();
        formData.append('secret', env.TURNSTILE_SECRET_KEY); // Use environment variable
        formData.append('response', token);
        if (ip) {
            formData.append('remoteip', ip);
        }

        const url = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
        const result = await fetch(url, {
            body: formData,
            method: 'POST',
        });

        const outcome = await result.json();
        
        if (outcome.success) {
            return new Response(JSON.stringify({ success: true }), {
                headers: { 'Content-Type': 'application/json' },
            });
        } else {
            console.error('Turnstile verification failed:', outcome);
            return new Response(JSON.stringify({ 
                success: false, 
                error: 'Verification failed',
                details: outcome 
            }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }
    } catch (error) {
        console.error('API error:', error);
        return new Response(JSON.stringify({ 
            success: false, 
            error: 'Internal server error' 
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
} 