import type { tourDestinationAdmin } from "./tourDestinationAdmin";
import type { TourTypeAdminParams } from "./tourTypeAdmin";

export interface TourAdmin {
  tourID: string;
  title: string;
  imageURL: string;
  durationDays: number;
  durationNights: number;
  priceAdult: number;
  tourTypeName: string;
  destinationName: string;
  status: string;
}

export interface TourListAdmin {
  content: TourAdmin[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  totalPages: number;
  totalElements: number;
  last: boolean;
  size: number;
  number: number;
  numberOfElements: number;
  first: boolean;
  empty: boolean;
}

export type TourAdminApiResponse = TourListAdmin;

export interface TourListAdminParams {
  page?: number | string;
  size?: number | string;
  search?: string;
  status?: string;
  tour_type_id?: string;
}

export interface TourDetailAdmin {
  tourID: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  durationDays: number;
  durationNights: number;
  priceAdult: number;
  priceChild: number;
  maxParticipants: number;
  minParticipants: number;
  imageURL: string;
  status: string;
  ranking?: number | null;
  tourType?: {
    id: string;
    name: string;
  } | null;
  tourDestinations?: {
    tourDestinationID: string;
    destination: {
      id: string;
      nameDes: string;
      region: string;
    } | null;
  }[];
}