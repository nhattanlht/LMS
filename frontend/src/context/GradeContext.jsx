import { createContext, useContext, useState } from "react";
import axios from "axios";
import { server } from "../main";
import toast from "react-hot-toast";

const GradeContext = createContext();

export const GradeContextProvider = ({ children }) => {
  const [grades, setGrades] = useState([]);

  const createGrade = async (gradeData) => {
    try {
      const { data } = await axios.post(`${server}/api/grades`, gradeData, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });
      toast.success(data.message);
      setGrades([...grades, data.data]);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <GradeContext.Provider
      value={{
        grades,
        createGrade,
      }}
    >
      {children}
    </GradeContext.Provider>
  );
};

export const GradeData = () => useContext(GradeContext);