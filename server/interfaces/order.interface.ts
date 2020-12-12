export class OrderInterface {
  _id?: string;
  table_id: number;
  time_order: number;
  manager: string; // User id
  list_order_item: {
    food: string; // Food id
    quantity: number;
    status: 'waiting' | 'processing' | 'deny' | 'completed';
  }[];
  discount: string; // Promotion id
  note: string;
  created_at: number;
}
