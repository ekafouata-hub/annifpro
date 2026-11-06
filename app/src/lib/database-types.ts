export type MessageTemplate = {
  id: string;
  type: "birth" | "marriage";
  title: string;
  content: string;
  is_default: boolean;
};