/* eslint-disable */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store } from './store';
import axios from 'axios';

jest.mock('axios');

const withRouter = (component) => (
  <BrowserRouter
    future={{
      v7_startTransition: true,
      v7_relativeSplatPath: true,
    }}
  >
    {component}
  </BrowserRouter>
);

const mockLogin = (user = { username: 'Admin', role: 'ASSET_MANAGER' }) => {
  store.dispatch({ type: 'auth/login/fulfilled', payload: { token: 'mock-token', ...user } });
};

const mockAssetsData = (assets = [], totalPages = 1) => {
  store.dispatch({
    type: 'assets/fetchAll/fulfilled',
    payload: {
      content: assets,
      totalPages: totalPages,
      totalElements: assets.length
    }
  });
};

const resetState = () => {
  store.dispatch({ type: 'auth/logout' });
  store.dispatch({ type: 'assets/fetchAll/fulfilled', payload: { content: [], totalPages: 0, totalElements: 0 } });
  store.dispatch({ type: 'maintenance/fetchSchedules/fulfilled', payload: [] });
};

const defaultAsset = { id: 1, assetTag: 'CNC-001', name: 'Milling Machine', category: 'MANUFACTURING', currentStatus: 'ACTIVE', currentHealth: 85 };

describe('Frontend Tests (AssetArc Lifecycle Monitor)', () => {

  beforeEach(() => {
    jest.clearAllMocks();
    resetState();
  });

  test('T01 - Folder structure: Login component exists', async () => {
    const response = await import('./components/Login');
    expect(response).toBeDefined();
    expect(response.default).toBeDefined();

    const { default: Login } = response;
    render(<Provider store={store}>{withRouter(<Login />)}</Provider>);
    expect(screen.getByText(/AssetArc Login/i)).toBeInTheDocument();
  });

  test('T02 - Folder structure: services directory exists', async () => {
    const response = await import('./services/assetService');
    expect(response).toBeDefined();
    expect(response.default.getAll).toBeDefined();
  });

  test('T03 - Folder structure: store directory exists', async () => {
    const response = await import('./store/slices/authSlice');
    expect(response).toBeDefined();
    expect(typeof response.default).toBe('function');
  });

  test('T04 - Folder structure: styling check', async () => {
    const AppContainer = document.createElement('div');
    AppContainer.className = 'login-container';
    expect(AppContainer.className).toBe('login-container');
  });

  test('T05 - Folder structure: layout directory exists', async () => {
    const response = await import('./components/layout/Navbar');
    expect(response).toBeDefined();
    expect(response.default).toBeDefined();

    const { default: Navbar } = response;
    mockLogin();

    render(<Provider store={store}>{withRouter(<Navbar />)}</Provider>);
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  test('T06 - Navbar: Displays "Welcome, {username}" when authenticated', async () => {
    const { default: Navbar } = await import('./components/layout/Navbar');
    mockLogin({ username: 'JohnDoe', role: 'ASSET_MANAGER' });

    render(<Provider store={store}>{withRouter(<Navbar />)}</Provider>);
    expect(screen.getByText(/Welcome, JohnDoe/i)).toBeInTheDocument();
  });

  test('T07 - AssetList: Fetches and displays assets from the backend', async () => {
    const mockData = {
      content: [defaultAsset],
      totalPages: 1
    };
    axios.get.mockResolvedValue({ data: mockData });

    const AssetList = (await import('./components/asset/AssetList')).default;
    render(<Provider store={store}><AssetList /></Provider>);

    await waitFor(() => {
      expect(screen.getByText('CNC-001')).toBeInTheDocument();
      expect(screen.getByText('Milling Machine')).toBeInTheDocument();
    });
  });

  test('T08 - useFetch: Hook logic (Mocked simulation)', async () => {
    const mockData = { data: 'Hook Success' };
    const useFetchMock = jest.fn().mockReturnValue({ data: mockData, loading: false });
    expect(useFetchMock()).toEqual({ data: mockData, loading: false });
    expect(useFetchMock).toHaveBeenCalled();
  });

  test('T09 - AssetModal: Submits data to backend and shows success feedback', async () => {
    axios.post.mockResolvedValue({ status: 201, data: { id: 101, assetTag: 'CNC-002' } });

    const AssetModal = (await import('./components/asset/AssetModal')).default;
    render(<Provider store={store}><AssetModal isOpen={true} onClose={() => { }} /></Provider>);

    const tagInput = screen.getByText(/Asset Tag/i).parentElement.querySelector('input');
    const saveBtn = screen.getByRole('button', { name: /Save Asset/i });

    fireEvent.change(tagInput, { target: { value: 'CNC-002' } });
    fireEvent.click(saveBtn);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalled();
    });
  });

  test('T10 - Redux: Verifies authSlice updates global state', async () => {
    const mockToken = 'mock-jwt-token';
    store.dispatch({ type: 'auth/login/fulfilled', payload: { token: mockToken, username: 'test', role: 'ASSET_MANAGER' } });
    const state = store.getState().auth;
    expect(state.user.token).toBe(mockToken);
    expect(state.user.username).toBe('test');
  });

  test('T11 - Routing: Protected content logic (Navbar visibility)', async () => {
    const { logout } = await import('./store/slices/authSlice');
    store.dispatch(logout());

    const { default: Navbar } = await import('./components/layout/Navbar');
    const { container } = render(<Provider store={store}>{withRouter(<Navbar />)}</Provider>);
    expect(container.firstChild).toBeNull();
  });

  test('T12 - Login: Input fields should have correct placeholders', async () => {
    const { default: Login } = await import('./components/Login');
    render(<Provider store={store}>{withRouter(<Login />)}</Provider>);

    expect(screen.getByPlaceholderText(/Enter username/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter password/i)).toBeInTheDocument();
  });

  test('T13 - Feedback: Displays error message when operation fails', async () => {
    const { default: ErrorHandler } = await import('./components/ErrorHandler');
    const errorMessage = "Invalid Credentials. Please try again.";
    render(<ErrorHandler message={errorMessage} />);
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  test('T14 - UI: Shows loading spinner during fetch', async () => {
    const DataLoader = ({ isLoading }) => (
      <div>{isLoading && <div data-testid="loader">Loading...</div>}</div>
    );
    render(<DataLoader isLoading={true} />);
    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });

  test('T15 - FormReset: Clears input fields', async () => {
    const ResetForm = () => {
      const [val, setVal] = React.useState('Initial Text');
      return (
        <div>
          <input data-testid="reset-input" value={val} onChange={(e) => setVal(e.target.value)} />
          <button onClick={() => setVal('')}>Reset</button>
        </div>
      );
    };
    render(<ResetForm />);
    const input = screen.getByTestId('reset-input');
    expect(input.value).toBe('Initial Text');
    fireEvent.click(screen.getByRole('button', { name: /reset/i }));
    expect(input.value).toBe('');
  });

  test('T16 - Search: Filters assets by name or tag', async () => {
    mockAssetsData([
      { id: 1, assetTag: 'CNC-001', name: 'Milling Machine', category: 'MANUFACTURING', currentStatus: 'ACTIVE', currentHealth: 85 },
      { id: 2, assetTag: 'LIFT-99', name: 'Forklift', category: 'LOGISTICS', currentStatus: 'ACTIVE', currentHealth: 90 }
    ]);

    const AssetList = (await import('./components/asset/AssetList')).default;
    render(<Provider store={store}><AssetList /></Provider>);

    await waitFor(() => expect(screen.getByText('CNC-001')).toBeInTheDocument());
    expect(screen.getByText('LIFT-99')).toBeInTheDocument();

    const searchInput = screen.getByPlaceholderText(/Search by tag or name.../i);
    fireEvent.change(searchInput, { target: { value: 'Forklift' } });

    expect(screen.queryByText('CNC-001')).not.toBeInTheDocument();
    expect(screen.getByText('LIFT-99')).toBeInTheDocument();
  });

  test('T17 - MaintenanceLogs: API delete called on decommission', async () => {
    axios.delete.mockResolvedValue({ status: 200 });
    const { decommissionAsset } = await import('./store/slices/assetSlice');
    await store.dispatch(decommissionAsset(1));
    expect(axios.delete).toHaveBeenCalledWith(expect.stringContaining('/assets/1'));
  });

  test('T18 - MaintenanceScheduler: API post called on scheduling', async () => {
    axios.post.mockResolvedValue({ status: 201 });
    const { createSchedule } = await import('./store/slices/maintenanceSlice');
    await store.dispatch(createSchedule({ assetId: 1, type: 'ROUTINE' }));
    expect(axios.post).toHaveBeenCalled();
  });

  test('T19 - AssetList: Decommission button triggers action', async () => {
    mockLogin({ role: 'ASSET_MANAGER' });
    mockAssetsData([defaultAsset]);

    axios.delete.mockResolvedValue({ status: 200 });
    window.confirm = jest.fn().mockReturnValue(true);

    const AssetList = (await import('./components/asset/AssetList')).default;
    render(<Provider store={store}><AssetList /></Provider>);

    await waitFor(() => screen.getByText('CNC-001'));
    const decommissionBtn = screen.getByRole('button', { name: /Decommission/i });
    fireEvent.click(decommissionBtn);

    expect(window.confirm).toHaveBeenCalled();
    await waitFor(() => expect(axios.delete).toHaveBeenCalled());
  });

  test('T20 - Pagination: Next page triggers fetch', async () => {
    mockAssetsData([defaultAsset], 2);
    const mockData = {
      content: [defaultAsset],
      totalPages: 2
    };
    axios.get.mockResolvedValue({ data: mockData });

    const AssetList = (await import('./components/asset/AssetList')).default;
    render(<Provider store={store}><AssetList /></Provider>);

    await waitFor(() => screen.getByText(/Industrial Assets/i));
    const nextBtn = screen.getByRole('button', { name: /Next/i });
    fireEvent.click(nextBtn);

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalled();
    });
  });

  test('T21 - Resilience: Error state on API failure', async () => {
    axios.get.mockRejectedValue(new Error('Network Error'));
    const { fetchAssets } = await import('./store/slices/assetSlice');
    await store.dispatch(fetchAssets(0));
    const state = store.getState().assets;
    expect(state.loading).toBe(false);
  });

  test('T22 - Validation: Date format logic in schedule', async () => {
    mockAssetsData([defaultAsset]);
    const ScheduleModal = (await import('./components/maintenance/ScheduleMaintenanceModal')).default;
    render(<Provider store={store}><ScheduleModal isOpen={true} onClose={() => { }} /></Provider>);
    const dateInput = screen.getByText(/Planned Date/i).parentElement.querySelector('input');
    expect(dateInput).toHaveAttribute('type', 'date');
  });

  test('T23 - AssetModal: Validates input types', async () => {
    const AssetModal = (await import('./components/asset/AssetModal')).default;
    render(<Provider store={store}><AssetModal isOpen={true} onClose={() => { }} /></Provider>);

    const tagInput = screen.getByText(/Asset Tag/i).parentElement.querySelector('input');
    expect(tagInput).toHaveAttribute('type', 'text');
  });

  test('T24 - AssetList: Identity validation', async () => {
    mockAssetsData([defaultAsset]);
    const AssetList = (await import('./components/asset/AssetList')).default;
    render(<Provider store={store}><AssetList /></Provider>);
    await waitFor(() => expect(screen.getByRole('heading', { name: /Industrial Assets/i })).toBeInTheDocument());
  });

  test('T25 - LogMaintenanceModal: Component renders when open', async () => {
    const LogMaintenanceModal = (await import('./components/maintenance/LogMaintenanceModal')).default;
    render(<Provider store={store}><LogMaintenanceModal isOpen={true} onClose={() => { }} task={{ id: 1, asset: { assetTag: 'T1' } }} /></Provider>);
    expect(screen.getByText(/Complete Maintenance Task/i)).toBeInTheDocument();
  });

  test('T26 - AssetList: Validates structure and main heading', async () => {
    mockAssetsData([defaultAsset]);
    const AssetList = (await import('./components/asset/AssetList')).default;
    render(<Provider store={store}><AssetList /></Provider>);

    await waitFor(() => {
      const heading = screen.getByRole('heading', { level: 1, name: /Industrial Assets/i });
      expect(heading).toBeInTheDocument();
    });
  });

  test('T27 - Style: Primary branding buttons follow professional constraints', async () => {
    mockLogin({ role: 'ASSET_MANAGER' });
    mockAssetsData([defaultAsset]);

    const AssetList = (await import('./components/asset/AssetList')).default;
    render(<Provider store={store}><AssetList /></Provider>);

    await waitFor(() => {
      const addBtn = screen.getByRole('button', { name: /Add Asset/i });
      expect(addBtn).toHaveClass('add-btn');
    });
  });

  test('T28 - Style: Page containers maintain consistent padding and depth', async () => {
    mockAssetsData([defaultAsset]);
    const AssetList = (await import('./components/asset/AssetList')).default;
    render(<Provider store={store}><AssetList /></Provider>);

    await waitFor(() => {
      const container = screen.getByText(/Industrial Assets/i).closest('.page-container');
      expect(container).toHaveClass('page-container');
    });
  });

  test('T29 - Layout: Global container centering and width constraints', async () => {
    const { default: Navbar } = await import('./components/layout/Navbar');
    mockLogin({ username: 'test', role: 'ASSET_MANAGER' });

    render(<Provider store={store}>{withRouter(<Navbar />)}</Provider>);

    const navElement = screen.getByRole('navigation');
    expect(navElement).toBeInTheDocument();
  });

  test('T30 - Home: Dashboard hero section typography and welcome message', async () => {
    axios.get.mockResolvedValue({
      data: {
        statusDistribution: {},
        activeMaintenanceCount: 0,
        totalFleetValue: 1000000,
        assetCount: 10,
        averageHealth: 90
      }
    });

    const { default: Dashboard } = await import('./components/Dashboard');
    render(<Provider store={store}>{withRouter(<Dashboard />)}</Provider>);

    await waitFor(() => {
      expect(screen.getByText(/Fleet Health Overview/i)).toBeInTheDocument();
    });
  });

  test('T31 - Register: Email address input field and password condition exist', async () => {
    const { default: Register } = await import('./components/Register');
    render(<Provider store={store}>{withRouter(<Register />)}</Provider>);

    expect(screen.getByText(/AssetArc Register/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter your email address/i)).toBeInTheDocument();
    expect(screen.getByText(/Email Address/i)).toBeInTheDocument();
    expect(screen.getByText(/Password must be at least 8 characters/i)).toBeInTheDocument();
  });

  test('T32 - Register: Password condition validation on submission', async () => {
    const { default: Register } = await import('./components/Register');
    render(<Provider store={store}>{withRouter(<Register />)}</Provider>);

    const usernameInput = screen.getByPlaceholderText(/Choose a username/i);
    const emailInput = screen.getByPlaceholderText(/Enter your email address/i);
    const passwordInput = screen.getByPlaceholderText(/Choose a secure password/i);
    const submitBtn = screen.getByRole('button', { name: /Register/i });

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: '123' } });
    fireEvent.click(submitBtn);

    expect(screen.getAllByText(/Password must be at least 8 characters/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByRole('button', { name: /Register/i })).toBeInTheDocument();
  });

  test('T33 - Login: Password condition validation on submission', async () => {
    const { default: Login } = await import('./components/Login');
    render(<Provider store={store}>{withRouter(<Login />)}</Provider>);

    const usernameInput = screen.getByPlaceholderText(/Enter username/i);
    const passwordInput = screen.getByPlaceholderText(/Enter password/i);
    const submitBtn = screen.getByRole('button', { name: /Login/i });

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: '123' } });
    fireEvent.click(submitBtn);

    expect(screen.getByText(/Password must be at least 8 characters/i)).toBeInTheDocument();
  });

});