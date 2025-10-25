package com.tripbee.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Data // Annotation của Lombok để tự động tạo getters, setters, toString, v.v.
@Entity
@Table(name = "\"Account\"") // Phải có dấu ngoặc kép vì tên bảng của bạn viết hoa
public class Account {

    @Id
    @Column(name = "\"accountID\"") // Tương tự, tên cột cũng cần dấu ngoặc kép
    private String accountID;

    @Column(name = "\"userID\"")
    private String userID;

    @Column(name = "\"userName\"")
    private String userName;

    @Column(name = "\"password\"")
    private String password;

    @Column(name = "\"role\"")
    private String role;

    public String getAccountID() {
        return accountID;
    }

    public void setAccountID(String accountID) {
        this.accountID = accountID;
    }

    public String getUserID() {
        return userID;
    }

    public void setUserID(String userID) {
        this.userID = userID;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}