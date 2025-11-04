-- -- CREATE DATABASE "TripBeeDB" WITH TEMPLATE = template0 ENCODING = 'UTF8' LC_COLLATE = 'C' LC_CTYPE = 'C';

-- XÓA DỮ LIỆU CŨ TRƯỚC KHI THÊM DỮ LIỆU MỚI
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
-- 1. BẢNG ĐỘC LẬP (TourTypes, Destinations, Promotions)
-- =================================================================

-- TourTypes (5 loại)
INSERT INTO tour_types (tour_typeid, name_type, "description", created_at, update_date) VALUES
('tour-type-01', 'Tour Biển', 'Các tour du lịch đến bãi biển và đảo.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('tour-type-02', 'Tour Núi', 'Khám phá và leo núi, trekking.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('tour-type-03', 'Tour Văn Hóa', 'Tham quan di tích lịch sử, làng nghề.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('tour-type-04', 'Tour Ẩm Thực', 'Trải nghiệm đặc sản địa phương.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('tour-type-05', 'Tour Mạo Hiểm', 'Các hoạt động như nhảy dù, lặn biển.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Destinations (30 điểm đến)
-- Miền Bắc (10)
INSERT INTO destinations (destinationid, name_des, location, country) VALUES
('dest-mb-01', 'Hà Nội', 'Hà Nội', 'Việt Nam'),
('dest-mb-02', 'Vịnh Hạ Long', 'Quảng Ninh', 'Việt Nam'),
('dest-mb-03', 'Sa Pa', 'Lào Cai', 'Việt Nam'),
('dest-mb-04', 'Ninh Bình', 'Ninh Bình', 'Việt Nam'),
('dest-mb-05', 'Mộc Châu', 'Sơn La', 'Việt Nam'),
('dest-mb-06', 'Hà Giang', 'Hà Giang', 'Việt Nam'),
('dest-mb-07', 'Cát Bà', 'Hải Phòng', 'Việt Nam'),
('dest-mb-08', 'Mai Châu', 'Hòa Bình', 'Việt Nam'),
('dest-mb-09', 'Yên Tử', 'Quảng Ninh', 'Việt Nam'),
('dest-mb-10', 'Ba Vì', 'Hà Nội', 'Việt Nam');
-- Miền Trung (10)
INSERT INTO destinations (destinationid, name_des, location, country) VALUES
('dest-mt-01', 'Huế', 'Thừa Thiên Huế', 'Việt Nam'),
('dest-mt-02', 'Đà Nẵng', 'Đà Nẵng', 'Việt Nam'),
('dest-mt-03', 'Hội An', 'Quảng Nam', 'Việt Nam'),
('dest-mt-04', 'Phú Yên', 'Phú Yên', 'Việt Nam'),
('dest-mt-05', 'Nha Trang', 'Khánh Hòa', 'Việt Nam'),
('dest-mt-06', 'Đà Lạt', 'Lâm Đồng', 'Việt Nam'),
('dest-mt-07', 'Quảng Bình', 'Quảng Bình', 'Việt Nam'),
('dest-mt-08', 'Bình Định', 'Bình Định', 'Việt Nam'),
('dest-mt-09', 'Nghệ An', 'Nghệ An', 'Việt Nam'),
('dest-mt-10', 'Quảng Trị', 'Quảng Trị', 'Việt Nam');
-- Miền Nam (10)
INSERT INTO destinations (destinationid, name_des, location, country) VALUES
('dest-mn-01', 'TP. Hồ Chí Minh', 'TP. Hồ Chí Minh', 'Việt Nam'),
('dest-mn-02', 'Phú Quốc', 'Kiên Giang', 'Việt Nam'),
('dest-mn-03', 'Cần Thơ', 'Cần Thơ', 'Việt Nam'),
('dest-mn-04', 'Bến Tre', 'Bến Tre', 'Việt Nam'),
('dest-mn-05', 'Vũng Tàu', 'Bà Rịa – Vũng Tàu', 'Việt Nam'),
('dest-mn-06', 'Đồng Tháp', 'Đồng Tháp', 'Việt Nam'),
('dest-mn-07', 'An Giang', 'An Giang', 'Việt Nam'),
('dest-mn-08', 'Tây Ninh', 'Tây Ninh', 'Việt Nam'),
('dest-mn-09', 'Cà Mau', 'Cà Mau', 'Việt Nam'),
('dest-mn-10', 'Bạc Liêu', 'Bạc Liêu', 'Việt Nam');

-- Promotions (3 khuyến mãi)
INSERT INTO promotions (promotionid, title, "description", discount_percentage, discount_amount, limit_usage, current_usage, start_date, end_date, status, created_at, update_date) VALUES
('promo-01', 'SUMMER25', 'Giảm 15% cho các tour biển hè 2025', 15, 0, 100, 0, '2025-06-01', '2025-08-31', 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('promo-02', 'HELLO2025', 'Giảm 200.000 VNĐ cho khách hàng mới', 0, 200000, 50, 0, '2025-01-01', '2025-03-31', 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('promo-03', 'EXPIRED10', 'Khuyến mãi đã hết hạn', 10, 0, 20, 20, '2024-01-01', '2024-02-01', 'EXPIRED', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- =================================================================
-- 2. BẢNG USER VÀ ACCOUNT
-- =================================================================

-- Users (1 Admin, 4 Customers)
INSERT INTO users (userid, name, email, phone_number, address, avatarurl) VALUES
('user-admin', 'Admin TripBee', 'admin@tripbee.com', '0123456789', '123 Admin St, HCMC', '/images/avatars/admin.png'),
('user-cust-01', 'Nguyễn Văn An', 'nguyenvanan@gmail.com', '0987654321', '456 Lê Lợi, Hà Nội', '/images/avatars/avatar1.png'),
('user-cust-02', 'Trần Thị Bình', 'tranbinh@gmail.com', '0912345678', '789 Nguyễn Huệ, Đà Nẵng', '/images/avatars/avatar2.png'),
('user-cust-03', 'Lê Minh Cường', 'lecuong@outlook.com', '0905111222', '321 Hùng Vương, Cần Thơ', '/images/avatars/avatar3.png'),
('user-cust-04', 'Phạm Hồng Duyên', 'phamduyen@yahoo.com', '0978999888', '654 Hai Bà Trưng, Huế', '/images/avatars/avatar4.png');

-- Accounts (Mật khẩu: password123)
-- Mật khẩu: $2a$10$fwhf5vj1pBq5p.Glv6prA.o5w1v.m1.L3f/E.UCqE.KVOj.wY.9/S
INSERT INTO accounts (accountid, user_name, password, role, create_date, update_date, is_locked, user_id) VALUES
('acct-admin', 'admin', '$2a$10$fwhf5vj1pBq5p.Glv6prA.o5w1v.m1.L3f/E.UCqE.KVOj.wY.9/S', 'ADMIN', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false, 'user-admin'),
('acct-cust-01', 'nguyenvanan', '$2a$10$fwhf5vj1pBq5p.Glv6prA.o5w1v.m1.L3f/E.UCqE.KVOj.wY.9/S', 'CUSTOMER', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false, 'user-cust-01'),
('acct-cust-02', 'tranbinh', '$2a$10$fwhf5vj1pBq5p.Glv6prA.o5w1v.m1.L3f/E.UCqE.KVOj.wY.9/S', 'CUSTOMER', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false, 'user-cust-02'),
('acct-cust-03', 'lecuong', '$2a$10$fwhf5vj1pBq5p.Glv6prA.o5w1v.m1.L3f/E.UCqE.KVOj.wY.9/S', 'CUSTOMER', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, true, 'user-cust-03'),
('acct-cust-04', 'phamduyen', '$2a$10$fwhf5vj1pBq5p.Glv6prA.o5w1v.m1.L3f/E.UCqE.KVOj.wY.9/S', 'CUSTOMER', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false, 'user-cust-04');

-- =================================================================
-- 3. BẢNG ẢNH ĐIỂM ĐẾN (Images) - 3 ảnh / điểm đến
-- =================================================================

-- 3 ảnh cho Hà Nội (dest-mb-01)
INSERT INTO images (imageid, url, caption, created_at, destination_id) VALUES
('img-hn-01', '/images/destinations/hanoi_des.jpg', 'Tháp Rùa Hồ Gươm', CURRENT_TIMESTAMP, 'dest-mb-01'),
('img-hn-02', '/images/destinations/hanoi02_des.jpg', 'Hà Nội về đêm', CURRENT_TIMESTAMP, 'dest-mb-01'),
('img-hn-03', '/images/destinations/hanoi03_des.jpg', 'Phố cổ Hà Nội', CURRENT_TIMESTAMP, 'dest-mb-01');
-- 3 ảnh cho Hạ Long (dest-mb-02)
INSERT INTO images (imageid, url, caption, created_at, destination_id) VALUES
('img-hl-01', '/images/destinations/halong01_des.jpg', 'Vịnh Hạ Long', CURRENT_TIMESTAMP, 'dest-mb-02'),
('img-hl-02', '/images/destinations/halong02_des.jpg', 'Du thuyền Hạ Long', CURRENT_TIMESTAMP, 'dest-mb-02'),
('img-hl-03', '/images/destinations/halong03_des.jpg', 'Toàn cảnh vịnh', CURRENT_TIMESTAMP, 'dest-mb-02');
-- 3 ảnh cho Sa Pa (dest-mb-03)
INSERT INTO images (imageid, url, caption, created_at, destination_id) VALUES
('img-sp-01', '/images/destinations/sapa01_des.webp', 'Đỉnh Fansipan', CURRENT_TIMESTAMP, 'dest-mb-03'),
('img-sp-02', '/images/destinations/sapa02_des.jpg', 'Thị trấn trong sương', CURRENT_TIMESTAMP, 'dest-mb-03'),
('img-sp-03', '/images/destinations/sapa03_des.webp', 'Fansipan có tuyết', CURRENT_TIMESTAMP, 'dest-mb-03');
-- 3 ảnh cho Ninh Bình (dest-mb-04)
INSERT INTO images (imageid, url, caption, created_at, destination_id) VALUES
('img-nb-01', '/images/destinations/ninhbinh01_des.jpg', 'Tràng An', CURRENT_TIMESTAMP, 'dest-mb-04'),
('img-nb-02', '/images/destinations/ninhbinh02_des.jpg', 'Tam Cốc Bích Động', CURRENT_TIMESTAMP, 'dest-mb-04'),
('img-nb-03', '/images/destinations/ninhbinh03_des.webp', 'Du thuyền Tràng An', CURRENT_TIMESTAMP, 'dest-mb-04');
-- 3 ảnh cho Mộc Châu (dest-mb-05)
INSERT INTO images (imageid, url, caption, created_at, destination_id) VALUES
('img-mc-01', '/images/destinations/mocchau01_des.webp', 'Đồi chè Mộc Châu', CURRENT_TIMESTAMP, 'dest-mb-05'),
('img-mc-02', '/images/destinations/mocchau02_des.jpg', 'Ruộng bậc thang', CURRENT_TIMESTAMP, 'dest-mb-05'),
('img-mc-03', '/images/destinations/mocchau03_des.jpg', 'Mùa hoa mận', CURRENT_TIMESTAMP, 'dest-mb-05');
-- 3 ảnh cho Hà Giang (dest-mb-06)
INSERT INTO images (imageid, url, caption, created_at, destination_id) VALUES
('img-hg-01', '/images/destinations/hagiang01_des.webp', 'Hẻm Tu Sản', CURRENT_TIMESTAMP, 'dest-mb-06'),
('img-hg-02', '/images/destinations/hagiang02_des.jpg', 'Ruộng bậc thang Hoàng Su Phì', CURRENT_TIMESTAMP, 'dest-mb-06'),
('img-hg-03', '/images/destinations/hagiang03_des.webp', 'Làng Lô Lô Chải', CURRENT_TIMESTAMP, 'dest-mb-06');
-- 3 ảnh cho Cát Bà (dest-mb-07)
INSERT INTO images (imageid, url, caption, created_at, destination_id) VALUES
('img-cb-01', '/images/destinations/catba01_des.jpg', 'Vịnh Lan Hạ', CURRENT_TIMESTAMP, 'dest-mb-07'),
('img-cb-02', '/images/destinations/catba02_des.jpg', 'Thị trấn Cát Bà về đêm', CURRENT_TIMESTAMP, 'dest-mb-07'),
('img-cb-03', '/images/destinations/catba03_des.jpg', 'Làng chài trên vịnh', CURRENT_TIMESTAMP, 'dest-mb-07');
-- 3 ảnh cho Mai Châu (dest-mb-08)
INSERT INTO images (imageid, url, caption, created_at, destination_id) VALUES
('img-maic-01', '/images/destinations/maichau01_des.jpg', 'Bản Lác', CURRENT_TIMESTAMP, 'dest-mb-08'),
('img-maic-02', '/images/destinations/maichau02_des.jpg', 'Toàn cảnh Mai Châu', CURRENT_TIMESTAMP, 'dest-mb-08'),
('img-maic-03', '/images/destinations/maichau03_des.jpg', 'Đạp xe ở Mai Châu', CURRENT_TIMESTAMP, 'dest-mb-08');
-- 3 ảnh cho Yên Tử (dest-mb-09)
INSERT INTO images (imageid, url, caption, created_at, destination_id) VALUES
('img-yt-01', '/images/destinations/yentu01_des.jpeg', 'Bình minh Yên Tử', CURRENT_TIMESTAMP, 'dest-mb-09'),
('img-yt-02', '/images/destinations/yentu02_des.jpg', 'Chùa Đồng', CURRENT_TIMESTAMP, 'dest-mb-09'),
('img-yt-03', '/images/destinations/yentu03_des.jpg', 'Tượng Phật hoàng', CURRENT_TIMESTAMP, 'dest-mb-09');
-- 3 ảnh cho Ba Vì (dest-mb-10)
INSERT INTO images (imageid, url, caption, created_at, destination_id) VALUES
('img-bv-01', '/images/destinations/bavi01_des.jpg', 'Vườn quốc gia Ba Vì', CURRENT_TIMESTAMP, 'dest-mb-10'),
('img-bv-02', '/images/destinations/bavi02_des.jpg', 'Hồ Suối Hai', CURRENT_TIMESTAMP, 'dest-mb-10'),
('img-bv-03', '/images/destinations/bavi03_des.jpg', 'Nhà thờ cổ Ba Vì', CURRENT_TIMESTAMP, 'dest-mb-10');

-- 3 ảnh cho Huế (dest-mt-01)
INSERT INTO images (imageid, url, caption, created_at, destination_id) VALUES
('img-hue-01', '/images/destinations/hue01_des.jpg', 'Hoàng hôn ở Kinh thành Huế', CURRENT_TIMESTAMP, 'dest-mt-01'),
('img-hue-02', '/images/destinations/hue02_des.webp', 'Lăng Minh Mạng', CURRENT_TIMESTAMP, 'dest-mt-01'),
('img-hue-03', '/images/destinations/hue03_des.jpg', 'Cổng Ngọ Môn', CURRENT_TIMESTAMP, 'dest-mt-01');
-- 3 ảnh cho Đà Nẵng (dest-mt-02)
INSERT INTO images (imageid, url, caption, created_at, destination_id) VALUES
('img-dn-01', '/images/destinations/danang01_des.jpg', 'Pháo hoa Đà Nẵng', CURRENT_TIMESTAMP, 'dest-mt-02'),
('img-dn-02', '/images/destinations/danang02_des.webp', 'Cầu Rồng về đêm', CURRENT_TIMESTAMP, 'dest-mt-02'),
('img-dn-03', '/images/destinations/danang03_des.png', 'Cầu Vàng Bà Nà', CURRENT_TIMESTAMP, 'dest-mt-02');
-- 3 ảnh cho Hội An (dest-mt-03)
INSERT INTO images (imageid, url, caption, created_at, destination_id) VALUES
('img-ha-01', '/images/destinations/hoian01_des.webp', 'Chùa Cầu', CURRENT_TIMESTAMP, 'dest-mt-03'),
('img-ha-02', '/images/destinations/hoian02_des.png', 'Thả đèn hoa đăng', CURRENT_TIMESTAMP, 'dest-mt-03'),
('img-ha-03', '/images/destinations/hoian03_des.jpg', 'Phố cổ Hội An', CURRENT_TIMESTAMP, 'dest-mt-03');
-- 3 ảnh cho Phú Yên (dest-mt-04)
INSERT INTO images (imageid, url, caption, created_at, destination_id) VALUES
('img-py-01', '/images/destinations/phuyen01_des.jpg', 'Gành Đá Đĩa', CURRENT_TIMESTAMP, 'dest-mt-04'),
('img-py-02', '/images/destinations/phuyen02_des.jpg', 'Bãi Xép', CURRENT_TIMESTAMP, 'dest-mt-04'),
('img-py-03', '/images/destinations/phuyen03_des.webp', 'Hải đăng Đại Lãnh', CURRENT_TIMESTAMP, 'dest-mt-04');
-- 3 ảnh cho Nha Trang (dest-mt-05)
INSERT INTO images (imageid, url, caption, created_at, destination_id) VALUES
('img-nt-01', '/images/destinations/nhatrang01_des.webp', 'Vịnh Nha Trang', CURRENT_TIMESTAMP, 'dest-mt-05'),
('img-nt-02', '/images/destinations/nhatrang02_des.jpg', 'Bãi biển đẹp', CURRENT_TIMESTAMP, 'dest-mt-05'),
('img-nt-03', '/images/destinations/nhatrang03_des.webp', 'Đảo Hòn Mun', CURRENT_TIMESTAMP, 'dest-mt-05');
-- 3 ảnh cho Đà Lạt (dest-mt-06)
INSERT INTO images (imageid, url, caption, created_at, destination_id) VALUES
('img-dl-01', '/images/destinations/dalat01_des.jpg', 'Hồ Tuyền Lâm', CURRENT_TIMESTAMP, 'dest-mt-06'),
('img-dl-02', '/images/destinations/dalat02_des.jpg', 'Thành phố mờ sương', CURRENT_TIMESTAMP, 'dest-mt-06'),
('img-dl-03', '/images/destinations/dalat03_des.webp', 'Đồi hoa', CURRENT_TIMESTAMP, 'dest-mt-06');
-- 3 ảnh cho Quảng Bình (dest-mt-07)
INSERT INTO images (imageid, url, caption, created_at, destination_id) VALUES
('img-qb-01', '/images/destinations/quangbinh01_des.png', 'Thành phố Đồng Hới', CURRENT_TIMESTAMP, 'dest-mt-07'),
('img-qb-02', '/images/destinations/quangbinh02_des.jpg', 'Bình minh Phong Nha', CURRENT_TIMESTAMP, 'dest-mt-07'),
('img-qb-03', '/images/destinations/quangbinh03_des.jpg', 'Cổng thành cổ', CURRENT_TIMESTAMP, 'dest-mt-07');
-- 3 ảnh cho Bình Định (dest-mt-08)
INSERT INTO images (imageid, url, caption, created_at, destination_id) VALUES
('img-bd-01', '/images/destinations/binhdinh01_des.jpg', 'Cầu Thị Nại', CURRENT_TIMESTAMP, 'dest-mt-08'),
('img-bd-02', '/images/destinations/binhdinh02_des.jpg', 'Quy Nhơn về đêm', CURRENT_TIMESTAMP, 'dest-mt-08'),
('img-bd-03', '/images/destinations/binhdinh03_des.jpg', 'Eo Gió', CURRENT_TIMESTAMP, 'dest-mt-08');
-- 3 ảnh cho Nghệ An (dest-mt-09)
INSERT INTO images (imageid, url, caption, created_at, destination_id) VALUES
('img-na-01', '/images/destinations/nghean01_des.jpg', 'Bình minh Cửa Lò', CURRENT_TIMESTAMP, 'dest-mt-09'),
('img-na-02', '/images/destinations/nghean02_des.jpg', 'Làng Sen quê Bác', CURRENT_TIMESTAMP, 'dest-mt-09'),
('img-na-03', '/images/destinations/nghean03_des.jpg', 'Biển Cửa Lò', CURRENT_TIMESTAMP, 'dest-mt-09');
-- 3 ảnh cho Quảng Trị (dest-mt-10)
INSERT INTO images (imageid, url, caption, created_at, destination_id) VALUES
('img-qt-01', '/images/destinations/quangtri01_des.jpg', 'Cầu Hiền Lương', CURRENT_TIMESTAMP, 'dest-mt-10'),
('img-qt-02', '/images/destinations/quangtri02_des.webp', 'Nghĩa trang Trường Sơn', CURRENT_TIMESTAMP, 'dest-mt-10'),
('img-qt-03', '/images/destinations/quangtri03_des.jpg', 'Chèo thuyền', CURRENT_TIMESTAMP, 'dest-mt-10');

-- 3 ảnh cho TP.HCM (dest-mn-01)
INSERT INTO images (imageid, url, caption, created_at, destination_id) VALUES
('img-hcm-01', '/images/destinations/hochiminh01_des.webp', 'UBND Thành phố', CURRENT_TIMESTAMP, 'dest-mn-01'),
('img-hcm-02', '/images/destinations/hochiminh02_des.jpg', 'Drone show', CURRENT_TIMESTAMP, 'dest-mn-01'),
('img-hcm-03', '/images/destinations/hochiminh03_des.jpg', 'Nhà thờ Đức Bà', CURRENT_TIMESTAMP, 'dest-mn-01');
-- 3 ảnh cho Phú Quốc (dest-mn-02)
INSERT INTO images (imageid, url, caption, created_at, destination_id) VALUES
('img-pq-01', '/images/destinations/phuquoc01_des.webp', 'Bãi Sao', CURRENT_TIMESTAMP, 'dest-mn-02'),
('img-pq-02', '/images/destinations/phuquoc02_des.jpg', 'Đảo Hòn Thơm', CURRENT_TIMESTAMP, 'dest-mn-02'),
('img-pq-03', '/images/destinations/phuquoc03_des.jpg', 'Cáp treo Hòn Thơm', CURRENT_TIMESTAMP, 'dest-mn-02');
-- 3 ảnh cho Cần Thơ (dest-mn-03)
INSERT INTO images (imageid, url, caption, created_at, destination_id) VALUES
('img-ct-01', '/images/destinations/cantho01_des.webp', 'Chợ nổi Cái Răng', CURRENT_TIMESTAMP, 'dest-mn-03'),
('img-ct-02', '/images/destinations/cantho02_des.jpg', 'Bến Ninh Kiều về đêm', CURRENT_TIMESTAMP, 'dest-mn-03'),
('img-ct-03', '/images/destinations/cantho03_des.jpg', 'Chợ Cần Thơ', CURRENT_TIMESTAMP, 'dest-mn-03');
-- 3 ảnh cho Bến Tre (dest-mn-04)
INSERT INTO images (imageid, url, caption, created_at, destination_id) VALUES
('img-bt-01', '/images/destinations/bentre01_des.webp', 'Rừng dừa Bến Tre', CURRENT_TIMESTAMP, 'dest-mn-04'),
('img-bt-02', '/images/destinations/bentre02_des.jpg', 'Du lịch sinh thái', CURRENT_TIMESTAMP, 'dest-mn-04'),
('img-bt-03', '/images/destinations/bentre03_des.jpg', 'Miệt vườn', CURRENT_TIMESTAMP, 'dest-mn-04');
-- 3 ảnh cho Vũng Tàu (dest-mn-05)
INSERT INTO images (imageid, url, caption, created_at, destination_id) VALUES
('img-vt-01', '/images/destinations/vungtau01_des.jpg', 'Bãi Trước Vũng Tàu', CURRENT_TIMESTAMP, 'dest-mn-05'),
('img-vt-02', '/images/destinations/vungtau02_des.jpg', 'Cột cờ', CURRENT_TIMESTAMP, 'dest-mn-05'),
('img-vt-03', '/images/destinations/vungtau03_des.jpg', 'Tượng Chúa Kito', CURRENT_TIMESTAMP, 'dest-mn-05');
-- 3 ảnh cho Đồng Tháp (dest-mn-06)
INSERT INTO images (imageid, url, caption, created_at, destination_id) VALUES
('img-dt-01', '/images/destinations/dongthap01_des.jpg', 'Đồng sen Tháp Mười', CURRENT_TIMESTAMP, 'dest-mn-06'),
('img-dt-02', '/images/destinations/dongthap02_des..jpg', 'Làng hoa Sa Đéc', CURRENT_TIMESTAMP, 'dest-mn-06'),
('img-dt-03', '/images/destinations/dongthap03_des..jpg', 'Mùa sen nở', CURRENT_TIMESTAMP, 'dest-mn-06');
-- 3 ảnh cho An Giang (dest-mn-07)
INSERT INTO images (imageid, url, caption, created_at, destination_id) VALUES
('img-ag-01', '/images/destinations/angiang01_des.jpg', 'Cánh đồng Tà Pạ', CURRENT_TIMESTAMP, 'dest-mn-07'),
('img-ag-02', '/images/destinations/angiang02_des.jpg', 'Miếu Bà Chúa Xứ', CURRENT_TIMESTAMP, 'dest-mn-07'),
('img-ag-03', '/images/destinations/angiang03_des.jpg', 'Chợ nổi Long Xuyên', CURRENT_TIMESTAMP, 'dest-mn-07');
-- 3 ảnh cho Tây Ninh (dest-mn-08)
INSERT INTO images (imageid, url, caption, created_at, destination_id) VALUES
('img-tn-01', '/images/destinations/tayninh01_des.jpg', 'Núi Bà Đen', CURRENT_TIMESTAMP, 'dest-mn-08'),
('img-tn-02', '/images/destinations/tayninh02_des.jpg', 'Tòa Thánh Tây Ninh', CURRENT_TIMESTAMP, 'dest-mn-08'),
('img-tn-03', '/images/destinations/tayninh03_des.webp', 'Toàn cảnh Tòa Thánh', CURRENT_TIMESTAMP, 'dest-mn-08');
-- 3 ảnh cho Cà Mau (dest-mn-09)
INSERT INTO images (imageid, url, caption, created_at, destination_id) VALUES
('img-cama-01', '/images/destinations/camau01_des.jpg', 'Cột mốc Mũi Cà Mau', CURRENT_TIMESTAMP, 'dest-mn-09'),
('img-cama-02', '/images/destinations/camau02_des.png', 'TP. Cà Mau', CURRENT_TIMESTAMP, 'dest-mn-09'),
('img-cama-03', '/images/destinations/camau03_des.jpg', 'Biểu tượng Cà Mau', CURRENT_TIMESTAMP, 'dest-mn-09');
-- 3 ảnh cho Bạc Liêu (dest-mn-10)
INSERT INTO images (imageid, url, caption, created_at, destination_id) VALUES
('img-bl-01', '/images/destinations/baclieu01_des.jpeg', 'Nhà hát Cao Văn Lầu', CURRENT_TIMESTAMP, 'dest-mn-10'),
('img-bl-02', '/images/destinations/baclieu02_des.jpg', 'Đờn ca tài tử', CURRENT_TIMESTAMP, 'dest-mn-10'),
('img-bl-03', '/images/destinations/baclieu03_des.jpg', 'Điện gió Bạc Liêu', CURRENT_TIMESTAMP, 'dest-mn-10');

-- =================================================================
-- 4. BẢNG TOURS (30 Tours)
-- =================================================================

-- Miền Bắc (10)
INSERT INTO tours (tourid, title, "description", start_date, end_date, duration_days, duration_nights, departure_place, price_adult, price_child, max_participants, min_participants, imageurl, status, ranking, tour_type_id) VALUES
('tour-001', 'Hà Nội: Trái tim ngàn năm văn hiến 2N1Đ', 'Khám phá 36 phố phường, Lăng Bác, Văn Miếu Quốc Tử Giám và thưởng thức ẩm thực đường phố.', '2025-04-10', '2025-04-11', 2, 1, 'TP. Hồ Chí Minh', 2200000, 1500000, 25, 5, '/images/tours/hanoi_tour.webp', 'ACTIVE', 1, 'tour-type-03'),
('tour-002', 'Vịnh Hạ Long 2N1Đ: Ngủ đêm Du thuyền 5*', 'Trải nghiệm ngủ đêm trên vịnh di sản, chèo kayak, thăm hang Sửng Sốt và tắm biển Titop.', '2025-05-15', '2025-05-16', 2, 1, 'Hà Nội', 2890000, 2000000, 20, 10, '/images/tours/halong_tour.jpg', 'ACTIVE', 2, 'tour-type-01'),
('tour-003', 'Sa Pa 3N2Đ: Chinh phục Fansipan & bản Cát Cát', 'Săn mây trên "Nóc nhà Đông Dương", khám phá văn hóa người H''Mông và ruộng bậc thang.', '2025-09-20', '2025-09-22', 3, 2, 'Hà Nội', 3500000, 2500000, 30, 8, '/images/tours/sapa_cover.jpg', 'ACTIVE', 3, 'tour-type-02'),
('tour-004', 'Ninh Bình 2N1Đ: Tràng An - Bái Đính - Hang Múa', 'Khám phá di sản kép Tràng An, leo đỉnh Hang Múa ngắm Tam Cốc và viếng chùa Bái Đính.', '2025-04-20', '2025-04-21', 2, 1, 'Hà Nội', 2100000, 1400000, 25, 5, '/images/tours/ninhbinh_tour.jpg', 'ACTIVE', 4, 'tour-type-03'),
('tour-005', 'Mộc Châu 2N1Đ: Mùa hoa cải & Đồi chè trái tim', 'Đắm chìm trong sắc trắng hoa cải, không khí trong lành và check-in đồi chè xanh ngát.', '2025-11-10', '2025-11-11', 2, 1, 'Hà Nội', 1900000, 1300000, 20, 10, '/images/tours/mocchau_tour.jpg', 'ACTIVE', 5, 'tour-type-02'),
('tour-006', 'Hà Giang 4N3Đ: Cung đường Hạnh Phúc', 'Phiêu lưu qua cao nguyên đá Đồng Văn, Mã Pì Lèng, cột cờ Lũng Cú và sông Nho Quế.', '2025-10-15', '2025-10-18', 4, 3, 'Hà Nội', 4800000, 3500000, 15, 6, '/images/tours/hagiang_tour.jpg', 'ACTIVE', 6, 'tour-type-05'),
('tour-007', 'Cát Bà - Vịnh Lan Hạ 3N2Đ: Chèo Kayak & Tắm biển', 'Khám phá vẻ đẹp hoang sơ của Vịnh Lan Hạ, chèo kayak qua các hang động và thư giãn tại bãi tắm.', '2025-06-05', '2025-06-07', 3, 2, 'Hà Nội', 3200000, 2200000, 30, 10, '/images/tours/catba_tour.jpg', 'ACTIVE', 7, 'tour-type-01'),
('tour-008', 'Mai Châu 2N1Đ: Trải nghiệm bản Lác', 'Nghỉ đêm tại nhà sàn truyền thống, đạp xe qua những cánh đồng lúa và xem múa dân tộc.', '2025-05-01', '2025-05-02', 2, 1, 'Hà Nội', 1750000, 1200000, 25, 5, '/images/tours/maichau_tour.png', 'ACTIVE', 8, 'tour-type-03'),
('tour-009', 'Yên Tử 2N1Đ: Hành hương về đất Phật', 'Đi cáp treo lên Chùa Đồng, viếng chùa Hoa Yên và tìm về chốn bình yên tâm linh.', '2025-03-10', '2025-03-11', 2, 1, 'Hà Nội', 2000000, 1400000, 30, 10, '/images/tours/yentu_tour.jpg', 'SOLD_OUT', 9, 'tour-type-03'),
('tour-010', 'Ba Vì 1N: Vườn quốc gia & Nhà thờ cổ', 'Trải nghiệm 1 ngày dã ngoại, hít thở không khí trong lành tại Vườn quốc gia và check-in nhà thờ cổ.', '2025-04-15', '2025-04-15', 1, 0, 'Hà Nội', 800000, 600000, 40, 15, '/images/tours/bavi_tour.jpg', 'PAUSE', 10, 'tour-type-02');

-- Miền Trung (10)
INSERT INTO tours (tourid, title, "description", start_date, end_date, duration_days, duration_nights, departure_place, price_adult, price_child, max_participants, min_participants, imageurl, status, ranking, tour_type_id) VALUES
('tour-011', 'Huế 3N2Đ: Dòng chảy lịch sử Cố Đô', 'Thăm Kinh thành Huế, các lăng tẩm Vua triều Nguyễn, chùa Thiên Mụ và nghe ca Huế trên sông Hương.', '2025-04-25', '2025-04-27', 3, 2, 'Hà Nội', 3600000, 2600000, 25, 5, '/images/tours/kinhthanhhue_tour.jpg', 'ACTIVE', 11, 'tour-type-03'),
('tour-012', 'Đà Nẵng 3N2Đ: Thành phố Cầu Rồng', 'Tắm biển Mỹ Khê, khám phá Bà Nà Hills, Ngũ Hành Sơn và xem Cầu Rồng phun lửa.', '2025-06-10', '2025-06-12', 3, 2, 'TP. Hồ Chí Minh', 3800000, 2800000, 30, 10, '/images/tours/danang_tour.jpg', 'ACTIVE', 12, 'tour-type-01'),
('tour-013', 'Hội An 2N1Đ: Đêm Phố Cổ lung linh', 'Dạo bước phố cổ đèn lồng, thả hoa đăng, thưởng thức Cao Lầu và may đồ lấy liền.', '2025-05-10', '2025-05-11', 2, 1, 'Đà Nẵng', 1950000, 1400000, 25, 5, '/images/tours/hoian_cover.jpg', 'ACTIVE', 13, 'tour-type-03'),
('tour-014', 'Phú Yên 3N2Đ: Xứ sở Hoa Vàng Cỏ Xanh', 'Check-in Gành Đá Đĩa độc đáo, Bãi Xép, Mũi Điện và thưởng thức hải sản tươi ngon.', '2025-07-01', '2025-07-03', 3, 2, 'Hà Nội', 4100000, 3000000, 20, 8, '/images/tours/phuyen_tour.jpg', 'ACTIVE', 14, 'tour-type-01'),
('tour-015', 'Nha Trang 3N2Đ: Thiên đường biển gọi', 'Vui chơi tại VinWonders, lặn ngắm san hô tại Hòn Mun và thư giãn trên bãi biển dài.', '2025-06-15', '2025-06-17', 3, 2, 'TP. Hồ Chí Minh', 3300000, 2400000, 30, 10, '/images/tours/nhatrang_tour.jpg', 'ACTIVE', 15, 'tour-type-01'),
('tour-016', 'Đà Lạt 3N2Đ: Thành phố ngàn hoa', 'Săn mây Cầu Đất, dạo Hồ Xuân Hương, check-in các quán cafe view đồi và thưởng thức ẩm thực đêm.', '2025-08-20', '2025-08-22', 3, 2, 'TP. Hồ Chí Minh', 2900000, 2100000, 25, 5, '/images/tours/dalat_cover.jpg', 'ACTIVE', 16, 'tour-type-02'),
('tour-017', 'Quảng Bình 3N2Đ: Khám phá Phong Nha - Kẻ Bàng', 'Du thuyền trên sông Son, khám phá động Phong Nha, động Thiên Đường và tắm suối Moọc.', '2025-07-10', '2025-07-12', 3, 2, 'Hà Nội', 4500000, 3300000, 20, 8, '/images/tours/quangbinh.jpg', 'ACTIVE', 17, 'tour-type-05'),
('tour-018', 'Bình Định 3N2Đ: Kỳ Co - Eo Gió', 'Khám phá "Maldives của Việt Nam" tại Kỳ Co, ngắm hoàng hôn ở Eo Gió và thăm tháp Chăm.', '2025-06-20', '2025-06-22', 3, 2, 'Hà Nội', 3900000, 2900000, 25, 5, '/images/tours/binhdinh_tour.jpg', 'ACTIVE', 18, 'tour-type-01'),
('tour-019', 'Nghệ An 2N1Đ: Về Làng Sen thăm quê Bác', 'Thăm Làng Sen quê Bác, tắm biển Cửa Lò và thưởng thức cháo lươn Nghệ An.', '2025-05-18', '2025-05-19', 2, 1, 'Hà Nội', 2300000, 1600000, 30, 10, '/images/tours/nghean_tour.jpg', 'ACTIVE', 19, 'tour-type-03'),
('tour-020', 'Quảng Trị 2N1Đ: Hành trình DMZ', 'Thăm lại chiến trường xưa: Thành cổ Quảng Trị, cầu Hiền Lương, sông Bến Hải, địa đạo Vịnh Mốc.', '2025-04-29', '2025-04-30', 2, 1, 'Huế', 2500000, 1800000, 20, 8, '/images/tours/quangtri.webp', 'ACTIVE', 20, 'tour-type-03');

-- Miền Nam (10)
INSERT INTO tours (tourid, title, "description", start_date, end_date, duration_days, duration_nights, departure_place, price_adult, price_child, max_participants, min_participants, imageurl, status, ranking, tour_type_id) VALUES
('tour-021', 'TP. Hồ Chí Minh 2N1Đ: Hòn ngọc Viễn Đông', 'Khám phá Dinh Độc Lập, Bưu điện Thành phố, Nhà thờ Đức Bà và trải nghiệm ẩm thực sôi động.', '2025-03-20', '2025-03-21', 2, 1, 'Hà Nội', 2400000, 1700000, 25, 5, '/images/tours/hochiminh_tour.webp', 'ACTIVE', 21, 'tour-type-03'),
('tour-022', 'Phú Quốc 3N2Đ: Đảo ngọc Rực rỡ', 'Nghỉ dưỡng tại resort 5*, vui chơi Grand World, Safari và đi cáp treo Hòn Thơm dài nhất thế giới.', '2025-07-05', '2025-07-07', 3, 2, 'TP. Hồ Chí Minh', 4500000, 3200000, 30, 10, '/images/tours/phuquoc_cover.jpg', 'ACTIVE', 22, 'tour-type-01'),
('tour-023', 'Cần Thơ 2N1Đ: Tây Đô Sông Nước', 'Trải nghiệm Chợ nổi Cái Răng lúc sáng sớm, dạo Bến Ninh Kiều và thưởng thức đờn ca tài tử.', '2025-05-05', '2025-05-06', 2, 1, 'TP. Hồ Chí Minh', 1800000, 1300000, 25, 5, '/images/tours/cantho_tour.jpeg', 'ACTIVE', 23, 'tour-type-04'),
('tour-024', 'Bến Tre 1N: Xứ Dừa Miệt Vườn', 'Đi thuyền trên rạch dừa, thăm lò làm kẹo dừa, nghe đờn ca tài tử và thưởng thức trái cây tại vườn.', '2025-04-12', '2025-04-12', 1, 0, 'TP. Hồ Chí Minh', 750000, 550000, 40, 15, '/images/tours/bentre_tour.webp', 'ACTIVE', 24, 'tour-type-04'),
('tour-025', 'Vũng Tàu 2N1Đ: Biển Vẫy Gọi', 'Tắm biển Bãi Sau, leo Tượng Chúa Kito Vua ngắm toàn cảnh thành phố và ăn hải sản đêm.', '2025-05-24', '2025-05-25', 2, 1, 'TP. Hồ Chí Minh', 1900000, 1400000, 30, 10, '/images/tours/vungtau_tour.jpg', 'ACTIVE', 25, 'tour-type-01'),
('tour-026', 'Đồng Tháp 2N1Đ: Đồng sen Tháp Mười', 'Ngắm sen nở rộ tại Tháp Mười, tham quan Vườn quốc gia Tràm Chim và làng hoa Sa Đéc.', '2025-08-10', '2025-08-11', 2, 1, 'TP. Hồ Chí Minh', 2000000, 1500000, 20, 8, '/images/tours/dongthap_tour.jpg', 'ACTIVE', 26, 'tour-type-03'),
('tour-027', 'An Giang 3N2Đ: Về miền Thất Sơn', 'Viếng Miếu Bà Chúa Xứ Núi Sam, đi thuyền rừng tràm Trà Sư và khám phá chợ Châu Đốc.', '2025-09-01', '2025-09-03', 3, 2, 'TP. Hồ Chí Minh', 3100000, 2200000, 25, 5, '/images/tours/angiang_tour.jpg', 'ACTIVE', 27, 'tour-type-03'),
('tour-028', 'Tây Ninh 1N: Chinh phục nóc nhà Nam Bộ', 'Đi cáp treo lên Núi Bà Đen, viếng chùa Bà và tham quan Tòa Thánh Cao Đài nguy nga.', '2025-03-30', '2025-03-30', 1, 0, 'TP. Hồ Chí Minh', 850000, 650000, 40, 15, '/images/tours/tayninh_tour.jpg', 'ACTIVE', 28, 'tour-type-02'),
('tour-029', 'Cà Mau 2N1Đ: Về Đất Mũi Cực Nam', 'Chạm tay vào cột mốc Cực Nam tổ quốc, đi cano xuyên rừng ngập mặn và ngắm hoàng hôn Đất Mũi.', '2025-10-10', '2025-10-11', 2, 1, 'Cần Thơ', 2600000, 1900000, 20, 8, '/images/tours/hochiminh_tour.webp', 'ACTIVE', 29, 'tour-type-03'), -- Tạm dùng ảnh HCM
('tour-030', 'Bạc Liêu 2N1Đ: Giai thoại Công tử', 'Thăm nhà Công tử Bạc Liêu, cánh đồng điện gió và nghe đờn ca tài tử tại nhà hát Cao Văn Lầu.', '2025-08-05', '2025-08-06', 2, 1, 'Cần Thơ', 2400000, 1700000, 25, 5, '/images/tours/baclieu.jpg', 'ACTIVE', 30, 'tour-type-03');

-- =================================================================
-- 5. BẢNG LIÊN KẾT N-N (TourDestinations, TourPromotions)
-- =================================================================

-- TourDestinations (Mỗi tour 1 điểm đến chính)
INSERT INTO tour_destinations (tour_destinationid, tour_id, destination_id) VALUES
('td-001', 'tour-001', 'dest-mb-01'),
('td-002', 'tour-002', 'dest-mb-02'),
('td-003', 'tour-003', 'dest-mb-03'),
('td-004', 'tour-004', 'dest-mb-04'),
('td-005', 'tour-005', 'dest-mb-05'),
('td-006', 'tour-006', 'dest-mb-06'),
('td-007', 'tour-007', 'dest-mb-07'),
('td-008', 'tour-008', 'dest-mb-08'),
('td-009', 'tour-009', 'dest-mb-09'),
('td-010', 'tour-010', 'dest-mb-10'),
('td-011', 'tour-011', 'dest-mt-01'),
('td-012', 'tour-012', 'dest-mt-02'),
('td-013', 'tour-013', 'dest-mt-03'),
('td-014', 'tour-014', 'dest-mt-04'),
('td-015', 'tour-015', 'dest-mt-05'),
('td-016', 'tour-016', 'dest-mt-06'),
('td-017', 'tour-017', 'dest-mt-07'),
('td-018', 'tour-018', 'dest-mt-08'),
('td-019', 'tour-019', 'dest-mt-09'),
('td-020', 'tour-020', 'dest-mt-10'),
('td-021', 'tour-021', 'dest-mn-01'),
('td-022', 'tour-022', 'dest-mn-02'),
('td-023', 'tour-023', 'dest-mn-03'),
('td-024', 'tour-024', 'dest-mn-04'),
('td-025', 'tour-025', 'dest-mn-05'),
('td-026', 'tour-026', 'dest-mn-06'),
('td-027', 'tour-027', 'dest-mn-07'),
('td-028', 'tour-028', 'dest-mn-08'),
('td-029', 'tour-029', 'dest-mn-09'),
('td-030', 'tour-030', 'dest-mn-10');

-- TourPromotions (Áp dụng KM 'SUMMER25' cho các tour biển)
INSERT INTO tour_promotions (tour_promotionid, tour_id, promotion_id) VALUES
('tp-001', 'tour-002', 'promo-01'), -- Hạ Long
('tp-002', 'tour-007', 'promo-01'), -- Cát Bà
('tp-003', 'tour-012', 'promo-01'), -- Đà Nẵng
('tp-004', 'tour-014', 'promo-01'), -- Phú Yên
('tp-005', 'tour-015', 'promo-01'), -- Nha Trang
('tp-006', 'tour-018', 'promo-01'), -- Bình Định
('tp-007', 'tour-022', 'promo-01'), -- Phú Quốc
('tp-008', 'tour-025', 'promo-01'), -- Vũng Tàu
('tp-009', 'tour-001', 'promo-02'); -- Áp dụng 'HELLO2025' cho tour Hà Nội

-- =================================================================
-- 6. THƯ VIỆN ẢNH TOUR (TourImages) - 3 ảnh / tour
-- =================================================================

-- (Tạm dùng ảnh destinations làm ảnh gallery tour cho 30 tour)
-- Tour 001 (Hà Nội)
INSERT INTO tour_images (tour_imageid, url, caption, tour_id) VALUES
('timg-001-1', '/images/destinations/hanoi_des.jpg', 'Tháp Rùa', 'tour-001'),
('timg-001-2', '/images/destinations/hanoi02_des.jpg', 'Hà Nội đêm', 'tour-001'),
('timg-001-3', '/images/destinations/hanoi03_des.jpg', 'Phố cổ', 'tour-001');
-- Tour 002 (Hạ Long)
INSERT INTO tour_images (tour_imageid, url, caption, tour_id) VALUES
('timg-002-1', '/images/destinations/halong01_des.jpg', 'Vịnh', 'tour-002'),
('timg-002-2', '/images/destinations/halong02_des.jpg', 'Du thuyền', 'tour-002'),
('timg-002-3', '/images/destinations/halong03_des.jpg', 'Toàn cảnh', 'tour-002');
-- Tour 003 (Sapa)
INSERT INTO tour_images (tour_imageid, url, caption, tour_id) VALUES
('timg-003-1', '/images/destinations/sapa01_des.webp', 'Đỉnh Fansipan', 'tour-003'),
('timg-003-2', '/images/destinations/sapa02_des.jpg', 'Thị trấn', 'tour-003'),
('timg-003-3', '/images/destinations/sapa03_des.webp', 'Tuyết', 'tour-003');
-- Tour 004 (Ninh Bình)
INSERT INTO tour_images (tour_imageid, url, caption, tour_id) VALUES
('timg-004-1', '/images/destinations/ninhbinh01_des.jpg', 'Tràng An', 'tour-004'),
('timg-004-2', '/images/destinations/ninhbinh02_des.jpg', 'Tam Cốc', 'tour-004'),
('timg-004-3', '/images/destinations/ninhbinh03_des.webp', 'Hoàng hôn', 'tour-004');
-- Tour 005 (Mộc Châu)
INSERT INTO tour_images (tour_imageid, url, caption, tour_id) VALUES
('timg-005-1', '/images/destinations/mocchau01_des.webp', 'Đồi chè', 'tour-005'),
('timg-005-2', '/images/destinations/mocchau02_des.jpg', 'Ruộng bậc thang', 'tour-005'),
('timg-005-3', '/images/destinations/mocchau03_des.jpg', 'Mùa hoa', 'tour-005');
-- Tour 006 (Hà Giang)
INSERT INTO tour_images (tour_imageid, url, caption, tour_id) VALUES
('timg-006-1', '/images/destinations/hagiang01_des.webp', 'Hẻm Tu Sản', 'tour-006'),
('timg-006-2', '/images/destinations/hagiang02_des.jpg', 'Hoàng Su Phì', 'tour-006'),
('timg-006-3', '/images/destinations/hagiang03_des.webp', 'Làng Lô Lô Chải', 'tour-006');
-- Tour 007 (Cát Bà)
INSERT INTO tour_images (tour_imageid, url, caption, tour_id) VALUES
('timg-007-1', '/images/destinations/catba01_des.jpg', 'Vịnh Lan Hạ', 'tour-007'),
('timg-007-2', '/images/destinations/catba02_des.jpg', 'Thị trấn Cát Bà', 'tour-007'),
('timg-007-3', '/images/destinations/catba03_des.jpg', 'Làng chài', 'tour-007');
-- Tour 008 (Mai Châu)
INSERT INTO tour_images (tour_imageid, url, caption, tour_id) VALUES
('timg-008-1', '/images/destinations/maichau01_des.jpg', 'Bản Lác', 'tour-008'),
('timg-008-2', '/images/destinations/maichau02_des.jpg', 'Toàn cảnh', 'tour-008'),
('timg-008-3', '/images/destinations/maichau03_des.jpg', 'Đạp xe', 'tour-008');
-- Tour 009 (Yên Tử)
INSERT INTO tour_images (tour_imageid, url, caption, tour_id) VALUES
('timg-009-1', '/images/destinations/yentu01_des.jpeg', 'Bình minh', 'tour-009'),
('timg-009-2', '/images/destinations/yentu02_des.jpg', 'Chùa Đồng', 'tour-009'),
('timg-009-3', '/images/destinations/yentu03_des.jpg', 'Tượng Phật', 'tour-009');
-- Tour 010 (Ba Vì)
INSERT INTO tour_images (tour_imageid, url, caption, tour_id) VALUES
('timg-010-1', '/images/destinations/bavi01_des.jpg', 'Vườn quốc gia', 'tour-010'),
('timg-010-2', '/images/destinations/bavi02_des.jpg', 'Hồ Suối Hai', 'tour-010'),
('timg-010-3', '/images/destinations/bavi03_des.jpg', 'Nhà thờ cổ', 'tour-010');
-- Tour 011 (Huế)
INSERT INTO tour_images (tour_imageid, url, caption, tour_id) VALUES
('timg-011-1', '/images/destinations/hue01_des.jpg', 'Hoàng hôn', 'tour-011'),
('timg-011-2', '/images/destinations/hue02_des.webp', 'Lăng Minh Mạng', 'tour-011'),
('timg-011-3', '/images/destinations/hue03_des.jpg', 'Ngọ Môn', 'tour-011');
-- Tour 012 (Đà Nẵng)
INSERT INTO tour_images (tour_imageid, url, caption, tour_id) VALUES
('timg-012-1', '/images/destinations/danang01_des.jpg', 'Pháo hoa', 'tour-012'),
('timg-012-2', '/images/destinations/danang02_des.webp', 'Cầu Rồng', 'tour-012'),
('timg-012-3', '/images/destinations/danang03_des.png', 'Cầu Vàng', 'tour-012');
-- Tour 013 (Hội An)
INSERT INTO tour_images (tour_imageid, url, caption, tour_id) VALUES
('timg-013-1', '/images/destinations/hoian01_des.webp', 'Chùa Cầu', 'tour-013'),
('timg-013-2', '/images/destinations/hoian02_des.png', 'Hoa đăng', 'tour-013'),
('timg-013-3', '/images/destinations/hoian03_des.jpg', 'Phố cổ', 'tour-013');
-- Tour 014 (Phú Yên)
INSERT INTO tour_images (tour_imageid, url, caption, tour_id) VALUES
('timg-014-1', '/images/destinations/phuyen01_des.jpg', 'Gành Đá Đĩa', 'tour-014'),
('timg-014-2', '/images/destinations/phuyen02_des.jpg', 'Bãi Xép', 'tour-014'),
('timg-014-3', '/images/destinations/phuyen03_des.webp', 'Hải đăng', 'tour-014');
-- Tour 015 (Nha Trang)
INSERT INTO tour_images (tour_imageid, url, caption, tour_id) VALUES
('timg-015-1', '/images/destinations/nhatrang01_des.webp', 'Vịnh', 'tour-015'),
('timg-015-2', '/images/destinations/nhatrang02_des.jpg', 'Bãi biển', 'tour-015'),
('timg-015-3', '/images/destinations/nhatrang03_des.webp', 'Hòn Mun', 'tour-015');
-- Tour 016 (Đà Lạt)
INSERT INTO tour_images (tour_imageid, url, caption, tour_id) VALUES
('timg-016-1', '/images/destinations/dalat01_des.jpg', 'Hồ Tuyền Lâm', 'tour-016'),
('timg-016-2', '/images/destinations/dalat02_des.jpg', 'Thành phố', 'tour-016'),
('timg-016-3', '/images/destinations/dalat03_des.webp', 'Đồi hoa', 'tour-016');
-- Tour 017 (Quảng Bình)
INSERT INTO tour_images (tour_imageid, url, caption, tour_id) VALUES
('timg-017-1', '/images/destinations/quangbinh01_des.png', 'Đồng Hới', 'tour-017'),
('timg-017-2', '/images/destinations/quangbinh02_des.jpg', 'Bình minh', 'tour-017'),
('timg-017-3', '/images/destinations/quangbinh03_des.jpg', 'Cổng thành', 'tour-017');
-- Tour 018 (Bình Định)
INSERT INTO tour_images (tour_imageid, url, caption, tour_id) VALUES
('timg-018-1', '/images/destinations/binhdinh01_des.jpg', 'Cầu Thị Nại', 'tour-018'),
('timg-018-2', '/images/destinations/binhdinh02_des.jpg', 'Quy Nhơn', 'tour-018'),
('timg-018-3', '/images/destinations/binhdinh03_des.jpg', 'Eo Gió', 'tour-018');
-- Tour 019 (Nghệ An)
INSERT INTO tour_images (tour_imageid, url, caption, tour_id) VALUES
('timg-019-1', '/images/destinations/nghean01_des.jpg', 'Bình minh', 'tour-019'),
('timg-019-2', '/images/destinations/nghean02_des.jpg', 'Làng Sen', 'tour-019'),
('timg-019-3', '/images/destinations/nghean03_des.jpg', 'Cửa Lò', 'tour-019');
-- Tour 020 (Quảng Trị)
INSERT INTO tour_images (tour_imageid, url, caption, tour_id) VALUES
('timg-020-1', '/images/destinations/quangtri01_des.jpg', 'Cầu Hiền Lương', 'tour-020'),
('timg-020-2', '/images/destinations/quangtri02_des.webp', 'Nghĩa trang', 'tour-020'),
('timg-020-3', '/images/destinations/quangtri03_des.jpg', 'Chèo thuyền', 'tour-020');
-- Tour 021 (TP.HCM)
INSERT INTO tour_images (tour_imageid, url, caption, tour_id) VALUES
('timg-021-1', '/images/destinations/hochiminh01_des.webp', 'UBND', 'tour-021'),
('timg-021-2', '/images/destinations/hochiminh02_des.jpg', 'Drone', 'tour-021'),
('timg-021-3', '/images/destinations/hochiminh03_des.jpg', 'Nhà thờ Đức Bà', 'tour-021');
-- Tour 022 (Phú Quốc)
INSERT INTO tour_images (tour_imageid, url, caption, tour_id) VALUES
('timg-022-1', '/images/destinations/phuquoc01_des.webp', 'Bãi Sao', 'tour-022'),
('timg-022-2', '/images/destinations/phuquoc02_des.jpg', 'Hòn Thơm', 'tour-022'),
('timg-022-3', '/images/destinations/phuquoc03_des.jpg', 'Cáp treo', 'tour-022');
-- Tour 023 (Cần Thơ)
INSERT INTO tour_images (tour_imageid, url, caption, tour_id) VALUES
('timg-023-1', '/images/destinations/cantho01_des.webp', 'Chợ nổi', 'tour-023'),
('timg-023-2', '/images/destinations/cantho02_des.jpg', 'Bến Ninh Kiều', 'tour-023'),
('timg-023-3', '/images/destinations/cantho03_des.jpg', 'Chợ Cần Thơ', 'tour-023');
-- Tour 024 (Bến Tre)
INSERT INTO tour_images (tour_imageid, url, caption, tour_id) VALUES
('timg-024-1', '/images/destinations/bentre01_des.webp', 'Rừng dừa', 'tour-024'),
('timg-024-2', '/images/destinations/bentre02_des.jpg', 'Sinh thái', 'tour-024'),
('timg-024-3', '/images/destinations/bentre03_des.jpg', 'Miệt vườn', 'tour-024');
-- Tour 025 (Vũng Tàu)
INSERT INTO tour_images (tour_imageid, url, caption, tour_id) VALUES
('timg-025-1', '/images/destinations/vungtau01_des.jpg', 'Bãi Trước', 'tour-025'),
('timg-025-2', '/images/destinations/vungtau02_des.jpg', 'Cột cờ', 'tour-025'),
('timg-025-3', '/images/destinations/vungtau03_des.jpg', 'Tượng Chúa', 'tour-025');
-- Tour 026 (Đồng Tháp)
INSERT INTO tour_images (tour_imageid, url, caption, tour_id) VALUES
('timg-026-1', '/images/destinations/dongthap01_des.jpg', 'Đồng sen', 'tour-026'),
('timg-026-2', '/images/destinations/dongthap02_des..jpg', 'Làng hoa', 'tour-026'),
('timg-026-3', '/images/destinations/dongthap03_des..jpg', 'Mùa sen', 'tour-026');
-- Tour 027 (An Giang)
INSERT INTO tour_images (tour_imageid, url, caption, tour_id) VALUES
('timg-027-1', '/images/destinations/angiang01_des.jpg', 'Tà Pạ', 'tour-027'),
('timg-027-2', '/images/destinations/angiang02_des.jpg', 'Miếu Bà', 'tour-027'),
('timg-027-3', '/images/destinations/angiang03_des.jpg', 'Chợ nổi', 'tour-027');
-- Tour 028 (Tây Ninh)
INSERT INTO tour_images (tour_imageid, url, caption, tour_id) VALUES
('timg-028-1', '/images/destinations/tayninh01_des.jpg', 'Núi Bà Đen', 'tour-028'),
('timg-028-2', '/images/destinations/tayninh02_des.jpg', 'Tòa Thánh', 'tour-028'),
('timg-028-3', '/images/destinations/tayninh03_des.webp', 'Toàn cảnh', 'tour-028');
-- Tour 029 (Cà Mau)
INSERT INTO tour_images (tour_imageid, url, caption, tour_id) VALUES
('timg-029-1', '/images/destinations/camau01_des.jpg', 'Cột mốc', 'tour-029'),
('timg-029-2', '/images/destinations/camau02_des.png', 'TP. Cà Mau', 'tour-029'),
('timg-029-3', '/images/destinations/camau03_des.jpg', 'Biểu tượng', 'tour-029');
-- Tour 030 (Bạc Liêu)
INSERT INTO tour_images (tour_imageid, url, caption, tour_id) VALUES
('timg-030-1', '/images/destinations/baclieu01_des.jpeg', 'Nhà hát', 'tour-030'),
('timg-030-2', '/images/destinations/baclieu02_des.jpg', 'Đờn ca', 'tour-030'),
('timg-030-3', '/images/destinations/baclieu03_des.jpg', 'Điện gió', 'tour-030');

-- =================================================================
-- 7. LỊCH TRÌNH MẪU (Itineraries) - Cho 3 tour đầu
-- =================================================================

-- Lịch trình Tour 001 (Hà Nội)
INSERT INTO itineraries (itineraryid, day_number, title, "description", tour_id) VALUES
('iti-001-1', 1, 'Ngày 1: Lăng Bác - Văn Miếu - Phố Cổ', 'Sáng: Xe đón quý khách, thăm Lăng Bác và Chùa Một Cột. Chiều: Thăm Văn Miếu Quốc Tử Giám. Tối: Tự do khám phá ẩm thực Phố Cổ.', 'tour-001'),
('iti-001-2', 2, 'Ngày 2: Hồ Gươm - Mua sắm - Tiễn sân bay', 'Sáng: Dạo Hồ Gươm, thăm Đền Ngọc Sơn. Chiều: Mua sắm đặc sản tại chợ Đồng Xuân. Xe tiễn quý khách ra sân bay.', 'tour-001');

-- Lịch trình Tour 002 (Hạ Long)
INSERT INTO itineraries (itineraryid, day_number, title, "description", tour_id) VALUES
('iti-002-1', 1, 'Ngày 1: Hà Nội - Hạ Long - Hang Sửng Sốt', 'Sáng: Xe đón tại Hà Nội, di chuyển đến Hạ Long. Trưa: Lên du thuyền 5*. Chiều: Thăm hang Sửng Sốt, tắm biển Titop. Tối: Ăn tối trên du thuyền.', 'tour-002'),
('iti-002-2', 2, 'Ngày 2: Chèo Kayak - Về Hà Nội', 'Sáng: Chèo Kayak tại khu vực Hang Luồn. Trưa: Ăn trưa trên du thuyền, tàu cập bến. Chiều: Xe đưa quý khách về Hà Nội.', 'tour-002');

-- Lịch trình Tour 003 (Sapa)
INSERT INTO itineraries (itineraryid, day_number, title, "description", tour_id) VALUES
('iti-003-1', 1, 'Ngày 1: Hà Nội - Sapa - Bản Cát Cát', 'Sáng: Đi xe bus giường nằm lên Sapa. Trưa: Nhận phòng khách sạn. Chiều: Trekking bản Cát Cát, thăm thác nước, nhà máy thủy điện cũ.', 'tour-003'),
('iti-003-2', 2, 'Ngày 2: Chinh phục Fansipan', 'Sáng: Đi tàu hỏa Mường Hoa, đi cáp treo lên đỉnh Fansipan - "Nóc nhà Đông Dương". Chiều: Tự do khám phá thị trấn, nhà thờ Đá.', 'tour-003'),
('iti-003-3', 3, 'Ngày 3: Sapa - Hà Nội', 'Sáng: Tự do mua sắm. Trưa: Trả phòng, lên xe bus về Hà Nội.', 'tour-003');

-- =================================================================
-- 8. BẢNG TƯƠNG TÁC (Reviews, Favorites, Bookings...)
-- =================================================================

-- Reviews (Đánh giá mẫu)
INSERT INTO reviews (reviewid, rating, comment, created_at, status, user_id, tour_id) VALUES
('rev-001', 5, 'Tour Hạ Long (tour-002) rất tuyệt vời, du thuyền 5* xịn, đồ ăn ngon. Hướng dẫn viên nhiệt tình.', '2024-10-01 10:30:00', 'APPROVED', 'user-cust-01', 'tour-002'),
('rev-002', 4, 'Trải nghiệm Sapa (tour-003) rất đáng nhớ. Tuy nhiên đồ ăn ở Sapa hơi khó ăn.', '2024-09-15 14:00:00', 'APPROVED', 'user-cust-02', 'tour-003'),
('rev-003', 3, 'Phòng khách sạn tour Hội An (tour-013) hơi cũ. Mọi thứ khác đều ổn.', '2024-10-05 20:00:00', 'PENDING', 'user-cust-04', 'tour-013');

-- Favorites (Yêu thích mẫu)
INSERT INTO favorites (favoriteid, added_at, user_id, tour_id) VALUES
('fav-001', CURRENT_TIMESTAMP, 'user-cust-01', 'tour-003'), -- User An thích tour Sapa
('fav-002', CURRENT_TIMESTAMP, 'user-cust-01', 'tour-013'), -- User An thích tour Hội An
('fav-003', CURRENT_TIMESTAMP, 'user-cust-02', 'tour-002'); -- User Bình thích tour Hạ Long

-- ContactMessages (Tin nhắn liên hệ mẫu)
INSERT INTO contact_messages (contact_messid, email, phone, message, sent_at, user_id) VALUES
('msg-001', 'guest@example.com', '0123456789', 'Tôi muốn hỏi về tour Hạ Long (tour-002) cho đoàn 30 người?', CURRENT_TIMESTAMP, NULL),
('msg-002', 'nguyenvanan@gmail.com', '0987654321', 'Tôi muốn hủy tour Sapa (tour-003) đã đặt ngày 20/12.', CURRENT_TIMESTAMP, 'user-cust-01');

-- Bookings (Đặt tour mẫu)
-- Booking 1: User An, tour Hạ Long (tour-002), 2 lớn 1 bé, có KM 'SUMMER25' (15%)
-- Giá gốc: 2 * 2.890.000 + 1 * 2.000.000 = 7.780.000
-- Giảm 15%: 7.780.000 * 0.15 = 1.167.000
-- Cuối cùng: 7.780.000 - 1.167.000 = 6.613.000
INSERT INTO bookings (bookingid, booking_date, num_adults, num_children, total_price, discount_amount, final_amount, status, user_id, tour_id, promotion_id) VALUES
('bkg-001', '2025-04-01 08:00:00', 2, 1, 7780000, 1167000, 6613000, 'COMPLETED', 'user-cust-01', 'tour-002', 'promo-01');

-- Booking 2: User Bình, tour Hội An (tour-013), 2 lớn, không KM
-- Giá gốc: 2 * 1.950.000 = 3.900.000
INSERT INTO bookings (bookingid, booking_date, num_adults, num_children, total_price, discount_amount, final_amount, status, user_id, tour_id, promotion_id) VALUES
('bkg-002', '2025-04-05 11:30:00', 2, 0, 3900000, 0, 3900000, 'CONFIRMED', 'user-cust-02', 'tour-013', NULL);

-- Booking 3: User Duyên, tour Đà Lạt (tour-016), 1 lớn, CANCELED
INSERT INTO bookings (bookingid, booking_date, num_adults, num_children, total_price, discount_amount, final_amount, status, user_id, tour_id, promotion_id) VALUES
('bkg-003', '2025-04-10 16:45:00', 1, 0, 2900000, 0, 2900000, 'CANCELED', 'user-cust-04', 'tour-016', NULL);

-- Participants (Hành khách mẫu)
INSERT INTO participants (participantid, customer_name, customer_phone, identification, gender, participant_type, booking_id) VALUES
('part-001', 'Nguyễn Văn An', '0987654321', '0123456789', 'MALE', 'ADULT', 'bkg-001'),
('part-002', 'Nguyễn Thị Cúc', '0987654322', '0123456790', 'FEMALE', 'ADULT', 'bkg-001'),
('part-003', 'Nguyễn Bé An', '', '', 'MALE', 'CHILD', 'bkg-001'),
('part-004', 'Trần Thị Bình', '0912345678', '0234567890', 'FEMALE', 'ADULT', 'bkg-002'),
('part-005', 'Lý Văn Hùng', '0912345679', '0234567891', 'MALE', 'ADULT', 'bkg-002');

-- Invoices (Hóa đơn mẫu)
INSERT INTO invoices (invoiceid, total_amount, tax_percentage, created_at, booking_id) VALUES
('inv-001', 6613000, 8, '2025-04-01 08:01:00', 'bkg-001'),
('inv-002', 3900000, 8, '2025-04-05 11:31:00', 'bkg-002');

-- Payments (Thanh toán mẫu)
INSERT INTO payments (paymentid, amount_paid, payment_date, status, payment_method, transaction_code, invoice_id) VALUES
('pay-001', 6613000, '2025-04-01 08:05:00', 'SUCCESS', 'VNPAY', 'VNP123456', 'inv-001'),
('pay-002', 3900000, '2025-04-05 11:35:00', 'SUCCESS', 'CREDIT_CARD', 'CC789012', 'inv-002');
