import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/telemetry?compartmentId=X&deviceName=Y
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const compartmentIdStr = searchParams.get('compartmentId');
    const deviceName = searchParams.get('deviceName') || 'default';

    if (!compartmentIdStr) {
      return NextResponse.json({ error: 'Le paramètre compartmentId est requis.' }, { status: 400 });
    }

    const compartmentId = parseInt(compartmentIdStr);
    if (isNaN(compartmentId)) {
      return NextResponse.json({ error: 'Le paramètre compartmentId doit être un entier.' }, { status: 400 });
    }

    // Retrieve the last 30 telemetry entries for this compartment
    const entries = await prisma.telemetryEntry.findMany({
      where: {
        compartmentId,
        deviceName,
      },
      orderBy: {
        timestamp: 'desc',
      },
      take: 30,
    });

    // Format and reverse to display in chronological order
    const history = entries.reverse().map((e) => ({
      time: e.timestamp.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      temp: e.temp,
      humidity: e.humidity,
    }));

    return NextResponse.json({ success: true, history });
  } catch (error: any) {
    console.error('Erreur API GET telemetry:', error);
    return NextResponse.json({ error: `Erreur serveur: ${error.message}` }, { status: 500 });
  }
}

// POST /api/telemetry
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { compartmentId, deviceName, temp, humidity } = body;

    if (compartmentId === undefined || temp === undefined || humidity === undefined) {
      return NextResponse.json({ error: 'compartmentId, temp, et humidity sont requis.' }, { status: 400 });
    }

    const entry = await prisma.telemetryEntry.create({
      data: {
        compartmentId: parseInt(compartmentId),
        deviceName: deviceName || 'default',
        temp: parseFloat(temp),
        humidity: parseFloat(humidity),
      },
    });

    return NextResponse.json({ success: true, entry });
  } catch (error: any) {
    console.error('Erreur API POST telemetry:', error);
    return NextResponse.json({ error: `Erreur serveur: ${error.message}` }, { status: 500 });
  }
}
