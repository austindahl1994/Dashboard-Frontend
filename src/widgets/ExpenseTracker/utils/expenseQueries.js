import { queryOptions } from "@tanstack/react-query";
import { getExpenses, getSettings, updateSettings, saveExpenses } from "../../../api";
import { convertForFrontendSettings } from "../dataConversion";

const MINUTE = 1000 * 60;

export const getAllExpensesQuery = () => {
  return queryOptions({
    queryKey: ["expenses"],
    queryFn: getExpenses,
    staleTime: 60 * MINUTE,
    gcTime: 30 * MINUTE,
  });
};

export const getExpenseSettings = () => {
  return queryOptions({
    queryKey: ["expenseSettings"],
    queryFn: () => getSettings("Expenses"),
    retry: false
    // staleTime: 60 * MINUTE,
    // gcTime: 30 * MINUTE,
  });
};

export const mutateExpenseSettings = (queryClient) => ({
  mutationFn: updateSettings,
  onSuccess: (data, variables) => {
    // console.log(`Settings updated for expenses, returned: ${JSON.stringify(data)}`);
    // console.log(`Compared to variable settings: ${variables.settings})}`)
    const frontendFriendlySettings = convertForFrontendSettings(variables.settings)
    queryClient.setQueryData(["ExpenseSettings"], frontendFriendlySettings);
  },
  onError: (error) => {
    console.error(`Error updating expense settings: ${error}`);
  },
});

export const mutateExpenseData = (queryClient) = > ({
  mutationFn: saveExpenses,
  onSuccess: (variables) => {
    queryClient.setQueryData(["Expenses", variables.year + variables.month], variables.data)
  }
})
