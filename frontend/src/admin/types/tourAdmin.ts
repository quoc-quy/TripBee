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
