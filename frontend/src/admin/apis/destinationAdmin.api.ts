import http from "../../utils/http";  
import type { DestinationAdminParams } from "../types/destinationAdmin";

export type DestinationAdmin = {
  destinationID: string;
  nameDes: string;
  region: string;
};

export const destinationAdminApi = {
  getDestinations(region?: string) {
    return http.get<DestinationAdminParams[]>("/admin/destinations", {
      params: region ? { region } : {},
    });
  },
};
