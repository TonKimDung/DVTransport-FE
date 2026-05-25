import axios from "axios";

const SEM_API = "http://localhost:8000";

export const semService = {
  analyze: async () => {
    const res = await axios.get(`${SEM_API}/sem/analyze`);
    return res.data;
  },
};