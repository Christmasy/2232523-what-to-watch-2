import { Link, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import React from 'react';
import { FilmType } from '../../types/film-type';
import FilmDescription from '../../components/film-description/film-description';
import SimilarFilms from '../../components/similar-films/similar-films';
import User from '../../components/user/user';
import { AppRoute } from '../../const';
import { useAppDispatch, useAppSelector } from '../../hooks';
import NonExistentPage from '../non-existent-page/non-existent-page';
import { AuthorizationStatus } from '../../const';
import { fetchReviewsByID, fetchFilmByID, fetchSimilarByID } from '../../store/api-actions';
import { setDataIsLoading } from '../../store/action';

type FilmProps = {
  films: FilmType[];
}

function Film({films}: FilmProps): JSX.Element {
  const id = Number(useParams().id);
  const film = films.find((currentFilm) => currentFilm.id === id);
  const similar = useAppSelector((state) => state.similar);
  const reviews = useAppSelector((state) => state.comments);
  const authorizationStatus = useAppSelector((state) => state.authorizationStatus);

  const dispatch = useAppDispatch();
  //
  useEffect(() => {
    dispatch(setDataIsLoading(true));
    dispatch(fetchFilmByID(id.toString()));
    dispatch(fetchSimilarByID(id.toString()));
    dispatch(fetchReviewsByID(id.toString()));
    dispatch(setDataIsLoading(false));
  }, [id, dispatch]);

  if (!film) {
    return <NonExistentPage/>;
  }
  return (
    <React.Fragment>
      <section className="film-card film-card--full">
        <div className="film-card__hero">
          <div className="film-card__bg">
            <img src={film.backgroundImage} alt={film.name}/>
          </div>

          <h1 className="visually-hidden">WTW</h1>

          <header className="page-header film-card__head">
            <div className="logo">
              <Link to={AppRoute.Main} className="logo__link">
                <span className="logo__letter logo__letter--1">W</span>
                <span className="logo__letter logo__letter--2">T</span>
                <span className="logo__letter logo__letter--3">W</span>
              </Link>
            </div>
            <User/>
          </header>

          <div className="film-card__wrap">
            <div className="film-card__desc">
              <h2 className="film-card__title">{film.name}</h2>
              <p className="film-card__meta">
                <span className="film-card__genre">{film.genre}</span>
                <span className="film-card__year">{film.released}</span>
              </p>

              <div className="film-card__buttons">
                <Link
                  to={`/player/${film.id}`}
                  className="btn btn--play film-card__button"
                  type="button"
                >
                  <svg viewBox="0 0 19 19" width="19" height="19">
                    <use xlinkHref="#play-s"></use>
                  </svg>
                  <span>Play</span>
                </Link>
                <Link to={'/mylist'}
                  className="btn btn--list film-card__button"
                  type="button"
                >
                  <svg viewBox="0 0 19 20" width="19" height="20">
                    <use xlinkHref="#add"></use>
                  </svg>
                  <span>My list</span>
                  <span className="film-card__count">9</span>
                </Link>
                {authorizationStatus === AuthorizationStatus.Auth && (
                  <Link
                    to={`/films/${film.id}/review`}
                    className="btn film-card__button"
                  >
                    Add review
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="film-card__wrap film-card__translate-top">
          <div className="film-card__info">
            <div className="film-card__poster film-card__poster--big">
              <img src={film.posterImage}
                alt={`${film.name } poster`}
                width="218" height="327"
              />
            </div>
            <FilmDescription film={film} reviews={reviews}/>
          </div>
        </div>
      </section>

      <div className="page-content">
        <section className="catalog catalog--like-this">
          <h2 className="catalog__title">More like this</h2>

          <div className="catalog__films-list">
            <SimilarFilms currentFilm={film} similarFilms={similar}/>
          </div>
        </section>

        <footer className="page-footer">
          <div className="logo">
            <a href="main.html" className="logo__link logo__link--light">
              <span className="logo__letter logo__letter--1">W</span>
              <span className="logo__letter logo__letter--2">T</span>
              <span className="logo__letter logo__letter--3">W</span>
            </a>
          </div>

          <div className="copyright">
            <p>© 2019 What to watch Ltd.</p>
          </div>
        </footer>
      </div>
    </React.Fragment>
  );
}
export default Film;
