import { NextRequest, NextResponse } from "next/server";
import { apiError } from "@/lib/http";
import { getDestinationWeatherLocation } from "@/lib/destinations";

export const dynamic = "force-dynamic";

type OpenMeteoResponse = {
  current?: {
    temperature_2m?: number;
    weather_code?: number;
  };
  daily?: {
    temperature_2m_max?: number[];
    temperature_2m_min?: number[];
  };
};

function weatherLabel(code: number | undefined) {
  if (code === undefined) return "Weather";
  if ([0].includes(code)) return "Clear";
  if ([1, 2].includes(code)) return "Mostly clear";
  if ([3].includes(code)) return "Cloudy";
  if ([45, 48].includes(code)) return "Fog";
  if ([51, 53, 55, 56, 57].includes(code)) return "Drizzle";
  if ([61, 63, 65, 66, 67].includes(code)) return "Rain";
  if ([71, 73, 75, 77].includes(code)) return "Snow";
  if ([80, 81, 82].includes(code)) return "Showers";
  if ([95, 96, 99].includes(code)) return "Storm";
  return "Weather";
}

export async function GET(request: NextRequest) {
  try {
    const location = request.nextUrl.searchParams.get("location")?.trim();

    if (!location) {
      return apiError("Location is required.", 400);
    }

    const destination = getDestinationWeatherLocation(location);

    if (!destination) {
      return apiError("Weather is unavailable for this location.", 404);
    }

    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${destination.latitude}&longitude=${destination.longitude}&current=temperature_2m,weather_code&daily=temperature_2m_max,temperature_2m_min&forecast_days=1&timezone=Africa/Harare`,
      {
        next: { revalidate: 1800 },
      }
    );

    if (!response.ok) {
      throw new Error("Weather upstream request failed");
    }

    const payload = (await response.json()) as OpenMeteoResponse;
    const temperature = payload.current?.temperature_2m;
    const code = payload.current?.weather_code;
    const high = payload.daily?.temperature_2m_max?.[0];
    const low = payload.daily?.temperature_2m_min?.[0];

    return NextResponse.json({
      location: destination.name,
      temperatureC: typeof temperature === "number" ? Math.round(temperature) : null,
      condition: weatherLabel(code),
      highC: typeof high === "number" ? Math.round(high) : null,
      lowC: typeof low === "number" ? Math.round(low) : null,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Weather route error:", error);
    return apiError("Unable to load weather right now.", 500);
  }
}
