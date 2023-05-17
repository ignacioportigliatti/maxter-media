interface Props {
  title: string;
  agency: string;
  duration: string;
  uploadedAt: string;
}

export const VideoCard = (props: Props) => {
  const { title, agency, duration, uploadedAt } = props;

  return (
    <div>
      <div className="col-span-12 sm:col-span-6 md:col-span-3">
        <div className="w-full flex flex-col">
          <div className="relative">
            <a href="#">
              <img
                src="https://picsum.photos/seed/59/300/200"
                className="w-96 h-auto"
              />
            </a>

            <p className="absolute right-2 bottom-2 text-gray-100 text-xs px-1 py">
              {duration}
            </p>
          </div>

          <div className="flex flex-row mt-3 gap-2">
            <a href="#">
              <img
                src="/agency/astros-logo.png"
                className="rounded-full max-h-10 max-w-10 mr-2"
              />
            </a>

            <div className="flex flex-col">
              <a href="#">
                <p className="dark:text-gray-100 text-dark-gray text-sm font-semibold hover:text-orange-500">{title}</p>
              </a>
              <p className="text-gray-400 text-xs">
                {" "}
                {agency}{" "}
              </p>
              <p className="text-gray-400 text-xs">{uploadedAt}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
