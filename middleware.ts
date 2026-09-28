import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  // Creamos el cliente de Supabase para el middleware
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Verificamos si hay una sesión activa
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Si intentan entrar a cualquier ruta que empiece con /admin...
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // 1. Si NO ha iniciado sesión, lo mandamos al login (o al inicio)
    if (!user) {
      return NextResponse.redirect(new URL('/', request.url));
    }

  const adminEmails = [
      'corzogarciaernesto15@gmail.com', // Tu correo
      'kia.gonzalez014@gmail.com' // Correo de la otra persona
    ]; 

    // Si el correo del usuario que intenta entrar NO está en la lista, lo bloqueamos
    if (!user.email || !adminEmails.includes(user.email)) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return supabaseResponse;
}

// Configuramos las rutas sobre las que actuará el middleware
export const config = {
  matcher: ['/admin/:path*'],
};