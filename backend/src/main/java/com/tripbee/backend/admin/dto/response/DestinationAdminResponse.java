package com.tripbee.backend.admin.dto.response;

import com.tripbee.backend.model.Destination;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Setter
@Getter
@Data
@NoArgsConstructor
public class DestinationAdminResponse {
    private String destinationID;
    private String nameDes;
    private String region;

    public DestinationAdminResponse(Destination destination) {
        this.destinationID = destination.getDestinationID();
        this.nameDes = destination.getNameDes();
        this.region = destination.getRegion();
    }


}
