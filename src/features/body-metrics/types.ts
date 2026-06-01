export type BodyMetricEntry = {
  id: string;
  weight?: number;
  height?: number;
  shoulders?: number;
  chest?: number;
  waist?: number;
  hip?: number;
  left_arm?: number;
  right_arm?: number;
  left_forearm?: number;
  right_forearm?: number;
  left_quadriceps?: number;
  right_quadriceps?: number;
  left_calf?: number;
  right_calf?: number;
};

export type CreateBodyMetricEntry = Omit<BodyMetricEntry, "id">;
