import { createContext } from "react";
import { PropTypes } from "prop-types";
import { getExpenses } from "../../api";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const ExpenseContext = createContext();

const ExpenseProvider = ({ children }) => {
  const queryClient = useQueryClient();
  const cachedExpenses = queryClient.getQueryData(["Expenses"]);

  const { data: expenses } = useQuery({
    queryKey: ["Expenses"],
    queryFn: getExpenses,
    staleTime: 600000,
    refetchOnWindowFocus: false,
    retry: false,
    enabled: !cachedExpenses,
    initialData: cachedExpenses,
  });

  return (
    <ExpenseContext.Provider value={{ expenses }}>
      {children}
    </ExpenseContext.Provider>
  );
};

ExpenseProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { ExpenseContext, ExpenseProvider };

/**
 * Make it so we get settings here and not have to have a useEffect in expensetracker component
 */