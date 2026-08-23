import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

// Import your slices here
// import productReducer from './slices/productSlice';
 import authReducer from './authSlice';
import ProfileReducer from './profileSlice';

export const store = configureStore({
    reducer: {
        // product: productReducer,
           auth: authReducer,
           profile: ProfileReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Export pre-typed hooks
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;