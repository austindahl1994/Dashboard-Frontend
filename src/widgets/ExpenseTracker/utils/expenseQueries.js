import { queryOptions } from "@tanstack/react-query";
import { getSettings, updateSettings, saveExpenses } from "../../../api";
import { convertForFrontendSettings } from "../dataConversion";

export const getExpenseSettings = () => {
  return queryOptions({
    queryKey: ["ExpenseSettings"],
    queryFn: () => getSettings("Expenses"),
    retry: false,
    // staleTime: 60 * MINUTE,
    // gcTime: 30 * MINUTE,
  });
};

export const mutateExpenseSettings = (queryClient) => ({
  mutationFn: updateSettings,
  onSuccess: (data, variables) => {
    // console.log(`Settings updated for expenses, returned: ${JSON.stringify(data)}`);
    // console.log(`Compared to variable settings: ${variables.settings})}`)
    const frontendFriendlySettings = convertForFrontendSettings(
      variables.settings
    );
    queryClient.setQueryData(["ExpenseSettings"], frontendFriendlySettings);
  },
  onError: (error) => {
    console.error(`Error updating expense settings: ${error}`);
  },
});

export const mutateExpenseData = (queryClient) => ({
  mutationFn: saveExpenses,
  onSuccess: (_, variables) => {
    let finalArr = [];
    const cachedExpenses = queryClient.getQueryData(["Expenses"]) || [];
    console.log(cachedExpenses);
    const toBeCached = {
      month: variables.month,
      year: JSON.parse(variables.year),
      data: JSON.parse(variables.data),
    };
    console.log(variables.month);
    if (cachedExpenses.length > 0) {
      finalArr = cachedExpenses.filter((dataSet) => {
        return !(
          dataSet.month === toBeCached.month && dataSet.year === toBeCached.year
        );
      });
    }
    finalArr.push(toBeCached);
    console.log(toBeCached);
    queryClient.setQueryData(["Expenses"], finalArr);
  },
});