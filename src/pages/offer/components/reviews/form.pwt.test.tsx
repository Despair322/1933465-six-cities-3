import { test, expect } from '@playwright/experimental-ct-react';
import { APIRoute, RequestStatus } from '../../../../constants';
import { makeFakeDetailedOffer } from '../../../../mocks';
import Form from './form';

test.describe('Review Form', () => {
  test('enables submit only when a rating and valid review are provided', async ({ mount }) => {
    const form = await mount(<Form />, {
      hooksConfig: {
        initialState: {
          detailedOffer: {
            detailedOffer: makeFakeDetailedOffer(),
            nearbyOffers: [],
            reviews: [],
            loadingStatus: {
              detailedOffer: RequestStatus.Idle,
              nearbyOffers: RequestStatus.Idle,
              reviews: RequestStatus.Idle,
            },
          },
        },
      },
    });
    const submit = form.getByRole('button', { name: 'Submit' });
    const textarea = form.getByRole('textbox', { name: 'Your review' });

    await expect(submit).toBeDisabled();
    await textarea.fill('A'.repeat(50));
    await expect(submit).toBeDisabled();
    await form.getByTitle('perfect').click();
    await expect(submit).toBeEnabled();
    await textarea.fill('A'.repeat(301));
    await expect(submit).toBeDisabled();
  });

  test('submits a review and clears the form after success', async ({ mount, page }) => {
    const comment = 'This was a wonderful stay with everything we needed.';
    let submittedReview: unknown;
    await page.route(`**${APIRoute.Reviews('offer-1')}`, async (route) => {
      if (route.request().method() === 'POST') {
        submittedReview = route.request().postDataJSON();
        await route.fulfill({ status: 201, contentType: 'application/json', body: '{}' });
        return;
      }
      await route.fulfill({ status: 200, contentType: 'application/json', body: '[]' });
    });

    const form = await mount(<Form />, {
      hooksConfig: {
        initialState: {
          detailedOffer: {
            detailedOffer: makeFakeDetailedOffer(),
            nearbyOffers: [],
            reviews: [],
            loadingStatus: {
              detailedOffer: RequestStatus.Idle,
              nearbyOffers: RequestStatus.Idle,
              reviews: RequestStatus.Idle,
            },
          },
        },
      },
    });

    await form.getByTitle('perfect').click();
    await form.getByRole('textbox', { name: 'Your review' }).fill(comment);
    await form.getByRole('button', { name: 'Submit' }).click();

    await expect.poll(() => submittedReview).toEqual({ comment, rating: 5 });
    await expect(form.getByRole('textbox', { name: 'Your review' })).toHaveValue('');
    await expect(form.locator('input[name="rating"]:checked')).toHaveCount(0);
  });
});
