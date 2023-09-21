import { UserLogin } from "@/components/home/UserLogin";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Home() {
  return (
    <div className="flex justify-start items-center mx-auto p-7 max-h-screen h-screen overflow-hidden bg-medium-gray">
      <ToastContainer />
        <UserLogin />
    </div>
  );
}
