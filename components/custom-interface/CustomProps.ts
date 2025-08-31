// Post
export interface PostProps {
  id: string;
  content: string;
  uid: string;
  email: string;
  mood: string;
  isAnonymouse: boolean;
  profileName: string;
  onClose: () => void;
}

// Journal

export interface IJournalData {
  uid: string,
  content: string,
  createAt: string,
  mood: string
}

export interface IJournalDataResponse {
  id: string,
  content: string,
  createAt: string,
  mood: string,
  uid:string
}

export interface IJournalPostData {
  id?: string,
  content: string,
  createAt: string,
  mood: string
  onDelete: (id:string) => void
}

// Task

type TPriority = 'low' | 'medium' | 'high';

interface ISubtask {
    completed: boolean;
    text: string;
}

interface ISubtasksMap {
    [key: string]: ISubtask;
}


export interface ITask {
    id: string,
    uid: string,
    content: string,
    aiSuggestion: string,
    completed: boolean,
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

export interface DailyMood {
  uid: string, 
  mood: string, 
  aboutToday:string, 
  date:string
}