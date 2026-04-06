"use client";

import { CloudSun, Loader2, Sun, CloudRain, Cloud } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

type WeatherPayload = {
  location: string;
  temperatureC: number | null;
  condition: string;
  highC: number | null;
  lowC: number | null;
  updatedAt: string;
};

function WeatherIcon({ condition }: { condition: string }) {
  const normalized = condition.toLowerCase();

  if (normalized.includes("rain") || normalized.includes("showers")) {
    return <CloudRain className="h-4 w-4" />;
  }

  if (normalized.includes("cloud")) {
    return <Cloud className="h-4 w-4" />;
  }

  if (normalized.includes("clear")) {
    return <Sun className="h-4 w-4" />;
  }

  return <CloudSun className="h-4 w-4" />;
}

interface WeatherBadgeProps {
  location: string;
  className?: string;
  showCondition?: boolean;
  compact?: boolean;
}

export default function WeatherBadge({
  location,
  className = "",
  showCondition = true,
  compact = false,
}: WeatherBadgeProps) {
  const { data, isLoading } = useQuery({
    queryKey: ["weather", location],
    queryFn: async () => {
      const response = await fetch(`/api/weather?location=${encodeURIComponent(location)}`);
      if (!response.ok) {
        throw new Error("Weather unavailable");
      }
      return (await response.json()) as WeatherPayload;
    },
    staleTime: 30 * 60 * 1000,
    retry: 1,
  });

  if (isLoading) {
    return (
      <div className={`inline-flex items-center gap-2 ${className}`}>
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>{compact ? "--°" : "Loading weather"}</span>
      </div>
    );
  }

  if (!data || data.temperatureC === null) {
    return null;
  }

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <WeatherIcon condition={data.condition} />
      <span className="font-semibold">{data.temperatureC}°C</span>
      {showCondition ? <span className="opacity-80">{data.condition}</span> : null}
    </div>
  );
}
