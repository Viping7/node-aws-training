type GeoLocations = {
  lat: string;
  lng: string;
};
type Address = {
  street: string;
  suite: string;
  city: string;
  zipcode: string;
  geo: GeoLocations;
};

type Company = {
  name: string;
  catchPhrase: string;
  bs: string;
};
export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  address: Address;
  phone: string;
  website: string;
  company: Company;
}

export interface Todo {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}
