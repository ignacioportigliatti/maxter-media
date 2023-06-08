import { VideoGrid } from "@/components/my-videos/VideoGrid";

export default function MyVideosPage() {
  return (
    <div className="w-full">
      <div>
        <div className="dark:bg-dark-gray themeTransition bg-gray-200 py-[26px] px-7 text-black dark:text-white drop-shadow-sm">
          <h2>Mis Videos</h2>
        </div>
      </div>
      <div className="py-14 px-7">
        <VideoGrid />
      </div>
    </div>
  );
}
