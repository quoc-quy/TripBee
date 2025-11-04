// Dựa trên DestinationResponse từ backend
export interface Destination {
    destinationID: string;
    nameDes: string;
    location: string;
    country: string;
    imageURLs: string[];
    tourCount: number;
}

// Đây là kiểu dữ liệu API /api/destinations trả về
export type DestinationApiResponse = Destination[];
