export interface Student {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: "MALE" | "FEMALE";
  dateOfBirth: string;
  roleIds?: number[];
  courseIds?: number[];
  groupIds?: number[];
  cardId?: string;
  status: "active" | "inactive";
  createdDate: string;
  createdBy: {
    id: string | number;
    name: string;
  }
}