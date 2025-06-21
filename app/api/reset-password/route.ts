import { NextResponse } from 'next/server';
import prisma from '@/app/libs/prismadb';
import bcrypt from 'bcrypt';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { token, password } = body;

    if (!token || !password) {
      return new NextResponse('Missing token or password', { status: 400 });
    }

    const tokenEntry = await prisma.passwordResetToken.findUnique({
      where: { token },
    });

    if (!tokenEntry) {
      return new NextResponse(JSON.stringify({ message: 'Invalid or expired token' }), { status: 400 });
    }

    if (new Date() > tokenEntry.expires) {
      await prisma.passwordResetToken.delete({ where: { token } });
      return new NextResponse(JSON.stringify({ message: 'Token has expired' }), { status: 400 });
    }


    const hashedPassword = await bcrypt.hash(password, 12);

 
    await prisma.user.update({
      where: { email: tokenEntry.email },
      data: { hashedPassword },
    });

    await prisma.passwordResetToken.delete({ where: { token } });

    return NextResponse.json({ success: true, message: 'Password reset successfully' });
  } catch (error) {
    console.error('Reset password error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
