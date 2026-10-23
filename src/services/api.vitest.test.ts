import MockAdapter from 'axios-mock-adapter';
import { StatusCodes } from 'http-status-codes';
import { createAPI, showErrorToast, saveToken } from './';

vi.mock('./notification', () => ({
  showErrorToast: vi.fn(),
}));

describe('createAPI', () => {
  let api: ReturnType<typeof createAPI>;
  let mockApi: MockAdapter;

  beforeEach(() => {
    localStorage.clear();
    api = createAPI();
    mockApi = new MockAdapter(api);
    vi.clearAllMocks();
  });

  afterEach(() => {
    mockApi.restore();
    localStorage.clear();
  });

  it('should add the x-token header when a token is stored', async () => {
    saveToken('test-token');
    mockApi.onGet('/offers').reply(StatusCodes.OK, { success: true });

    await api.get('/offers');

    expect(mockApi.history.get).toHaveLength(1);
    const request = mockApi.history.get[0];

    expect(request).toBeDefined();
    expect(request?.headers?.['x-token']).toBe('test-token');
  });

  it('should show the unauthorized message for 401 responses', async () => {
    mockApi.onGet('/login').reply(StatusCodes.UNAUTHORIZED, {
      type: 'error',
      message: 'Unauthorized',
    });

    await expect(api.get('/login')).rejects.toMatchObject({
      response: { status: StatusCodes.UNAUTHORIZED },
    });

    expect(showErrorToast).toHaveBeenCalledWith('Unauthorized access. Please log in.');
  });

  it('should show the API validation message for 400 responses', async () => {
    const message = 'Validation failed';
    mockApi.onGet('/offers').reply(StatusCodes.BAD_REQUEST, {
      type: 'error',
      message,
    });

    await expect(api.get('/offers')).rejects.toMatchObject({
      response: { status: StatusCodes.BAD_REQUEST },
    });

    expect(showErrorToast).toHaveBeenCalledWith(message);
  });

  it('should not show a toast when the error is handled locally', async () => {
    mockApi.onGet('/offers').reply(StatusCodes.UNAUTHORIZED, {
      type: 'error',
      message: 'Unauthorized',
    });

    await expect(api.get('/offers', { localErrorStatuses: [StatusCodes.UNAUTHORIZED] } as never)).rejects.toMatchObject({
      response: { status: StatusCodes.UNAUTHORIZED },
    });

    expect(showErrorToast).not.toHaveBeenCalled();
  });
});
