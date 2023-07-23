import { UserLogin } from "@/components/home/UserLogin";
import store from "@/redux/clientStore";
import { Provider } from "react-redux";

export default function Home() {
  return (
    <div className="flex flex-col justify-start items-center mx-auto p-7 h-screen bg-medium-gray">
        <UserLogin />
    </div>
  );
}
