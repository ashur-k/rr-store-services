export interface ManagedUser {
  id: number;
  kc_id: string;
  email: string;
}

export interface UserResponse {
  id: number;
  kc_id: string;
  email: string;
}

export interface StoreWithOwner {
  store_id: string;
  store_name: string;
  store_description: string | null;
  store_user_id: number;
  store_user_kc_id: string;
  store_user_full_name: string;
  store_user_username: string;
  store_user_email: string;
}