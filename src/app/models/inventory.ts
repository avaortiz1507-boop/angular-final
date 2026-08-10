export interface InventoryData {
  color?: string;
  price?: number | string;
  year?: number | string;
  category?: string;
  quantity?: number;
  [key: string]: unknown;
}

export interface InventoryItem {
  id: string;
  name: string;
  data: InventoryData | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface InventoryPayload {
  name: string;
  data: InventoryData;
}
