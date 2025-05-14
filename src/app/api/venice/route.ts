import { VENICE_BASE_URL } from "@/app/lib/constants";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const response = await fetch(`${VENICE_BASE_URL}/image/generate`, {
      method: "POST",
      headers: {
        authorization: "Bearer " + process.env.VENICE_API_KEY,
        contentType: "application/json",
      },
      body: JSON.stringify(await req.json()),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error from Venice:", errorText);
      throw new Error("Failed to generate image");
    }

    const res = await response.json();

    return NextResponse.json({ images: res.images });
  } catch (err: any) {
    console.error(err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
