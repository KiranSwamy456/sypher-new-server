// import jwt from 'jsonwebtoken';
// import { NextResponse } from 'next/server';

// export function verifyToken(request) {
//   try {
//     const token = request.cookies.get('token')?.value;
    
//     if (!token) {
//       return null;
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     return decoded;
//   } catch (error) {
//     return null;
//   }
// }

// export function requireAuth(handler) {
//   return async (request, context) => {
//     const user = verifyToken(request);
    
//     if (!user) {
//       return NextResponse.json(
//         { error: 'Unauthorized - Please login' },
//         { status: 401 }
//       );
//     }

//     // Add user to request for use in handler
//     request.user = user;
//     return handler(request, context);
//   };
// }

// export function requireAdmin(handler) {
//   return async (request) => {
//     const user = verifyToken(request);
    
//     if (!user) {
//       return NextResponse.json(
//         { error: 'Unauthorized - Please login' },
//         { status: 401 }
//       );
//     }

//     if (user.roleCode !== 602) {
//       return NextResponse.json(
//         { error: 'Forbidden - Admin access required' },
//         { status: 403 }
//       );
//     }

//     request.user = user;
//     return handler(request);
//   };
// }

import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

export function verifyToken(request) {
  try {
    const token = request.cookies.get('token')?.value;
    
    if (!token) {
      return null;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    return null;
  }
}

export function requireAuth(handler) {
  return async (request, context) => {
    const user = verifyToken(request);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized - Please login' },
        { status: 401 }
      );
    }

    request.user = user;
    return handler(request, context);
  };
}

export function requireAdmin(handler) {
  return async (request, context) => {
    const user = verifyToken(request);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized - Please login' },
        { status: 401 }
      );
    }

    // Allow both Admin and Super Admin
    if (![602, 603].includes(user.roleCode)) {
      return NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 }
      );
    }

    request.user = user;
    return handler(request, context);
  };
}

export function requireSuperAdmin(handler) {
  return async (request, context) => {
    const user = verifyToken(request);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized - Please login' },
        { status: 401 }
      );
    }

    if (user.roleCode !== 603) {
      return NextResponse.json(
        { error: 'Forbidden - Super Admin access required' },
        { status: 403 }
      );
    }

    request.user = user;
    return handler(request, context);
  };
}