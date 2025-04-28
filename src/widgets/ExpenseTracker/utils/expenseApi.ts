import { useQuery } from "@tanstack/react-query";
import {
  getSettings,
  updateSettings,
  getExpenses,
  updateExpenses,
} from "../../../api";
import { AxiosResponse } from "axios";
//Get or update widget settings
const updateExpense = async () => {};

const getAllExpenses = async (): Promise<any> => {
  const response = await getExpenses() as AxiosResponse<{data: string}>;
  console.log(response);
  return response;
};

export { updateExpense, getAllExpenses };
