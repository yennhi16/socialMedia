import ReactPlayer from "react-player";

type ShowVideoProps = {
  url: string;
};
const ShowVideo = ({ url }: ShowVideoProps) => {
  return (
    <div>
      <ReactPlayer controls={true} url={url} />
    </div>
  );
};

export default ShowVideo;
