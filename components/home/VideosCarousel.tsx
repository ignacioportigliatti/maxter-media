import React from "react";
import { useSelector } from "react-redux";

type Props = {};

const VideosCarousel = (props: Props) => {
  const videos = useSelector((state: any) => state.videos);
  const photos = useSelector((state: any) => state.photos);
  const selectedGroup = useSelector((state: any) => state.group);

  return <div>VideosCarousel</div>;
};

export default VideosCarousel;
