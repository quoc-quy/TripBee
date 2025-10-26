-- CREATE DATABASE "TripBeeDB" WITH TEMPLATE = template0 ENCODING = 'UTF8' LC_COLLATE = 'C' LC_CTYPE = 'C';


-- XÓA DỮ LIỆU CŨ ĐÃ ĐƯỢC COMMENT OUT VÌ DÙNG ddl-auto=create
DELETE FROM payments;
DELETE FROM invoices;
DELETE FROM participants;
DELETE FROM bookings;
DELETE FROM reviews;
DELETE FROM favorites;
DELETE FROM contact_messages;
DELETE FROM tour_promotions;
DELETE FROM tour_destinations;
DELETE FROM itineraries;
DELETE FROM tour_images;
DELETE FROM images;
DELETE FROM accounts;
DELETE FROM users;
DELETE FROM tours;
DELETE FROM promotions;
DELETE FROM destinations;
DELETE FROM tour_types;

-- =================================================================
-- 1. BẢNG ĐỘC LẬP (Independent Tables)
-- =================================================================

-- Dữ liệu mẫu cho TourTypes (5)
-- SỬA 1: Đổi tên cột "desc" thành "description"
INSERT INTO tour_types (tour_typeid, name_type, "description", created_at, update_date) VALUES
('a1b2c3d4-0001-4001-a001-f123456789a1', 'Tour Biển', 'Các tour du lịch đến bãi biển và đảo.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('a1b2c3d4-0002-4002-a002-f123456789a2', 'Tour Núi', 'Khám phá và leo núi, trekking.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('a1b2c3d4-0003-4003-a003-f123456789a3', 'Tour Văn Hóa', 'Tham quan di tích lịch sử, làng nghề.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('a1b2c3d4-0004-4004-a004-f123456789a4', 'Tour Ẩm Thực', 'Trải nghiệm đặc sản địa phương.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('a1b2c3d4-0005-4005-a005-f123456789a5', 'Tour Mạo Hiểm', 'Các hoạt động như nhảy dù, lặn biển.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Dữ liệu mẫu cho Destinations (5)
INSERT INTO destinations (destinationid, name_des, location, country) VALUES
('d1e2f3a4-0001-4001-b001-f123456789b1', 'Vịnh Hạ Long', 'Quảng Ninh', 'Việt Nam'),
('d1e2f3a4-0002-4002-b002-f123456789b2', 'Sapa', 'Lào Cai', 'Việt Nam'),
('d1e2f3a4-0003-4003-b003-f123456789b3', 'Phố cổ Hội An', 'Quảng Nam', 'Việt Nam'),
('d1e2f3a4-0004-4004-b004-f123456789b4', 'Đảo Phú Quốc', 'Kiên Giang', 'Việt Nam'),
('d1e2f3a4-0005-4005-b005-f123456789b5', 'Đà Lạt', 'Lâm Đồng', 'Việt Nam');

-- Dữ liệu mẫu cho Promotions (3)
-- SỬA 2: Đổi tên cột "desc" thành "description"
INSERT INTO promotions (promotionid, title, "description", discount_percentage, discount_amount, limit_usage, current_usage, start_date, end_date, status, created_at, update_date) VALUES
('p1r2o3m4-0001-4001-c001-f123456789c1', 'CHAOHE2024', 'Giảm 10% cho tất cả tour hè', 10, 0, 100, 0, '2024-06-01', '2024-08-31', 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('p1r2o3m4-0002-4002-c002-f123456789c2', 'LE30THANG4', 'Giảm 500.000 VNĐ dịp lễ', 0, 500000, 50, 0, '2024-04-20', '2024-05-02', 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('p1r2o3m4-0003-4003-c003-f123456789c3', 'TOURVIP', 'Khuyến mãi đã hết hạn', 20, 0, 20, 20, '2023-01-01', '2023-02-01', 'EXPIRED', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- =================================================================
-- 2. BẢNG USER VÀ ACCOUNT (Users & Accounts)
-- =================================================================

-- Dữ liệu mẫu cho Users (Admin, 4 Customers)
INSERT INTO users (userid, name, email, phone_number, address) VALUES
('f1a2b3c4-0001-4001-b001-f123456789a1', 'Admin TripBee', 'admin@tripbee.com', '0123456789', '123 Admin St, HCMC'),
('f1a2b3c4-0002-4002-b002-f123456789a2', 'Nguyễn Văn An', 'nguyenvanan@gmail.com', '0987654321', '456 Le Loi, Hanoi'),
('f1a2b3c4-0003-4003-b003-f123456789a3', 'Trần Thị Bình', 'tranbinh@gmail.com', '0912345678', '789 Nguyen Hue, Danang'),
('f1a2b3c4-0004-4004-b004-f123456789a4', 'Lê Minh Cường', 'lecuong@outlook.com', '0905111222', '321 Hung Vuong, Cantho'),
('f1a2b3c4-0005-4005-b005-f123456789a5', 'Phạm Hồng Duyên', 'phamduyen@yahoo.com', '0978999888', '654 Hai Ba Trung, Hue');

-- Dữ liệu mẫu cho Accounts (Liên kết với Users)
-- Mật khẩu cho tất cả đều là 'password123' (đã mã hóa BCrypt)
-- Mật khẩu: $2a$10$fwhf5vj1pBq5p.Glv6prA.o5w1v.m1.L3f/E.UCqE.KVOj.wY.9/S
INSERT INTO accounts (accountid, user_name, password, role, create_date, update_date, is_locked, user_id) VALUES
('e1a2b3c4-0001-4001-c001-f123456789a1', 'admin', '$2a$10$fwhf5vj1pBq5p.Glv6prA.o5w1v.m1.L3f/E.UCqE.KVOj.wY.9/S', 'ADMIN', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false, 'f1a2b3c4-0001-4001-b001-f123456789a1'),
('e1a2b3c4-0002-4002-c002-f123456789a2', 'nguyenvanan', '$2a$10$fwhf5vj1pBq5p.Glv6prA.o5w1v.m1.L3f/E.UCqE.KVOj.wY.9/S', 'CUSTOMER', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false, 'f1a2b3c4-0002-4002-b002-f123456789a2'),
('e1a2b3c4-0003-4003-c003-f123456789a3', 'tranbinh', '$2a$10$fwhf5vj1pBq5p.Glv6prA.o5w1v.m1.L3f/E.UCqE.KVOj.wY.9/S', 'CUSTOMER', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false, 'f1a2b3c4-0003-4003-b003-f123456789a3'),
('e1a2b3c4-0004-4004-c004-f123456789a4', 'lecuong', '$2a$10$fwhf5vj1pBq5p.Glv6prA.o5w1v.m1.L3f/E.UCqE.KVOj.wY.9/S', 'CUSTOMER', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, true, 'f1a2b3c4-0004-4004-b004-f123456789a4'), -- Tài khoản bị khóa
('e1a2b3c4-0005-4005-c005-f123456789a5', 'phamduyen', '$2a$10$fwhf5vj1pBq5p.Glv6prA.o5w1v.m1.L3f/E.UCqE.KVOj.wY.9/S', 'CUSTOMER', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false, 'f1a2b3c4-0005-4005-b005-f123456789a5');


-- =================================================================
-- 3. BẢNG TOUR VÀ CÁC CHI TIẾT LIÊN QUAN (Tours & Details)
-- =================================================================

-- Dữ liệu mẫu cho Tours (5)
-- SỬA 3: Đổi tên cột "desc" thành "description"
INSERT INTO tours (tourid, title, "description", start_date, end_date, duration_days, duration_nights, departure_place, price_adult, price_child, max_participants, min_participants, imageurl, status, ranking, tour_type_id) VALUES
('t1o2u3r4-0001-4001-d001-f123456789d1', 'Khám phá Vịnh Hạ Long 2N1Đ trên Du thuyền 5*', 'Trải nghiệm ngủ đêm trên vịnh, chèo kayak và thăm hang Sửng Sốt.', '2024-11-15', '2024-11-16', 2, 1, 'Hà Nội', 2500000, 1800000, 20, 5, 'https://example.com/images/halong_cover.jpg', 'ACTIVE', 1, 'a1b2c3d4-0001-4001-a001-f123456789a1'),
('t1o2u3r4-0002-4002-d002-f123456789d2', 'Chinh phục Fansipan - Sapa 3N2Đ', 'Trekking leo nóc nhà Đông Dương và khám phá bản Cát Cát.', '2024-12-05', '2024-12-07', 3, 2, 'Hà Nội', 4200000, 3000000, 15, 10, 'https://example.com/images/sapa_cover.jpg', 'ACTIVE', 2, 'a1b2c3d4-0002-4002-a002-f123456789a2'),
('t1o2u3r4-0003-4003-d003-f123456789d3', 'Hội An - Đà Nẵng: Di sản Miền Trung 4N3Đ', 'Thăm phố cổ Hội An, Bà Nà Hills và tắm biển Mỹ Khê.', '2024-11-20', '2024-11-23', 4, 3, 'TP. Hồ Chí Minh', 5500000, 4000000, 30, 10, 'https://example.com/images/hoian_cover.jpg', 'ACTIVE', 3, 'a1b2c3d4-0003-4003-a003-f123456789a3'),
('t1o2u3r4-0004-4004-d004-f123456789d4', 'Thiên đường nghỉ dưỡng Phú Quốc 3N2Đ', 'Tận hưởng bãi Sao, lặn ngắm san hô và khám phá Grand World.', '2024-11-10', '2024-11-12', 3, 2, 'TP. Hồ Chí Minh', 3800000, 2800000, 25, 5, 'https://example.com/images/phuquoc_cover.jpg', 'SOLD_OUT', 4, 'a1b2c3d4-0001-4001-a001-f123456789a1'),
('t1o2u3r4-0005-4005-d005-f123456789d5', 'Đà Lạt Mộng Mơ: Săn mây và Ẩm thực 3N2Đ', 'Check-in đồi chè Cầu Đất, chợ đêm Đà Lạt và các quán cafe đẹp.', '2024-12-01', '2024-12-03', 3, 2, 'Đà Nẵng', 3100000, 2200000, 20, 8, 'https://example.com/images/dalat_cover.jpg', 'PAUSE', 5, 'a1b2c3d4-0004-4004-a004-f123456789a4');

-- Dữ liệu mẫu cho TourDestinations (Liên kết N-N)
INSERT INTO tour_destinations (tour_destinationid, tour_id, destination_id) VALUES
('td1-0001', 't1o2u3r4-0001-4001-d001-f123456789d1', 'd1e2f3a4-0001-4001-b001-f123456789b1'), -- Tour Hạ Long -> Đích Hạ Long
('td1-0002', 't1o2u3r4-0002-4002-d002-f123456789d2', 'd1e2f3a4-0002-4002-b002-f123456789b2'), -- Tour Sapa -> Đích Sapa
('td1-0003', 't1o2u3r4-0003-4003-d003-f123456789d3', 'd1e2f3a4-0003-4003-b003-f123456789b3'), -- Tour Hội An -> Đích Hội An
('td1-0004', 't1o2u3r4-0004-4004-d004-f123456789d4', 'd1e2f3a4-0004-4004-b004-f123456789b4'), -- Tour Phú Quốc -> Đích Phú Quốc
('td1-0005', 't1o2u3r4-0005-4005-d005-f123456789d5', 'd1e2f3a4-0005-4005-b005-f123456789b5'); -- Tour Đà Lạt -> Đích Đà Lạt

-- Dữ liệu mẫu cho TourPromotions (Liên kết N-N)
INSERT INTO tour_promotions (tour_promotionid, tour_id, promotion_id) VALUES
('tp1-0001', 't1o2u3r4-0001-4001-d001-f123456789d1', 'p1r2o3m4-0001-4001-c001-f123456789c1'), -- Tour Hạ Long áp dụng 'CHAOHE2024'
('tp1-0002', 't1o2u3r4-0002-4002-d002-f123456789d2', 'p1r2o3m4-0001-4001-c001-f123456789c1'), -- Tour Sapa áp dụng 'CHAOHE2024'
('tp1-0003', 't1o2u3r4-0003-4003-d003-f123456789d3', 'p1r2o3m4-0002-4002-c002-f123456789c2'); -- Tour Hội An áp dụng 'LE30THANG4'

-- Dữ liệu mẫu cho Images (Ảnh cho Destinations)
INSERT INTO images (imageid, url, caption, created_at, destination_id) VALUES
('img1-0001', 'https://example.com/images/halong_1.jpg', 'Du thuyền trên vịnh', CURRENT_TIMESTAMP, 'd1e2f3a4-0001-4001-b001-f123456789b1'),
('img1-0002', 'https://example.com/images/halong_2.jpg', 'Hang Sửng Sốt', CURRENT_TIMESTAMP, 'd1e2f3a4-0001-4001-b001-f123456789b1'),
('img1-0003', 'https://example.com/images/sapa_1.jpg', 'Ruộng bậc thang Sapa', CURRENT_TIMESTAMP, 'd1e2f3a4-0002-4002-b002-f123456789b2'),
('img1-0004', 'https://example.com/images/hoian_1.jpg', 'Phố cổ về đêm', CURRENT_TIMESTAMP, 'd1e2f3a4-0003-4003-b003-f123456789b3'),
('img1-0005', 'https://example.com/images/phuquoc_1.jpg', 'Bãi Sao cát trắng', CURRENT_TIMESTAMP, 'd1e2f3a4-0004-4004-b004-f123456789b4');

-- Dữ liệu mẫu cho TourImages (Thư viện ảnh cho Tour)
INSERT INTO tour_images (tour_imageid, url, caption, tour_id) VALUES
('timg1-0001', 'https://example.com/images/halong_gallery_1.jpg', 'Chèo Kayak', 't1o2u3r4-0001-4001-d001-f123456789d1'),
('timg1-0002', 'https://example.com/images/halong_gallery_2.jpg', 'Phòng ngủ du thuyền', 't1o2u3r4-0001-4001-d001-f123456789d1'),
('timg1-0003', 'https://example.com/images/sapa_gallery_1.jpg', 'Đỉnh Fansipan', 't1o2u3r4-0002-4002-d002-f123456789d2'),
('timg1-0004', 'https://example.com/images/sapa_gallery_2.jpg', 'Bản Cát Cát', 't1o2u3r4-0002-4002-d002-f123456789d2');

-- Dữ liệu mẫu cho Itineraries (Lịch trình chi tiết cho Tour)
INSERT INTO itineraries (itineraryid, day_number, title, description, tour_id) VALUES
('iti1-0001', 1, 'Ngày 1: Hà Nội - Hạ Long - Hang Sửng Sốt', 'Sáng xe đón tại Hà Nội. Trưa lên du thuyền. Chiều thăm hang Sửng Sốt, tắm biển Titop.', 't1o2u3r4-0001-4001-d001-f123456789d1'),
('iti1-0002', 2, 'Ngày 2: Chèo Kayak - Về Hà Nội', 'Sáng chèo Kayak khu vực hang Luồn. Trưa ăn trưa trên du thuyền. Chiều xe đưa về Hà Nội.', 't1o2u3r4-0001-4001-d001-f123456789d1'),
('iti1-0003', 1, 'Ngày 1: Hà Nội - Sapa - Bản Cát Cát', 'Sáng đi xe bus lên Sapa. Chiều trekking bản Cát Cát.', 't1o2u3r4-0002-4002-d002-f123456789d2'),
('iti1-0004', 2, 'Ngày 2: Chinh phục Fansipan', 'Sáng đi cáp treo lên đỉnh Fansipan. Chiều tự do khám phá thị trấn Sapa.', 't1o2u3r4-0002-4002-d002-f123456789d2'),
('iti1-0005', 3, 'Ngày 3: Sapa - Hà Nội', 'Sáng tự do mua sắm. Trưa trả phòng, xe đưa về Hà Nội.', 't1o2u3r4-0002-4002-d002-f123456789d2');

-- =================================================================
-- 4. BẢNG TƯƠNG TÁC (User Interactions)
-- =================================================================

-- Dữ liệu mẫu cho Reviews (3)
INSERT INTO reviews (reviewid, rating, comment, created_at, status, user_id, tour_id) VALUES
('r1e2v3-0001', 5, 'Tour rất tuyệt vời, du thuyền 5* xịn, đồ ăn ngon. Hướng dẫn viên nhiệt tình.', '2024-10-01 10:30:00', 'APPROVED', 'f1a2b3c4-0002-4002-b002-f123456789a2', 't1o2u3r4-0001-4001-d001-f123456789d1'),
('r1e2v3-0002', 4, 'Trải nghiệm leo Fansipan rất đáng nhớ. Tuy nhiên đồ ăn ở Sapa hơi khó ăn.', '2024-09-15 14:00:00', 'APPROVED', 'f1a2b3c4-0003-4003-b003-f123456789a3', 't1o2u3r4-0002-4002-d002-f123456789d2'),
('r1e2v3-0003', 3, 'Phòng khách sạn hơi cũ. Mọi thứ khác đều ổn.', '2024-10-05 20:00:00', 'PENDING', 'f1a2b3c4-0005-4005-b005-f123456789a5', 't1o2u3r4-0003-4003-d003-f123456789d3');

-- Dữ liệu mẫu cho Favorites (3)
INSERT INTO favorites (favoriteid, added_at, user_id, tour_id) VALUES
('fav1-0001', CURRENT_TIMESTAMP, 'f1a2b3c4-0002-4002-b002-f123456789a2', 't1o2u3r4-0002-4002-d002-f123456789d2'), -- User An thích tour Sapa
('fav1-0002', CURRENT_TIMESTAMP, 'f1a2b3c4-0002-4002-b002-f123456789a2', 't1o2u3r4-0003-4003-d003-f123456789d3'), -- User An thích tour Hội An
('fav1-0003', CURRENT_TIMESTAMP, 'f1a2b3c4-0003-4003-b003-f123456789a3', 't1o2u3r4-0001-4001-d001-f123456789d1'); -- User Bình thích tour Hạ Long

-- Dữ liệu mẫu cho ContactMessages (2)
INSERT INTO contact_messages (contact_messid, email, phone, message, sent_at, user_id) VALUES
('msg1-0001', 'guest@example.com', '0123456789', 'Tôi muốn hỏi về tour Hạ Long cho đoàn 30 người?', CURRENT_TIMESTAMP, NULL), -- Guest gửi
('msg1-0002', 'nguyenvanan@gmail.com', '0987654321', 'Tôi muốn hủy tour Sapa đã đặt ngày 20/12.', CURRENT_TIMESTAMP, 'f1a2b3c4-0002-4002-b002-f123456789a2'); -- User An gửi

-- =================================================================
-- 5. CHUỖI BOOKING (Booking Flow)
-- =================================================================

-- Dữ liệu mẫu cho Bookings (3)
-- Booking 1: User An, 2 người lớn 1 trẻ em, tour Hạ Long, không KM
INSERT INTO bookings (bookingid, booking_date, num_adults, num_children, total_price, discount_amount, final_amount, status, user_id, tour_id, promotion_id) VALUES
('bkg1-0001', '2024-10-01 08:00:00', 2, 1, 6800000, 0, 6800000, 'COMPLETED', 'f1a2b3c4-0002-4002-b002-f123456789a2', 't1o2u3r4-0001-4001-d001-f123456789d1', NULL);

-- Booking 2: User Bình, 2 người lớn, tour Hội An, có KM 500k
-- Giá gốc: 2 * 5.500.000 = 11.000.000. Giảm 500k -> 10.500.000
INSERT INTO bookings (bookingid, booking_date, num_adults, num_children, total_price, discount_amount, final_amount, status, user_id, tour_id, promotion_id) VALUES
('bkg1-0002', '2024-10-05 11:30:00', 2, 0, 11000000, 500000, 10500000, 'CONFIRMED', 'f1a2b3c4-0003-4003-b003-f123456789a3', 't1o2u3r4-0003-4003-d003-f123456789d3', 'p1r2o3m4-0002-4002-c002-f123456789c2');

-- Booking 3: User Duyên, 1 người lớn, tour Đà Lạt, CANCELED
INSERT INTO bookings (bookingid, booking_date, num_adults, num_children, total_price, discount_amount, final_amount, status, user_id, tour_id, promotion_id) VALUES
('bkg1-0003', '2024-10-10 16:45:00', 1, 0, 3100000, 0, 3100000, 'CANCELED', 'f1a2b3c4-0005-4005-b005-f123456789a5', 't1o2u3r4-0005-4005-d005-f123456789d5', NULL);

-- Dữ liệu mẫu cho Participants (Liên kết với Bookings)
-- 3 người cho Booking 1
INSERT INTO participants (participantid, customer_name, customer_phone, identification, gender, participant_type, booking_id) VALUES
('par1-0001', 'Nguyễn Văn An', '0987654321', '0123456789', 'MALE', 'ADULT', 'bkg1-0001'),
('par1-0002', 'Trần Thu Thủy', '0987654322', '0123456790', 'FEMALE', 'ADULT', 'bkg1-0001'),
('par1-0003', 'Nguyễn Trung Kiên', '', '', 'MALE', 'CHILD', 'bkg1-0001');
-- 2 người cho Booking 2
INSERT INTO participants (participantid, customer_name, customer_phone, identification, gender, participant_type, booking_id) VALUES
('par1-0004', 'Trần Thị Bình', '0912345678', '0234567890', 'FEMALE', 'ADULT', 'bkg1-0002'),
('par1-0005', 'Lý Văn Hùng', '0912345679', '0234567891', 'MALE', 'ADULT', 'bkg1-0002');

-- Dữ liệu mẫu cho Invoices (Liên kết 1-1 với Booking)
INSERT INTO invoices (invoiceid, total_amount, tax_percentage, created_at, booking_id) VALUES
('inv1-0001', 6800000, 8, '2024-10-01 08:01:00', 'bkg1-0001'),
('inv1-0002', 10500000, 8, '2024-10-05 11:31:00', 'bkg1-0002');
-- Booking 3 CANCELED nên không có hóa đơn

-- Dữ liệu mẫu cho Payments (Liên kết với Invoices)
-- Payment cho Invoice 1 (Thanh toán 1 lần, thành công)
INSERT INTO payments (paymentid, amount_paid, payment_date, status, payment_method, transaction_code, invoice_id) VALUES
('pay1-0001', 6800000, '2024-10-01 08:05:00', 'SUCCESS', 'VNPAY', 'VNP123456', 'inv1-0001');
-- Payment cho Invoice 2 (Thanh toán 2 lần, 1 PENDING, 1 SUCCESS)
INSERT INTO payments (paymentid, amount_paid, payment_date, status, payment_method, transaction_code, invoice_id) VALUES
('pay1-0002', 5000000, '2024-10-05 11:35:00', 'SUCCESS', 'CREDIT_CARD', 'CC789012', 'inv1-0002'),
('pay1-0003', 5500000, '2024-10-20 10:00:00', 'PENDING', 'BANK_TRANSFER', 'BANK456789', 'inv1-0002');