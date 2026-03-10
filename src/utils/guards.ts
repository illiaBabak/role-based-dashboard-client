import { AuthResponse, CreatedUser, UsersResponse } from "src/types";

export const isNumber = (value: unknown): value is number =>
  typeof value === "number";

export const isString = (value: unknown): value is string =>
  typeof value === "string";

export const isBoolean = (value: unknown): value is boolean =>
  typeof value === "boolean";

export const isObject = (data: unknown): data is object =>
  typeof data === "object" && data !== null;

export const isAuthResponse = (value: unknown): value is AuthResponse =>
  typeof value === "object" &&
  value !== null &&
  "data" in value &&
  "error" in value &&
  isObject(value.data) &&
  "user" in value.data &&
  isObject(value.data.user) &&
  "id" in value.data.user &&
  "login" in value.data.user &&
  "name" in value.data.user &&
  "role" in value.data.user &&
  isNumber(value.data.user.id) &&
  isString(value.data.user.login) &&
  isString(value.data.user.name) &&
  isString(value.data.user.role);

export const isCreatedUser = (value: unknown): value is CreatedUser =>
  typeof value === "object" &&
  value !== null &&
  "id" in value &&
  "login" in value &&
  "name" in value &&
  "role" in value &&
  isNumber(value.id) &&
  isString(value.login) &&
  isString(value.name) &&
  isString(value.role);

export const isUsersResponse = (value: unknown): value is UsersResponse =>
  typeof value === "object" &&
  value !== null &&
  "data" in value &&
  "error" in value &&
  isObject(value.data) &&
  "users" in value.data &&
  Array.isArray(value.data.users) &&
  value.data.users.every(isCreatedUser);
