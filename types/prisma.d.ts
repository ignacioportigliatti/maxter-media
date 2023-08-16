import { Agency, Prisma } from "@prisma/client";

export type AgencyWithGroups = Prisma.AgencyGetPayload<{
    include: {
      groups: true;
    };
  }>;