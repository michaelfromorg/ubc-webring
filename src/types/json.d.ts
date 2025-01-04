declare module "*.json" {
  const value: {
    websites: {
      name: string;
      year: number;
      website: string;
    }[];
  };
  export default value;
}
