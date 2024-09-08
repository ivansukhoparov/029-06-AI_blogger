export type ContentPlanParamsType = {
  startDate: string;
  timeframe: string;
  frequency: string;
};

export type UpdatePostContentCommandParamType = {
  postId: string;
  platform: string;
};

export type PublicationPostCommandType = {
  postId: string;
  platform: string;
  target: number | string;
};

export const contentPlanParams: ContentPlanParamsType = {
  startDate: '2024-09-01',
  timeframe: 'week',
  frequency: 'daily',
};
export const FREQUENCIES = {
  daily: 1,
};
export const TIMEFRAMES = {
  week: 7,
  month: 28,
};
