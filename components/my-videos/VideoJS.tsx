import React, { useEffect, useRef } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import '@videojs/themes/dist/sea/index.css';

type VideoJSProps = {
  options: any;
  onReady?: (player: typeof videojs.players) => void;
};

const VideoJS: React.FC<VideoJSProps> = (props) => {
  const videoRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<typeof videojs.players | null>(null);

  useEffect(() => {
    // Make sure Video.js player is only initialized once
    if (!playerRef.current) {
      // The Video.js player needs to be _inside_ the component el for React 18 Strict Mode.
      const videoElement = document.createElement("video");

      videoElement.classList.add('video-js');
      videoRef.current?.appendChild(videoElement);

      const player = playerRef.current = videojs(videoElement, props.options, () => {
        videojs.log('player is ready');
        props.onReady && props.onReady(player);
      });
    } else {
      const player = playerRef.current;
      player.vhs.options_.externHls.GOAL_BUFFER_LENGTH = 60;
      player.vhs.options_.externHls.MAX_GOAL_BUFFER_LENGTH = 80;
      player.play(props.options.autoplay);
      
    }

    return () => {
      const player = playerRef.current;

      if (player && !player.isDisposed()) {
        player.dispose();
        playerRef.current = null;
      }
    };
  }, [props.options, videoRef]);

  return (
    <div data-vjs-player className={'vjs-theme-sea'}>
      <div ref={videoRef} />
    </div>
  );
}

export default VideoJS;
