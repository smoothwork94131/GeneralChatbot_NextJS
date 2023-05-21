import type { NextFetchEvent, NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { createMiddlewareSupabaseClient } from '@supabase/auth-helpers-nextjs'
import {
  createBrowserSupabaseClient,
  User
} from '@supabase/auth-helpers-nextjs';
import type { Database } from '@/types/types_db';
export const supabase = createBrowserSupabaseClient<Database>();

export async function middleware(req: NextRequest, ev: NextFetchEvent) {
  const res = NextResponse.next()

  // const supabase = createMiddlewareSupabaseClient({ req, res })
  // const session = await supabase.auth.getSession();
  // const url = req.nextUrl.clone()
  
  // if(session) {
  //   url.pathname = '/';
  // } else {
  //   url.pathname = '/';
  // }

  // return NextResponse.redirect(url);

}



// export const config = {
//   matcher: ['/:path*'],
// }