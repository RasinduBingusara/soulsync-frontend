export type TPriority = 'low' | 'medium' | 'high';

interface ISubtask {
    completed: boolean;
    text: string;
}

interface ISubtasksMap {
    [key: string]: ISubtask;
}

export interface ITask {
    id: string,
    content: string,
    priority: TPriority,
    subtasks: ISubtasksMap,
    title: string,
    dateTime: string
}

export interface TaskProps {
  task: ITask,
  onEdit: () => void,
  onRemoveTask: (id: string) => void
}