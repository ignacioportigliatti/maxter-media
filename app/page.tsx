import { UserLogin } from "@/components/home/UserLogin";

export default function Home() {
  return (
    <div className="flex justify-start items-center mx-auto p-7 max-h-screen h-screen overflow-hidden bg-medium-gray">
        <UserLogin />
    </div>
  );
}
