import { Agency } from "@prisma/client";
import { AiOutlineAccountBook } from "react-icons/ai";
import { useSelector } from "react-redux";

interface StepProps {
  title: string;
  description: string;
  stepNumber: number;
  icon?: React.ReactNode;
  ribbonColor?: string;

}

export const Step = (props: StepProps) => {
  const {
    title,
    description,
    stepNumber,

    icon = <AiOutlineAccountBook className="w-8 h-8" />,
  } = props;

  const agency: Agency = useSelector((state: any) => state.agency);

  return (
    <div className="content-center lg:flex lg:justify-center lg:items-center">
      <div className="flex justify-center pt-10 m-auto lg:mx-6">
        <div className="relative w-72 h-48">
          <div
            className={`absolute top-0 left-0 flex items-center w-72 h-40 mt-6 ml-6 border-2 border-gray-700 border-solid rounded-lg`}
          >
            <div className="w-1/3 h-40"></div>
            <div className="w-2/3 h-32 pr-4">
              <h3 className="themeTransition text-lg leading-6 font-semibold text-white">
                {title}
              </h3>
              <p className="pt-1 text-sm text-gray-100">{description}</p>
            </div>
          </div>
          
          <div
            className={`absolute top-0 left-0 z-10 w-24 h-40 flex flex-col justify-center items-center text-5xl font-bold text-center text-white bg-primary rounded-lg`}
            style={{
              background: `linear-gradient(45deg, ${agency.primaryColor} , ${agency.secondaryColor})`,
            }}     
          >
            <div className={` flex justify-center mx-auto items-center z-20 w-12 h-12 bg-white rounded-full`} style={{color: agency.primaryColor as string}}>
            {icon}
          </div>
            {stepNumber < 10 ? `0${stepNumber}` : stepNumber}
          </div>
        </div>
      </div>
    </div>
  );
};
