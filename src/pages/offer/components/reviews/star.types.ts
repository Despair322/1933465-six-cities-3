export type StarProps = {
  rating: number;
  title: string;
  checked?: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
};
