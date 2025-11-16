

export interface FormErrors {
  name?: string;
  phone?: string;
  title?: string;
  image?: string;
  submit?: string;
}

export interface RequestTableProps {
  searchQuery?: string;
  sortOrder?: 'asc' | 'desc';
  currentPage?: number;
  itemsPerPage?: number;
}


export interface Request {
  _id?: string;
  id?: string;
  name: string;
  phone: string;
  title: string;
  image?: string;
  timestamp: string;
}
