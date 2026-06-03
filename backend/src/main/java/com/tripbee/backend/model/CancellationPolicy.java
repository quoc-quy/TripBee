package com.tripbee.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "cancellation_policies")
public class CancellationPolicy {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long policyID;

    @Column(nullable = false, unique = true)
    private Integer daysBeforeDeparture;

    @Column(nullable = false)
    private Double feePercentage;

    public CancellationPolicy() {}

    public CancellationPolicy(Integer daysBeforeDeparture, Double feePercentage) {
        this.daysBeforeDeparture = daysBeforeDeparture;
        this.feePercentage = feePercentage;
    }

    public Long getPolicyID() {
        return policyID;
    }

    public void setPolicyID(Long policyID) {
        this.policyID = policyID;
    }

    public Integer getDaysBeforeDeparture() {
        return daysBeforeDeparture;
    }

    public void setDaysBeforeDeparture(Integer daysBeforeDeparture) {
        this.daysBeforeDeparture = daysBeforeDeparture;
    }

    public Double getFeePercentage() {
        return feePercentage;
    }

    public void setFeePercentage(Double feePercentage) {
        this.feePercentage = feePercentage;
    }
}
