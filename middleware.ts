/**
 * BEYON26 middleware
 *
 * 1. Refreshes the Supabase auth session on every request so server components
 *    see a current user.
 * 2. Gates /dashboard and /admin behind an authenticated session.
 * 3. Role-checking for /admin is enforced *inside* the admin layout (Supabase
 *    service role + DB lookup) to avoid shipping role logic to the edge.
 */
import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request: { headers: request.headers } });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // If env vars are missing, allow request through (will fail gracefully in page)
  if (!supabaseUrl || !supabaseAnonKey) {
    return response;
  }

  try {
    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options });
          response = NextResponse.next({
            request: { headers: request.headers },
          });
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options });
          response = NextResponse.next({
            request: { headers: request.headers },
          });
          response.cookies.set({ name, value: '', ...options });
        },
      },
    });

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { pathname } = request.nextUrl;
    const isProtected =
      pathname.startsWith('/dashboard') ||
      pathname.startsWith('/admin') ||
      pathname.startsWith('/apply');

    if (isProtected && !user) {
      const url = request.nextUrl.clone();
      url.pathname = '/auth/sign-in';
      url.searchParams.set('next', pathname);
      return NextResponse.redirect(url);
    }

    // If logged in and hitting an auth page, bounce to dashboard
    if (user && pathname.startsWith('/auth/sign-')) {
      const url = request.nextUrl.clone();
      url.pathname = '/dashboard/traveler';
      return NextResponse.redirect(url);
    }
  } catch (err) {
    // Log but don't crash — let the page handle auth errors
    console.error('[middleware] Supabase auth error:', err);
  }

  return response;
}

export const config = {
  matcher: [
    // skip Next internals + static files
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|txt|xml)$).*)',
  ],
};
