import {
  curatedZimbabweDestinations,
  getDestinationById,
  type ExplorerDestinationSummary,
} from "@/lib/destination-explorer";

const destinationRequiredCategories = new Set([
  "accommodation",
  "experience",
  "dining",
]);

export type ListingDestinationMetadata = {
  destinationId?: string;
  destinationName?: string;
  destinationLocation?: string;
};

export function listingRequiresDestination(category: string | null | undefined) {
  return destinationRequiredCategories.has((category || "").trim().toLowerCase());
}

export function getListingDestinationMetadata(
  metadata: Record<string, unknown> | null | undefined
): ListingDestinationMetadata {
  return {
    destinationId:
      typeof metadata?.destinationId === "string" ? metadata.destinationId : undefined,
    destinationName:
      typeof metadata?.destinationName === "string" ? metadata.destinationName : undefined,
    destinationLocation:
      typeof metadata?.destinationLocation === "string"
        ? metadata.destinationLocation
        : undefined,
  };
}

export function getDestinationOptions(): ExplorerDestinationSummary[] {
  return curatedZimbabweDestinations.map((destination) => ({ ...destination }));
}

export function resolveListingDestination(destinationId: string | null | undefined) {
  return getDestinationById(getDestinationOptions(), destinationId);
}

export function buildDestinationMetadata(
  destination: ExplorerDestinationSummary | null
): ListingDestinationMetadata {
  if (!destination) {
    return {};
  }

  return {
    destinationId: destination.id,
    destinationName: destination.name,
    destinationLocation: destination.location || undefined,
  };
}
