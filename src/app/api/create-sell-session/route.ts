import { NextResponse } from "next/server";
import { SellData } from "../../components/Sell/types/sell.types";

// Persist sessions across hot reloads in development
declare global {
  var sessions: Map<string, SellData> | undefined;
}

const sessions = globalThis.sessions ?? new Map<string, SellData>();
globalThis.sessions = sessions;

function generateSessionId(): string {
  return crypto.randomUUID();
}

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get("content-type") || "";
    
    if (!contentType.includes("multipart/form-data")) {
      const response = NextResponse.json(
        { error: "Content-Type must be multipart/form-data" },
        { status: 400 }
      );
      response.headers.set("Access-Control-Allow-Origin", "*");
      response.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
      response.headers.set("Access-Control-Allow-Headers", "Content-Type");
      return response;
    }

    const formData = await req.formData();
    
    // Parse the JSON metadata
    const sellDataJson = formData.get('sellData') as string;
    if (!sellDataJson) {
      const response = NextResponse.json(
        { error: "sellData field required in FormData" },
        { status: 400 }
      );
      response.headers.set("Access-Control-Allow-Origin", "*");
      response.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
      response.headers.set("Access-Control-Allow-Headers", "Content-Type");
      return response;
    }

    const sellData = JSON.parse(sellDataJson);
    
    // Convert File to data URL using Node.js Buffer
    const fileToDataURL = async (file: File): Promise<string> => {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const base64 = buffer.toString('base64');
      return `data:${file.type};base64,${base64}`;
    };

    // Process front children
    if (sellData.front?.children) {
      for (let i = 0; i < sellData.front.children.length; i++) {
        const child = sellData.front.children[i];
        const file = formData.get(`frontChild_${child.imageIndex}`) as File;
        if (file) {
          child.canvasImage = await fileToDataURL(file);
        }
      }
    }

    // Process back children
    if (sellData.back?.children) {
      for (let i = 0; i < sellData.back.children.length; i++) {
        const child = sellData.back.children[i];
        const file = formData.get(`backChild_${child.imageIndex}`) as File;
        if (file) {
          child.canvasImage = await fileToDataURL(file);
        }
      }
    }
    
    if (!sellData.front?.compositeImage || !sellData.fulfiller) {
      const response = NextResponse.json(
        { error: "Missing required fields: front.compositeImage, fulfiller" },
        { status: 400 }
      );
      response.headers.set("Access-Control-Allow-Origin", "*");
      response.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
      response.headers.set("Access-Control-Allow-Headers", "Content-Type");
      return response;
    }

    const sessionId = generateSessionId();
    
    console.log("Creating session with ID:", sessionId);
    sessions.set(sessionId, sellData);
    console.log("Session created successfully");

    const response = NextResponse.json({ sessionId });
    
    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type");
    
    return response;
  } catch (err: any) {
    console.error("Error creating sell session:", err.message);
    const response = NextResponse.json({ error: err.message }, { status: 500 });
    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type");
    return response;
  }
}

export async function OPTIONS(req: Request) {
  const response = new NextResponse(null, { status: 200 });
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type");
  return response;
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const sessionId = url.searchParams.get("sessionId");
  
  console.log("GET request - sessionId:", sessionId);
  console.log("Available sessions:", Array.from(sessions.keys()));
  
  if (!sessionId) {
    const response = NextResponse.json(
      { error: "sessionId parameter required" },
      { status: 400 }
    );
    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set("Access-Control-Allow-Methods", "GET, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type");
    return response;
  }
  
  const sessionData = sessions.get(sessionId);
  
  if (!sessionData) {
    console.log("Session not found for ID:", sessionId);
    const response = NextResponse.json(
      { error: "Session not found" },
      { status: 404 }
    );
    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set("Access-Control-Allow-Methods", "GET, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type");
    return response;
  }
  
  const response = NextResponse.json(sessionData);
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Allow-Methods", "GET, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type");
  
  return response;
}