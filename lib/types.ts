

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


export interface IRequest {
  _id?: string;
  id?: string;
  name: string;
  phone: string;
  title: string;
  image?: string;
  timestamp: string;
}

