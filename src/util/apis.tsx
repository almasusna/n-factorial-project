const BASE_URL = "https://api.myfinancetracker.online/api/v1";
export const fetchTransactions = async (params = {}) => {
  const default_params = {
    skip: 0,
    limit: 40,
    sort_by: "date",
    sort_order: "desc",
    start_date: "",
    end_date: "",
    category: "",
    min_amount: 0,
    max_amount: 0,
    search: "",
  };

  const final_params = { ...default_params, ...params };

  const token = localStorage.getItem("token");
  const url = new URL(`${BASE_URL}/transactions/`);
  url.searchParams.append("skip", final_params.skip.toString());
  url.searchParams.append("limit", final_params.limit.toString());
  url.searchParams.append("sort_by", final_params.sort_by);
  url.searchParams.append("sort_order", final_params.sort_order);
  //   url.searchParams.append("start_date", params.start_date);
  //   url.searchParams.append("end_date", params.end_date);
  url.searchParams.append("category", final_params.category);
  url.searchParams.append("search", final_params.search);

  const response = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.json();
};
