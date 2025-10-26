package com.tripbee.backend.model;

import com.tripbee.backend.model.enums.RoleType;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "accounts")
public class Account {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String accountID;

    @Column(nullable = false, unique = true)
    private String userName;

    @Column(nullable = false)
    private String password; // Nhớ mã hóa mật khẩu này!

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RoleType role;

    @Column(nullable = false, updatable = false)
    @CreationTimestamp
    private LocalDateTime createDate;

    @UpdateTimestamp
    private LocalDateTime updateDate;

    private boolean isLocked = false; // Hỗ trợ khóa tài khoản

    public String getAccountID() {
        return accountID;
    }

    public void setAccountID(String accountID) {
        this.accountID = accountID;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public RoleType getRole() {
        return role;
    }

    public void setRole(RoleType role) {
        this.role = role;
    }

    public LocalDateTime getCreateDate() {
        return createDate;
    }

    public void setCreateDate(LocalDateTime createDate) {
        this.createDate = createDate;
    }

    public LocalDateTime getUpdateDate() {
        return updateDate;
    }

    public void setUpdateDate(LocalDateTime updateDate) {
        this.updateDate = updateDate;
    }

    public boolean isLocked() {
        return isLocked;
    }

    public void setLocked(boolean locked) {
        isLocked = locked;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    // --- Mối quan hệ ---

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", referencedColumnName = "userID", nullable = false)
    private User user;
}



// package com.tripbee.backend.model;
//
//import jakarta.persistence.Column;
//import jakarta.persistence.Entity;
//import jakarta.persistence.Id;
//import jakarta.persistence.Table;
//import lombok.Data;
//
//@Data // Annotation của Lombok để tự động tạo getters, setters, toString, v.v.
//@Entity
//@Table(name = "\"Account\"") // Phải có dấu ngoặc kép vì tên bảng của bạn viết hoa
//public class Account {
//
//    @Id
//    @Column(name = "\"accountID\"") // Tương tự, tên cột cũng cần dấu ngoặc kép
//    private String accountID;
//
//    @Column(name = "\"userID\"")
//    private String userID;
//
//    @Column(name = "\"userName\"")
//    private String userName;
//
//    @Column(name = "\"password\"")
//    private String password;
//
//    @Column(name = "\"role\"")
//    private String role;
//
//    public String getAccountID() {
//        return accountID;
//    }
//
//    public void setAccountID(String accountID) {
//        this.accountID = accountID;
//    }
//
//    public String getUserID() {
//        return userID;
//    }
//
//    public void setUserID(String userID) {
//        this.userID = userID;
//    }
//
//    public String getPassword() {
//        return password;
//    }
//
//    public void setPassword(String password) {
//        this.password = password;
//    }
//
//    public String getUserName() {
//        return userName;
//    }
//
//    public void setUserName(String userName) {
//        this.userName = userName;
//    }
//
//    public String getRole() {
//        return role;
//    }
//
//    public void setRole(String role) {
//        this.role = role;
//    }
//}