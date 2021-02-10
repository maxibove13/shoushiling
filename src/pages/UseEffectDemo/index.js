// Dependencies
import { useState, useEffect } from "react";

//Components
//import { Button } from "../../components";

// Assets
import "./styles.scss";

const UseEffectDemo = () => {
  //   console.log("Render");

  useEffect(() => {
    const fetchEvents = async () => {
      const res = await fetch("http://localhost:5000/users/Sarah");
      const { events } = await res.json();
      console.log(events);
    };

    fetchEvents();
  }, []);

  return (
    <div>
      <div>
        <h3>Hello World</h3>
      </div>
    </div>
  );
};

export default UseEffectDemo;
