import express, { Router } from 'express';
import { AuthenticatedUser, Login, Logout, Register, UpdateInfo, UpdatePassword } from './controller/auth-controller';
import { UploadImage } from './controller/image-controller';
import { ExportOrder, GetAllOrders, OrderByDate } from './controller/order-controller';
import { GetPermissions } from './controller/permission-controller';
import { CreateProducts, DeleteProduct, GetAllProducts, GetProductById, UpdateProduct } from './controller/product-controller';
import { CreateRole, DeleteRole, GetAllRoles, GetRoleById, UpdateRole } from './controller/role-controller';
import { CreateUser, DeleteUser, GetAll, GetUserById, UpdateUser } from './controller/user-controller';
import { AuthMiddleware } from './middleware/auth-middleware';
import { PermissionMiddleware } from './middleware/permission-middleware';

export const routes = (router: Router) => {
  //auth routes
  router.post('/api/register', Register);
  router.post('/api/login', Login);
  router.get('/api/user', AuthMiddleware, AuthenticatedUser);
  router.post('/api/logout', AuthMiddleware, Logout);
  router.put('/api/user/info', AuthMiddleware, UpdateInfo);
  router.put('/api/user/password', AuthMiddleware, UpdatePassword);

  //user routes
  router.get('/api/users', AuthMiddleware, PermissionMiddleware('users'), GetAll);
  router.post('/api/users', AuthMiddleware, PermissionMiddleware('users'), CreateUser);
  router.get('/api/users/:id', AuthMiddleware, PermissionMiddleware('users'), GetUserById);
  router.put('/api/users/:id', AuthMiddleware, PermissionMiddleware('users'), UpdateUser);
  router.delete('/api/users/:id', AuthMiddleware, PermissionMiddleware('users'), DeleteUser);

  //permissions routes
  router.get('/api/permission', AuthMiddleware, GetPermissions);

  //role routes
  router.get('/api/role', AuthMiddleware, PermissionMiddleware('roles'), GetAllRoles);
  router.get('/api/role/:id', AuthMiddleware, PermissionMiddleware('roles'), GetRoleById);
  router.post('/api/role', AuthMiddleware, PermissionMiddleware('roles'), CreateRole);
  router.put('/api/role/:id', AuthMiddleware, PermissionMiddleware('roles'), UpdateRole);
  router.delete('/api/role/:id', AuthMiddleware, PermissionMiddleware('roles'), DeleteRole);

  //product routes
  router.get('/api/product', AuthMiddleware, PermissionMiddleware('products'), GetAllProducts);
  router.get('/api/product/:id', AuthMiddleware, PermissionMiddleware('products'), GetProductById);
  router.post('/api/product', AuthMiddleware, PermissionMiddleware('products'), CreateProducts);
  router.put('/api/product/:id', AuthMiddleware, PermissionMiddleware('products'), UpdateProduct);
  router.delete('/api/product/:id', AuthMiddleware, PermissionMiddleware('products'), DeleteProduct);

  //order routes
  router.get('/api/order', AuthMiddleware, PermissionMiddleware('orders'), GetAllOrders);
  router.post('/api/order/export', AuthMiddleware, PermissionMiddleware('orders'),  ExportOrder);
  router.get('/api/order/date', AuthMiddleware, PermissionMiddleware('orders'),  OrderByDate);

  //image routes
  router.post('/api/image/upload', AuthMiddleware, UploadImage);

  //static routes
  router.get('/api/uploads', express.static('./uploads'));
}