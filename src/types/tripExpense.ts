export interface TripExpense {
  id: number;
  tripId: number;
  tripCode: string;
  expenseType: string;
  amount: number;
  description: string;
  createdAt: string;
}