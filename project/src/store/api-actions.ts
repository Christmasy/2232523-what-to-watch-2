import {AxiosInstance} from 'axios';
import {AuthData} from '../types/auth-data';
import {UserData} from '../types/user-data';
import {FilmType} from '../types/film-type';
import {createAsyncThunk} from '@reduxjs/toolkit';
import {dropToken, saveToken} from '../services/token';
import {AppDispatch, AppState} from '../types/app-state.type';
import { Review } from '../types/film-type';
import { UserComment } from '../types/user-review';
import {APIRoute, AuthorizationStatus, TIMEOUT_SHOW_ERROR} from '../const';
import {fillFilms, setDataIsLoading, setAuthorizationStatus, setError, saveUser, loadComments, loadFilm, loadSimilar} from './action';

export const fetchFilms = createAsyncThunk<void, undefined, {
  dispatch: AppDispatch;
  state: AppState;
  extra: AxiosInstance
}>(
  'fetchFilms',
  async (_arg, { dispatch, extra: api }) => {
    dispatch(setDataIsLoading(true));
    const { data } = await api.get<FilmType[]>(APIRoute.Films);
    dispatch(fillFilms(data));
    dispatch(setDataIsLoading(false));
  }
);

export const checkAuth = createAsyncThunk<void, undefined, {
  dispatch: AppDispatch;
  state: AppState;
  extra: AxiosInstance
}>(
  'checkAuth',
  async (_arg, { dispatch, extra: api }) => {
    try {
      const {data: user} = await api.get(APIRoute.Login);
      dispatch(saveUser(user));
      dispatch(setAuthorizationStatus(AuthorizationStatus.Auth));
    } catch {
      dispatch(setAuthorizationStatus(AuthorizationStatus.NoAuth));
    }
  }
);

export const clearError = createAsyncThunk<void, undefined, {
    dispatch: AppDispatch;
    state: AppState;
    extra: AxiosInstance
}>(
  'clearError',
  async (_arg, { dispatch }) => {
    setTimeout(() => {
      dispatch(setError(null));
    }, TIMEOUT_SHOW_ERROR);
  }
);

export const logIn = createAsyncThunk<void, AuthData, {
  dispatch: AppDispatch;
  state: AppState;
  extra: AxiosInstance
}>(
  'login',
  async ({ email, password }, { dispatch, extra: api }) => {
    const { data } = await api.post<UserData>(APIRoute.Login, {
      email,
      password,
    });
    saveToken(data.token);
    dispatch(setAuthorizationStatus(AuthorizationStatus.Auth));
  }
);

export const logOut = createAsyncThunk<void, undefined, {
    dispatch: AppDispatch;
    state: AppState;
    extra: AxiosInstance
}>(
  'logout',
  async (_arg, { dispatch, extra: api }) => {
    await api.delete(APIRoute.Logout);
    dropToken();
    dispatch(setAuthorizationStatus(AuthorizationStatus.NoAuth));
  }
);

export const fetchFilmByID = createAsyncThunk<
  void,
  string,
  {
    dispatch: AppDispatch;
    state: AppState;
    extra: AxiosInstance;
  }
>(
  'fetchFilmById',
  async (filmId: string, { dispatch, extra: api }) => {
    const { data } = await api.get<FilmType>(`${APIRoute.Films}/${filmId}`);
    dispatch(loadFilm(data));
  });

export const fetchReviewsByID = createAsyncThunk<
  void,
  string,
  {
    dispatch: AppDispatch;
    state: AppState;
    extra: AxiosInstance;
  }
>(
  'fetchCommentsById',
  async (filmId: string, { dispatch, extra: api }) => {
    const { data } = await api.get<Review[]>(
      `${APIRoute.Comments}/${filmId}`
    );
    dispatch(loadComments(data));
  });

export const fetchSimilarByID = createAsyncThunk<
  void,
  string,
  {
    dispatch: AppDispatch;
    state: AppState;
    extra: AxiosInstance;
  }
>(
  'fetchSimilarById',
  async (filmId: string, { dispatch, extra: api }) => {
    const { data } = await api.get<FilmType[]>(
      `${APIRoute.Films}/${filmId}${APIRoute.Similar}`
    );
    dispatch(loadSimilar(data));
  });

export const postReview = createAsyncThunk<
  void,
  UserComment,
  {
    dispatch: AppDispatch;
    state: AppState;
    extra: AxiosInstance;
  }
>(
  'data/postReviewById',
  async ({ comment, rating, filmId }, { dispatch, extra: api }) => {
    dispatch(setDataIsLoading(true));
    await api.post<UserComment>(`${APIRoute.Comments}/${filmId}`, {
      comment,
      rating,
    });
    dispatch(setDataIsLoading(false));
  }
);
