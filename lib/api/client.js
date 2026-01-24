import axios from "axios";

export async function apiPost(url, body = {}) {
  try {
    const res = await axios.post(url, body, {
      headers: {
        "Content-Type": "application/json"
      },
      withCredentials: true
    });

    return res.data;
  } catch (error) {
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    }

    throw new Error("Something went wrong");
  }
}
