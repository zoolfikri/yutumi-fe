import axios from "axios";

const sendLog = (params = {}) => {
  return axios({
    method: "post",
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    url: "log",
    data: params,
  });
};

export { sendLog };
