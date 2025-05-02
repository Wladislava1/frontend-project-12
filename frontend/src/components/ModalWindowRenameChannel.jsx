import React, { useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap'; // если используете react-bootstrap
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const RenameChannelModal = ({ show, onHide, onRenameChannel, existingChannels, currentName }) => {
  const validationSchema = Yup.object({
    name: Yup.string()
      .min(3, 'Минимум 3 символа')
      .max(20, 'Максимум 20 символов')
      .required()
      .notOneOf(existingChannels.filter(name => name !== currentName), 'Такое имя уже существует'),
  });

  useEffect(() => {
    if (!show) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const submitBtn = document.querySelector('#rename-submit-btn');
        if (submitBtn) submitBtn.click();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [show]);

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Переименовать канал</Modal.Title>
      </Modal.Header>
      <Formik
        initialValues={{ name: currentName }}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting }) => {
          onRenameChannel(values.name);
          setSubmitting(false);
          onHide();
        }}
      >
        {({ errors, touched, isSubmitting }) => (
          <Form>
            <Modal.Body>
              <div>
                <Field
                  id="name"
                  name="name"
                  className={`mb-2 form-control ${errors.name && touched.name ? 'is-invalid' : ''}`}
                  autoComplete="off"
                  autoFocus
                />
                <label htmlFor="name" className="visually-hidden">Имя канала</label>
                <ErrorMessage name="name" component="div" className="invalid-feedback" />
              </div>
            </Modal.Body>
            <Modal.Footer className="d-flex justify-content-end">
              <Button variant="secondary" type="button" onClick={onHide} className="me-2">
                Отменить
              </Button>
              <Button variant="primary" type="submit" id="rename-submit-btn" disabled={isSubmitting}>
                Отправить
              </Button>
            </Modal.Footer>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default RenameChannelModal;
