"use client";
import { useAppContext } from "@/context/AppContext";
import CoverHF from "./CoverHF";
import Theme from "./Theme";

export default function NavBar(): JSX.Element {
  const { state, setState } = useAppContext();
  console.log("state in nav", state);
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target) {
      console.error("Event target is undefined");
      return;
    }

    const { name, value } = event.target;
    setState((prevState: any) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <div className="navbar bg-gray-100">
      <a className="btn btn-ghost text-xl">Cv Builder</a>
      <Theme />
      <CoverHF onChange={handleInputChange} />
    </div>
  );
}
