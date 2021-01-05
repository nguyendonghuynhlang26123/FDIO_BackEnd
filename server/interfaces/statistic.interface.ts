export class StatisticDetailInterface {
  food_name: string;
  quantity_sold: number;
  money: number;
}

export class StatisticInterface {
  details: StatisticDetailInterface[];
  total_orders: number;
  total_money: number;
}
