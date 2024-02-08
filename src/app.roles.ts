import { RolesBuilder } from 'nest-access-control';

export enum AppRoles {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export enum AppResources {
  users = 'users',
  imagenes = 'imagenes',
  menu = 'menu',
  categories = 'categories',
  testimonies = 'testimonies',
}

export const roles: RolesBuilder = new RolesBuilder();

roles
  .grant(AppRoles.USER)
  .createOwn(AppResources.users)
  .readOwn(AppResources.users)
  .updateOwn(AppResources.users)
  .deleteOwn(AppResources.users)
  .createOwn(AppResources.imagenes)
  .readOwn(AppResources.imagenes)
  .deleteOwn(AppResources.imagenes)
  .readOwn(AppResources.menu)
  .readOwn(AppResources.categories)
  .readOwn(AppResources.testimonies)
  .grant(AppRoles.ADMIN)
  .extend(AppRoles.USER)
  .createAny(AppResources.users)
  .readAny(AppResources.users)
  .updateAny(AppResources.users)
  .deleteAny(AppResources.users)
  .createAny(AppResources.imagenes)
  .readAny(AppResources.imagenes)
  .deleteAny(AppResources.imagenes)
  .createAny(AppResources.menu)
  .readAny(AppResources.menu)
  .updateAny(AppResources.menu)
  .deleteAny(AppResources.menu)
  .createAny(AppResources.categories)
  .readAny(AppResources.categories)
  .updateAny(AppResources.categories)
  .deleteAny(AppResources.categories)
  .createAny(AppResources.testimonies)
  .readAny(AppResources.testimonies)
  .updateAny(AppResources.testimonies)
  .deleteAny(AppResources.testimonies);
