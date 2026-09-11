type ImageProps = {
  src: string;
}

function Image({ src }: ImageProps): JSX.Element {
  return (
    <div className="offer__image-wrapper">
      <img className="offer__image" src={src} alt="Place" />
    </div>
  );
}

export default Image;
