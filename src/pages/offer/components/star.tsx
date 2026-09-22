import { Fragment } from 'react';
import type { StarProps } from '../../../types/components';

function Star({ rating, title, onChange }: StarProps): JSX.Element {
  return (
    <Fragment>
      <input className="form__rating-input visually-hidden" name="rating" value={rating} id={`${rating}-stars`} type="radio" onChange={onChange} />
      <label htmlFor={`${rating}-stars`} className="reviews__rating-label form__rating-label" title={title} >
        <svg className="form__star-image" width="37" height="33">
          <use xlinkHref="#icon-star"></use>
        </svg>
      </label>
    </Fragment>
  );
}

export default Star;
