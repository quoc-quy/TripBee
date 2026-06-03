package com.tripbee.backend.admin.dto.request;

import com.tripbee.backend.model.enums.BookingStatus;
import com.tripbee.backend.model.enums.Gender;
import com.tripbee.backend.model.enums.ParticipantType;

import java.util.List;

public class BookingUpdateRequest {
    private BookingStatus status;
    private List<ParticipantUpdateDto> participants;

    public BookingStatus getStatus() { return status; }
    public void setStatus(BookingStatus status) { this.status = status; }

    public List<ParticipantUpdateDto> getParticipants() { return participants; }
    public void setParticipants(List<ParticipantUpdateDto> participants) { this.participants = participants; }

    public static class ParticipantUpdateDto {
        private String participantID;
        private String customerName;
        private String customerPhone;
        private String identification;
        private Gender gender;
        private ParticipantType participantType;

        // Getters and Setters
        public String getParticipantID() { return participantID; }
        public void setParticipantID(String participantID) { this.participantID = participantID; }

        public String getCustomerName() { return customerName; }
        public void setCustomerName(String customerName) { this.customerName = customerName; }

        public String getCustomerPhone() { return customerPhone; }
        public void setCustomerPhone(String customerPhone) { this.customerPhone = customerPhone; }

        public String getIdentification() { return identification; }
        public void setIdentification(String identification) { this.identification = identification; }

        public Gender getGender() { return gender; }
        public void setGender(Gender gender) { this.gender = gender; }

        public ParticipantType getParticipantType() { return participantType; }
        public void setParticipantType(ParticipantType participantType) { this.participantType = participantType; }
    }
}
