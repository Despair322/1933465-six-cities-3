import { useState } from 'react';
import Star from './star';
import type { FormData } from '../../../types/form';

const rating = [
  { value: 5, title: 'perfect' },
  { value: 4, title: 'good' },
  { value: 3, title: 'not bad' },
  { value: 2, title: 'badly' },
  { value: 1, title: 'terribly' },
];

function Form(): JSX.Element | null {
  const [formData, setFormData] = useState<FormData>({
    rating: '',
    review: '',
  });

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  return (
    <form className="reviews__form form" action="#" method="post" onSubmit={handleSubmit}>
      <label className="reviews__label form__label" htmlFor="review">Your review</label>
      <div className="reviews__rating-form form__rating">
        {rating.map(({ value, title }) =>
          <Star key={value} rating={value} title={title} onChange={handleInputChange} />
        )}
      </div>
      <textarea className="reviews__textarea form__textarea" id="review" name="review" placeholder="Tell how was your stay, what you like and what can be improved" value={formData.review} onChange={handleInputChange}></textarea>
      <div className="reviews__button-wrapper">
        <p className="reviews__help">
          To submit review please make sure to set <span className="reviews__star">rating</span> and describe your stay with at least <b className="reviews__text-amount">50 characters</b>.
        </p>
        <button className="reviews__submit form__submit button" type="submit"
          disabled={formData.rating.length === 0 || formData.review.length < 50}
        >
          Submit
        </button>
      </div>
    </form>
  );
}

export default Form;
