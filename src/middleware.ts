import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import getOrCreateBucketStorage from './models/server/storageSetup'
import getOrCreateDatabase from './models/server/dbSetup'


export async function middleware(request: NextRequest) {

  await Promise.all([
    getOrCreateBucketStorage(),
    getOrCreateDatabase()
  ])

  return NextResponse.next();
}

export const config = {
  /* please match all the paths except these path
     -api
     -_next/static
     -_next/image   (basically these whne serving the images)
     - favicon.com

     see xclamation mark
  */
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
// /about/anything , the middleware function will be run and the user will be redirected to home page