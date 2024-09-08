export type TaskBaseType = {
  commandName: string;
  executionTime: string;
  args: any;
  status: TaskStatus;
  description?: string;
};

export type TaskStatus = 'pending' | 'success' | 'failed';

export type TaskType = TaskBaseType & { id: string };

export type TaskCreateDto = TaskBaseType;
