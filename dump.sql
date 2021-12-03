/*
 Navicat Premium Data Transfer

 Source Server         : localhost
 Source Server Type    : MySQL
 Source Server Version : 80027
 Source Host           : localhost:3306
 Source Schema         : shop

 Target Server Type    : MySQL
 Target Server Version : 80027
 File Encoding         : 65001

 Date: 28/11/2021 20:42:09
*/

create database `shop` default character set utf8 collate utf8_general_ci;
 
use shop;

-- ----------------------------
-- Table structure for orders
-- ----------------------------
DROP TABLE IF EXISTS `orders`;
CREATE TABLE `orders` (
  `orderid` int NOT NULL AUTO_INCREMENT COMMENT '订单id',
  `userid` int NOT NULL COMMENT '用户id',
  `proid` int NOT NULL COMMENT '商品id',
  `status` int DEFAULT NULL COMMENT '订单状态:0-已取消-10-未付款，20-已付款，40-已发货，50-交易成功，60-交易关闭',
  `recipient` varchar(64) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '收货人姓名',
  `phone` varchar(11) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '收货人手机号',
  `address` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '收货人地址',
  `quantity` int NOT NULL COMMENT '商品数量',
  `payment` decimal(20,2) NOT NULL COMMENT '实际付款金额,单位是元,保留两位小数',
  `paymenttype` int DEFAULT '1' COMMENT '支付类型,1-在线支付',
  `payment_time` datetime DEFAULT NULL COMMENT '支付时间',
  `send_time` datetime DEFAULT NULL COMMENT '发货时间',
  `end_time` datetime DEFAULT NULL COMMENT '交易完成时间',
  `closed_time` datetime DEFAULT NULL COMMENT '交易关闭时间',
  `created_time` datetime DEFAULT NULL COMMENT '创建时间',
  `updated_time` datetime DEFAULT NULL COMMENT '更新时间',
  PRIMARY KEY (`orderid`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb3;

-- ----------------------------
-- Table structure for products
-- ----------------------------
DROP TABLE IF EXISTS `products`;
CREATE TABLE `products` (
  `proid` int NOT NULL AUTO_INCREMENT COMMENT '商品id',
  `name` varchar(100) NOT NULL COMMENT '商品名称',
  `detail` text COMMENT '商品详情',
  `price` decimal(20,2) NOT NULL COMMENT '价格,单位-元保留两位小数',
  `stock` int NOT NULL COMMENT '库存数量',
  `status` int DEFAULT '2' COMMENT '商品状态.1-在售 2-下架 3-删除',
  `created_time` datetime DEFAULT NULL COMMENT '创建时间',
  `updated_time` datetime DEFAULT NULL COMMENT '更新时间',
  PRIMARY KEY (`proid`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb3;

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `userid` int NOT NULL AUTO_INCREMENT COMMENT '用户表id',
  `email` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '邮箱',
  `password` varchar(300) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '用户密码，MD5加密',
  `created_time` datetime NOT NULL COMMENT '创建时间',
  `updated_time` datetime NOT NULL COMMENT '更新时间',
  PRIMARY KEY (`userid`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb3;

SET FOREIGN_KEY_CHECKS = 1;
