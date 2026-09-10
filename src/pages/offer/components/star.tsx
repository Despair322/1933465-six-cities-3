import { Fragment } from 'react';

type StarProps = {
  rating: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
};

function Star({ rating, onChange }: StarProps): JSX.Element {
  return (
    <Fragment>
      <input className="form__rating-input visually-hidden" name="rating" value={rating} id={`${rating}-stars`} type="radio" onChange={onChange} />
      <label htmlFor={`${rating}-stars`} className="reviews__rating-label form__rating-label" title="good" >
        <svg className="form__star-image" width="37" height="33">
          <use xlinkHref="#icon-star"></use>
        </svg>
      </label>
    </Fragment>
  );
}

export default Star;
