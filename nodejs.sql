-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 24, 2023 at 05:20 AM
-- Server version: 10.4.25-MariaDB
-- PHP Version: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `nodejs`
--

-- --------------------------------------------------------

--
-- Table structure for table `bangdiems`
--

CREATE TABLE `bangdiems` (
  `id` int(11) NOT NULL,
  `kiemtra_mieng` int(11) DEFAULT NULL,
  `kiemtra15p_lan1` int(11) DEFAULT NULL,
  `kiemtra15p_lan2` int(11) DEFAULT NULL,
  `kiemtra_30p` int(11) DEFAULT NULL,
  `kiemtra_45p` int(11) DEFAULT NULL,
  `diem_thi` int(11) DEFAULT NULL,
  `tb_mon` int(11) DEFAULT NULL,
  `id_monhoc` varchar(255) DEFAULT NULL,
  `id_sinhvien` varchar(255) DEFAULT NULL,
  `id_giaovien` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `contacts`
--

CREATE TABLE `contacts` (
  `id` int(11) NOT NULL,
  `realName` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `demo`
--

CREATE TABLE `demo` (
  `id` int(11) NOT NULL,
  `hoten` varchar(100) NOT NULL,
  `namsinh` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `demo`
--

INSERT INTO `demo` (`id`, `hoten`, `namsinh`) VALUES
(1, 'Thạch Chanh Tha', '1992'),
(2, 'Nguyễn Đức Cảnh', '1999');

-- --------------------------------------------------------

--
-- Table structure for table `lophocs`
--

CREATE TABLE `lophocs` (
  `id` int(11) NOT NULL,
  `ma_lop` varchar(255) DEFAULT NULL,
  `ten_lop` varchar(255) DEFAULT NULL,
  `gvcn` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `lophocs`
--

INSERT INTO `lophocs` (`id`, `ma_lop`, `ten_lop`, `gvcn`, `createdAt`, `updatedAt`) VALUES
(1, 'CNTT-10', 'Công Nghệ Thông Tin-2010', 'Bùi Hữu Kính', '2023-04-04 14:05:44', '2023-04-04 14:05:44'),
(5, 'CNTT-11', 'Công Nghệ Thông Tin-2011', 'Lê Đức Thọ', '2023-04-04 13:09:47', '2023-04-04 13:26:46'),
(8, 'CNTT-12', 'Công Nghệ Thông Tin-2012', 'Vũ Minh Chiến', '2023-04-06 04:32:57', '2023-04-06 04:46:04');

-- --------------------------------------------------------

--
-- Table structure for table `monhocs`
--

CREATE TABLE `monhocs` (
  `id` int(11) NOT NULL,
  `ma_mon` varchar(255) DEFAULT NULL,
  `ten_mon` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `permissons`
--

CREATE TABLE `permissons` (
  `id` int(11) NOT NULL,
  `permisson_name` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `permissons`
--

INSERT INTO `permissons` (`id`, `permisson_name`, `createdAt`, `updatedAt`) VALUES
(1, 'Add', '2023-04-23 10:22:22', '2023-04-23 10:22:22'),
(2, 'Edit', '2023-04-23 10:22:22', '2023-04-23 10:22:22'),
(3, 'Update', '2023-04-23 10:22:22', '2023-04-23 10:22:22'),
(4, 'Delete', '2023-04-23 10:22:22', '2023-04-23 10:22:22'),
(5, 'List', '2023-04-23 10:22:22', '2023-04-23 10:22:22');

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id` int(11) NOT NULL,
  `role_name` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id`, `role_name`, `createdAt`, `updatedAt`) VALUES
(1, 'Admin', '2023-04-23 10:21:44', '2023-04-23 10:21:44'),
(2, 'Guest', '2023-04-23 10:21:44', '2023-04-23 10:21:44');

-- --------------------------------------------------------

--
-- Table structure for table `role_permissions`
--

CREATE TABLE `role_permissions` (
  `id` int(11) NOT NULL,
  `id_role` varchar(255) DEFAULT NULL,
  `id_permission` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `role_permissions`
--

INSERT INTO `role_permissions` (`id`, `id_role`, `id_permission`, `createdAt`, `updatedAt`) VALUES
(1, '1', '1', '2023-04-23 10:25:20', '2023-04-23 10:25:20'),
(2, '1', '2', '2023-04-23 10:25:20', '2023-04-23 10:25:20');

-- --------------------------------------------------------

--
-- Table structure for table `sequelizemeta`
--

CREATE TABLE `sequelizemeta` (
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `sequelizemeta`
--

INSERT INTO `sequelizemeta` (`name`) VALUES
('20230228132838-create-contact.js'),
('20230323133036-create-tintucdatxanh.js'),
('20230404030416-create-sinhvien.js'),
('20230404120023-create-lophoc.js'),
('20230406045730-create-monhoc.js'),
('20230406051409-create-bangdiem.js'),
('20230419094236-create-user.js'),
('20230423081539-create-role.js'),
('20230423081720-create-permisson.js'),
('20230423081824-create-user-role.js'),
('20230423081936-create-role-permission.js');

-- --------------------------------------------------------

--
-- Table structure for table `sinhviens`
--

CREATE TABLE `sinhviens` (
  `id` int(11) NOT NULL,
  `ma_sv` varchar(255) DEFAULT NULL,
  `ten_sv` varchar(255) DEFAULT NULL,
  `ngaysinh_sv` date DEFAULT NULL,
  `gioitinh_sv` tinyint(1) DEFAULT NULL,
  `diachi_sv` varchar(255) DEFAULT NULL,
  `sdt_sv` varchar(255) DEFAULT NULL,
  `ma_lop` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `sinhviens`
--

INSERT INTO `sinhviens` (`id`, `ma_sv`, `ten_sv`, `ngaysinh_sv`, `gioitinh_sv`, `diachi_sv`, `sdt_sv`, `ma_lop`, `createdAt`, `updatedAt`) VALUES
(62, '13', '13', '0000-00-00', 1, '13', '13', '13', '2023-04-18 09:46:03', '2023-04-18 09:46:03');

-- --------------------------------------------------------

--
-- Table structure for table `tintucdatxanhs`
--

CREATE TABLE `tintucdatxanhs` (
  `id` int(11) NOT NULL,
  `tieude_baiviet` varchar(255) DEFAULT NULL,
  `noidung_baiviet` varchar(255) DEFAULT NULL,
  `danhmuc_baiviet` text DEFAULT NULL,
  `tacgia_baiviet` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `tintucdatxanhs`
--

INSERT INTO `tintucdatxanhs` (`id`, `tieude_baiviet`, `noidung_baiviet`, `danhmuc_baiviet`, `tacgia_baiviet`, `createdAt`, `updatedAt`) VALUES
(1, 'Cần Thơ ngày thêm đổi mới đó nha 123', 'Chiều 23-3, Thường trực Ban Chỉ đạo triển khai thực hiện Nghị quyết số 59-NQ/TW của Bộ Chính trị, Nghị quyết số 45/2022/QH15 của Quốc hội, Nghị quyết số 98/NQ-CP của Chính phủ và các dự án trọng điểm trên địa bàn thành phố Cần Thơ họp về tiến độ thực hiện', 'Tin Tức Thị Trường', 'Thạch Chanh Tha', '2023-03-24 09:23:57', '2023-03-27 13:36:26'),
(2, 'Trà Vinh ngày thêm đổi mới', 'Chiều 23-3, Thường trực Ban Chỉ đạo triển khai thực hiện Nghị quyết số 59-NQ/TW của Bộ Chính trị, Nghị quyết số 45/2022/QH15 của Quốc hội, Nghị quyết số 98/NQ-CP của Chính phủ và các dự án trọng điểm trên địa bàn thành phố Cần Thơ họp về tiến độ thực hiện', 'Tin Tức Thị Trường', 'Ngô Thị Diễm My', '2023-03-24 09:23:57', '2023-03-24 09:23:57'),
(4, '3456', '3456', '3456', '3456', '2023-03-25 12:04:17', '2023-03-25 12:04:17');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `diachi` varchar(255) DEFAULT NULL,
  `sdt` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `diachi`, `sdt`, `password`, `createdAt`, `updatedAt`) VALUES
(1, 'sieuga', 'sieuga@gmail.com', 'Cầu Kè-Trà vinh', '0908346989', '123', '2023-04-19 11:43:36', '2023-04-19 11:43:36'),
(2, 'tha', 'tha@gmail.com', 'Cầu Kè-Trà vinh', '0908346989', '123', '2023-04-19 11:43:36', '2023-04-19 11:43:36');

-- --------------------------------------------------------

--
-- Table structure for table `user_roles`
--

CREATE TABLE `user_roles` (
  `id` int(11) NOT NULL,
  `id_user` varchar(255) DEFAULT NULL,
  `id_role` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `user_roles`
--

INSERT INTO `user_roles` (`id`, `id_user`, `id_role`, `createdAt`, `updatedAt`) VALUES
(1, '1', '1', '2023-04-23 10:26:28', '2023-04-23 10:26:28'),
(2, '1', '2', '2023-04-23 10:26:28', '2023-04-23 10:26:28'),
(4, '2', '2', '2023-04-23 10:26:43', '2023-04-23 10:26:43');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `bangdiems`
--
ALTER TABLE `bangdiems`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `contacts`
--
ALTER TABLE `contacts`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `demo`
--
ALTER TABLE `demo`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `lophocs`
--
ALTER TABLE `lophocs`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `monhocs`
--
ALTER TABLE `monhocs`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `permissons`
--
ALTER TABLE `permissons`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `role_permissions`
--
ALTER TABLE `role_permissions`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `sequelizemeta`
--
ALTER TABLE `sequelizemeta`
  ADD PRIMARY KEY (`name`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `sinhviens`
--
ALTER TABLE `sinhviens`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tintucdatxanhs`
--
ALTER TABLE `tintucdatxanhs`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_roles`
--
ALTER TABLE `user_roles`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `bangdiems`
--
ALTER TABLE `bangdiems`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `contacts`
--
ALTER TABLE `contacts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `demo`
--
ALTER TABLE `demo`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `lophocs`
--
ALTER TABLE `lophocs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `monhocs`
--
ALTER TABLE `monhocs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `permissons`
--
ALTER TABLE `permissons`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `role_permissions`
--
ALTER TABLE `role_permissions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `sinhviens`
--
ALTER TABLE `sinhviens`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=65;

--
-- AUTO_INCREMENT for table `tintucdatxanhs`
--
ALTER TABLE `tintucdatxanhs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `user_roles`
--
ALTER TABLE `user_roles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
