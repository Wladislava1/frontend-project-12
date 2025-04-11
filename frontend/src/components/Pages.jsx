import { Outlet } from "react-router-dom";
import { Formik, Form, Field } from 'formik';

export const HomeLayout = () => {
    return (
      <div>
        <Outlet />
      </div>
    );
};

export const LoginPage = () => {
    return (
    <Formik>
        <Form className="col-12 col-md-6 mt-3 mt-md-0">
          <h1 className="text-center mb-4">Войти</h1>
          
          <div className="form-floating mb-3">
            <Field
              name="username"
              id="username"
              type="text"
              className="form-control"
              placeholder="Ваш ник"
              autoComplete="username"
            />
            <label htmlFor="username">Ваш ник</label>
          </div>

          <div className="form-floating mb-4">
            <Field
              name="password"
              id="password"
              type="password"
              className="form-control"
              placeholder="Пароль"
              autoComplete="current-password"
            />
            <label htmlFor="password">Пароль</label>
          </div>

          <button 
            type="submit" 
            className="w-100 mb-3 btn btn-outline-primary"
          >
            Войти
        </button>
        </Form>
    </Formik>
    )
}

export const NotFoundPage = () => {
    return (
        <div className="text-center">
          <img alt="Страница не найдена" className="img-fluid h-25" src="/assets/404-D_FLHmTM.svg"/>
          <h1 className="h4 text-muted">Страница не найдена</h1>
          <p className="text-muted">Но вы можете перейти <a href="/">на главную страницу</a></p>
        </div>
    )
}
