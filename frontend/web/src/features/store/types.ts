export interface StoresState {
  stores: Store[];
  selectedStoreId: string | null;
}

export interface Store {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  status: string;
}
