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
  mood: string
}

export interface IJournalPostData {
  id: string,
  content: string,
  createAt: string,
  mood: string
  onDelete: () => void,
  moreOption: () => void
}
