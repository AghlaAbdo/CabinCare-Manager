export class CabinSummaryDto {
  id: string;
  name: string;
  location: string;
  description?: string;
  pendingHighPriority: number;
  pendingMediumPriority: number;
  pendingLowPriority: number;
  totalPendingTasks: number;
}
