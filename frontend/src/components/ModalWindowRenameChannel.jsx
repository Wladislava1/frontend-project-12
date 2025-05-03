import React, { useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';

const RenameChannelModal = ({ show, onHide, onRenameChannel, existingChannels, currentName }) => {
  const { t } = useTranslation();
  const validationSchema = Yup.object({
    name: Yup.string()
      .min(3, 'Минимум 3 символа')
      .max(20, 'Максимум 20 символов')
      .required('Обязательное поле')
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
        <Modal.Title>{t('modals.renameChannel.title')}</Modal.Title>
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
                  autoFocus
                  className={`mb-2 form-control ${errors.name && touched.name ? 'is-invalid' : ''}`}
                  autoComplete="off"
                />
                <label htmlFor="name" className="visually-hidden">{t('modals.renameChannel.label')}</label>
                <ErrorMessage name="name" component="div" className="invalid-feedback" />
              </div>
            </Modal.Body>
            <Modal.Footer className="d-flex justify-content-end">
              <Button variant="secondary" type="button" onClick={onHide} className="me-2">
              {t('modals.renameChannel.cancel')}
              </Button>
              <Button variant="primary" type="submit" id="rename-submit-btn" disabled={isSubmitting}>
              {t('modals.renameChannel.submit')}
              </Button>
            </Modal.Footer>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default RenameChannelModal;
