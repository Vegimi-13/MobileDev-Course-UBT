export type Trip = {
  id: string;
  image: string;
  host: string;
  title: string;
  location?: string;
  date?: string;
  tags?: string[];
  likes?: number;
  joined?: string;
  spotsLeft?: number;
};
