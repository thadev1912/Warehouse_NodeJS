-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 14, 2023 at 02:36 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.1.17

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
-- Table structure for table `chitietnhapkhos`
--

CREATE TABLE `chitietnhapkhos` (
  `id` int(11) NOT NULL,
  `id_phieunhap` varchar(255) DEFAULT NULL,
  `id_vattu` varchar(255) DEFAULT NULL,
  `sl_vattu` varchar(255) DEFAULT NULL,
  `id_kho` varchar(255) DEFAULT NULL,
  `id_lydo` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `chitietnhapkhos`
--

INSERT INTO `chitietnhapkhos` (`id`, `id_phieunhap`, `id_vattu`, `sl_vattu`, `id_kho`, `id_lydo`, `createdAt`, `updatedAt`) VALUES
(1, 'PNK01', 'VT01', '20', 'KH01', '1', '2023-05-14 10:18:43', '2023-05-14 10:18:43');

-- --------------------------------------------------------

--
-- Table structure for table `chitietxuatkhos`
--

CREATE TABLE `chitietxuatkhos` (
  `id` int(11) NOT NULL,
  `id_phieuxuat` varchar(255) DEFAULT NULL,
  `id_vattu` varchar(255) DEFAULT NULL,
  `sl_vattu` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `chitietxuatkhos`
--

INSERT INTO `chitietxuatkhos` (`id`, `id_phieuxuat`, `id_vattu`, `sl_vattu`, `createdAt`, `updatedAt`) VALUES
(1, 'PXK01', 'VT01', '10', '2023-05-14 10:45:34', '2023-05-14 10:45:34'),
(3, 'PXK02', 'VT02', '20', '2023-05-14 10:45:34', '2023-05-14 10:45:34');

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `donvitinhs`
--

CREATE TABLE `donvitinhs` (
  `id` int(11) NOT NULL,
  `donvitinh` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `donvitinhs`
--

INSERT INTO `donvitinhs` (`id`, `donvitinh`, `createdAt`, `updatedAt`) VALUES
(1, 'Cái', '2023-05-14 06:54:48', '2023-05-14 06:54:48'),
(2, 'Bịch', '2023-05-14 06:54:48', '2023-05-14 06:54:48');

-- --------------------------------------------------------

--
-- Table structure for table `invoice_nhaps`
--

CREATE TABLE `invoice_nhaps` (
  `id` int(11) NOT NULL,
  `invoice_number` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `invoice_nhaps`
--

INSERT INTO `invoice_nhaps` (`id`, `invoice_number`, `createdAt`, `updatedAt`) VALUES
(1, 'PNK01', '2023-05-14 11:05:24', '2023-05-14 11:05:24'),
(2, 'PNK02', '2023-05-14 11:05:24', '2023-05-14 11:05:24'),
(3, '789', '2023-05-14 09:13:33', '2023-05-14 09:17:18'),
(5, '666', '2023-05-14 09:17:30', '2023-05-14 09:17:30');

-- --------------------------------------------------------

--
-- Table structure for table `invoice_xuats`
--

CREATE TABLE `invoice_xuats` (
  `id` int(11) NOT NULL,
  `invoice_number` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `invoice_xuats`
--

INSERT INTO `invoice_xuats` (`id`, `invoice_number`, `createdAt`, `updatedAt`) VALUES
(1, 'PXK01', '2023-05-14 11:05:45', '2023-05-14 11:05:45'),
(2, 'PXK02', '2023-05-14 11:05:45', '2023-05-14 11:05:45');

-- --------------------------------------------------------

--
-- Table structure for table `khos`
--

CREATE TABLE `khos` (
  `id` int(11) NOT NULL,
  `ma_kho` varchar(255) DEFAULT NULL,
  `ten_kho` varchar(255) DEFAULT NULL,
  `dia_chi` varchar(255) DEFAULT NULL,
  `sdt` varchar(255) DEFAULT NULL,
  `ghi_chu` text DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `khos`
--

INSERT INTO `khos` (`id`, `ma_kho`, `ten_kho`, `dia_chi`, `sdt`, `ghi_chu`, `createdAt`, `updatedAt`) VALUES
(1, 'KH01', 'Kho Ninh Kiều', 'Mậu Thân- Ninh Kiều', '0908 346 989', NULL, '2023-05-13 05:20:55', '2023-05-13 05:20:55'),
(2, 'KH02', 'Kho Cái Răng', 'Lê Hồng Phong', '038 778 1268', NULL, '2023-05-13 05:20:55', '2023-05-13 05:20:55'),
(3, '789', '789', '789', '789', '789', '2023-05-14 02:49:45', '2023-05-14 02:49:55');

-- --------------------------------------------------------

--
-- Table structure for table `lydonhaps`
--

CREATE TABLE `lydonhaps` (
  `id` int(11) NOT NULL,
  `lydo` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `lydonhaps`
--

INSERT INTO `lydonhaps` (`id`, `lydo`, `createdAt`, `updatedAt`) VALUES
(1, 'Nhập định kỳ', '2023-05-14 06:21:26', '2023-05-14 06:21:26'),
(2, 'Nhập dự phòng', '2023-05-14 06:21:26', '2023-05-14 06:21:26'),
(4, '123', '2023-05-14 04:34:25', '2023-05-14 04:34:25');

-- --------------------------------------------------------

--
-- Table structure for table `lydoxuats`
--

CREATE TABLE `lydoxuats` (
  `id` int(11) NOT NULL,
  `lydo` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `lydoxuats`
--

INSERT INTO `lydoxuats` (`id`, `lydo`, `createdAt`, `updatedAt`) VALUES
(1, 'Xuất sản xuất', '2023-05-14 06:21:51', '2023-05-14 06:21:51'),
(2, 'Xuất gấp', '2023-05-14 06:21:51', '2023-05-14 06:21:51');

-- --------------------------------------------------------

--
-- Table structure for table `nhacungcaps`
--

CREATE TABLE `nhacungcaps` (
  `id` int(11) NOT NULL,
  `ma_nhacc` varchar(255) DEFAULT NULL,
  `ten_nhacc` varchar(255) DEFAULT NULL,
  `diachi_nhacc` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `nhacungcaps`
--

INSERT INTO `nhacungcaps` (`id`, `ma_nhacc`, `ten_nhacc`, `diachi_nhacc`, `createdAt`, `updatedAt`) VALUES
(1, 'TTD', 'Công Ty Trung Thành Danh', 'Quận Ninh Kiều-Cần Thơ', '2023-05-14 05:55:32', '2023-05-14 05:55:32'),
(4, 'BBC', 'Công Ty Bảo Bảo Công', 'Quận Cái Răng-Cần Thơ', '2023-05-14 05:55:32', '2023-05-14 05:55:32');

-- --------------------------------------------------------

--
-- Table structure for table `permissons`
--

CREATE TABLE `permissons` (
  `id` int(11) NOT NULL,
  `permisson_name` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
-- Table structure for table `phieunhapkhos`
--

CREATE TABLE `phieunhapkhos` (
  `id` int(11) NOT NULL,
  `ma_phieu` varchar(255) DEFAULT NULL,
  `id_nhanvien` varchar(255) DEFAULT NULL,
  `id_kho` varchar(255) DEFAULT NULL,
  `id_nhacc` varchar(255) DEFAULT NULL,
  `id_lydo` varchar(255) DEFAULT NULL,
  `ngaynhap` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `phieunhapkhos`
--

INSERT INTO `phieunhapkhos` (`id`, `ma_phieu`, `id_nhanvien`, `id_kho`, `id_nhacc`, `id_lydo`, `ngaynhap`, `createdAt`, `updatedAt`) VALUES
(1, 'PNK001', 'NV01', 'KH01', 'TTD', '1', '2023-05-08 13:57:34', '2023-05-14 08:57:34', '2023-05-14 08:57:34'),
(4, 'PNK002', 'NV02', 'KH02', 'BBC', '1', '2023-05-08 13:57:34', '2023-05-14 08:57:34', '2023-05-14 08:57:34');

-- --------------------------------------------------------

--
-- Table structure for table `phieuxuatkhos`
--

CREATE TABLE `phieuxuatkhos` (
  `id` int(11) NOT NULL,
  `ma_phieu` varchar(255) DEFAULT NULL,
  `id_thukho` varchar(255) DEFAULT NULL,
  `id_nhanvien` varchar(255) DEFAULT NULL,
  `id_lydo` varchar(255) DEFAULT NULL,
  `ngayxuat` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `phieuxuatkhos`
--

INSERT INTO `phieuxuatkhos` (`id`, `ma_phieu`, `id_thukho`, `id_nhanvien`, `id_lydo`, `ngayxuat`, `createdAt`, `updatedAt`) VALUES
(1, 'PXK01', 'NV01', 'NV01', '1', NULL, '2023-05-14 09:39:46', '2023-05-14 09:39:46'),
(2, '123', NULL, '123', '123', NULL, '2023-05-14 07:42:43', '2023-05-14 07:42:43'),
(4, 'PXK02', 'NV02', 'NV02', '2', NULL, '2023-05-14 09:39:46', '2023-05-14 09:39:46');

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id` int(11) NOT NULL,
  `role_name` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `sequelizemeta`
--

INSERT INTO `sequelizemeta` (`name`) VALUES
('20230228132838-create-contact.js'),
('20230419094236-create-user.js'),
('20230423081539-create-role.js'),
('20230423081720-create-permisson.js'),
('20230423081824-create-user-role.js'),
('20230423081936-create-role-permission.js'),
('20230508143043-create-kho.js'),
('20230514030825-create-vattu.js'),
('20230514035428-create-nhacungcap.js'),
('20230514042050-create-lydo-nhap.js'),
('20230514042103-create-lydo-xuat.js'),
('20230514044701-create-donvitinh.js'),
('20230514065001-create-phieunhapkho.js'),
('20230514065232-create-phieuxuatkho.js'),
('20230514080645-create-chitietnhapkho.js'),
('20230514080807-create-chitietxuatkho.js'),
('20230514085856-create-invoice-nhap.js'),
('20230514085911-create-invoice-xuat.js');

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sinhviens`
--

INSERT INTO `sinhviens` (`id`, `ma_sv`, `ten_sv`, `ngaysinh_sv`, `gioitinh_sv`, `diachi_sv`, `sdt_sv`, `ma_lop`, `createdAt`, `updatedAt`) VALUES
(62, '13', '13', '0000-00-00', 1, '13', '13', '13', '2023-04-18 09:46:03', '2023-04-18 09:46:03');

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_roles`
--

INSERT INTO `user_roles` (`id`, `id_user`, `id_role`, `createdAt`, `updatedAt`) VALUES
(1, '1', '1', '2023-04-23 10:26:28', '2023-04-23 10:26:28'),
(2, '1', '2', '2023-04-23 10:26:28', '2023-04-23 10:26:28'),
(4, '2', '2', '2023-04-23 10:26:43', '2023-04-23 10:26:43');

-- --------------------------------------------------------

--
-- Table structure for table `vattus`
--

CREATE TABLE `vattus` (
  `id` int(11) NOT NULL,
  `ma_vattu` varchar(255) DEFAULT NULL,
  `ten_vattu` varchar(255) DEFAULT NULL,
  `donvitinh` varchar(255) DEFAULT NULL,
  `soluong` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `vattus`
--

INSERT INTO `vattus` (`id`, `ma_vattu`, `ten_vattu`, `donvitinh`, `soluong`, `createdAt`, `updatedAt`) VALUES
(1, 'VT01', 'Bút Chì', 'Cái', '10', '2023-05-14 05:13:24', '2023-05-14 05:13:24'),
(2, '999', '999', '999', '999', '2023-05-14 03:30:07', '2023-05-14 03:35:16');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `chitietnhapkhos`
--
ALTER TABLE `chitietnhapkhos`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `chitietxuatkhos`
--
ALTER TABLE `chitietxuatkhos`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `contacts`
--
ALTER TABLE `contacts`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `donvitinhs`
--
ALTER TABLE `donvitinhs`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `invoice_nhaps`
--
ALTER TABLE `invoice_nhaps`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `invoice_xuats`
--
ALTER TABLE `invoice_xuats`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `khos`
--
ALTER TABLE `khos`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `lydonhaps`
--
ALTER TABLE `lydonhaps`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `lydoxuats`
--
ALTER TABLE `lydoxuats`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `nhacungcaps`
--
ALTER TABLE `nhacungcaps`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `permissons`
--
ALTER TABLE `permissons`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `phieunhapkhos`
--
ALTER TABLE `phieunhapkhos`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `phieuxuatkhos`
--
ALTER TABLE `phieuxuatkhos`
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
-- Indexes for table `vattus`
--
ALTER TABLE `vattus`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `chitietnhapkhos`
--
ALTER TABLE `chitietnhapkhos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `chitietxuatkhos`
--
ALTER TABLE `chitietxuatkhos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `contacts`
--
ALTER TABLE `contacts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `donvitinhs`
--
ALTER TABLE `donvitinhs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `invoice_nhaps`
--
ALTER TABLE `invoice_nhaps`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `invoice_xuats`
--
ALTER TABLE `invoice_xuats`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `khos`
--
ALTER TABLE `khos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `lydonhaps`
--
ALTER TABLE `lydonhaps`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `lydoxuats`
--
ALTER TABLE `lydoxuats`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `nhacungcaps`
--
ALTER TABLE `nhacungcaps`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `permissons`
--
ALTER TABLE `permissons`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `phieunhapkhos`
--
ALTER TABLE `phieunhapkhos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `phieuxuatkhos`
--
ALTER TABLE `phieuxuatkhos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

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
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `user_roles`
--
ALTER TABLE `user_roles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `vattus`
--
ALTER TABLE `vattus`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
