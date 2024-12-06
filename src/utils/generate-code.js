import axios from "axios";
import ls from "localstorage-slim";

const generateCode = async (category) => {
  const localstorage = ls.get(
    `${process.env.NEXT_PUBLIC_LOCALSTORAGE_KEY}user_data`,
    {
      decrypt: true,
    }
  );
  // Get the access token from the redux state
  const user_data = localstorage;

  try {
    const {
      data: { code, data },
    } = await axios({
      method: "POST",
      baseURL: process.env.NEXT_PUBLIC_API_URL,
      url: `generate-code/create?category=${category}`,
      headers: {
        Authorization: `Bearer ${user_data.access_token}`,
      },
    });
    if (code !== 201) return null;
    return data;
  } catch (error) {
    return null;
  }
};

export default generateCode;
