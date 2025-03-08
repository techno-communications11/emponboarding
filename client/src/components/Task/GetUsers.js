const GetUsers = async () => {
  try {
    const response = await fetch(`${process.env.REACT_APP_BASE_URL}/getusers`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
     console.log(data.data,'datataa');
     const result=data.data
    return result;
  } catch (err) {
    console.log(err);
  }
};

export default GetUsers;
