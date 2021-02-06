// Dependencies
import { useState, useEffect } from "react";

//Components
import { Button } from "../../components";

// Assets
import "./styles.scss";

const Login = () => {
  const [userData, setUserData] = useState([]);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch("http://localhost:5000/users", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const users = await res.json();
      const name = users[0].name;
      console.log(name);
      setUserData(name);
    };

    fetchUser();
  }, []);

  return (
    <div>
      <h2>Shoushiling</h2>
      <h3>Hello {userData}</h3>
      <Button />
    </div>
  );
};

export default Login;
