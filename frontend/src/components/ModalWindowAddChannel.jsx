import { Modal, Button } from 'react-bootstrap'
import {
  Formik, Form, Field, ErrorMessage,
} from 'formik'
import * as Yup from 'yup'
import { useTranslation } from 'react-i18next'

const AddChannelModal = ({
  show, onHide, existingChannels, onAddChannel,
}) => {
  const { t } = useTranslation()
  const validationSchema = Yup.object({
    name: Yup.string()
      .min(3, `${t('modals.errors.min')}`)
      .max(20, `${t('modals.errors.max')}`)
      .required(`${t('modals.errors.required')}`)
      .notOneOf(existingChannels, `${t('modals.errors.notOneOf')}`),
  })

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {t('modals.addChannel.title')}
        </Modal.Title>
      </Modal.Header>
      <Formik
        initialValues={{ name: '' }}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          onAddChannel(values.name)
          setSubmitting(false)
          resetForm()
          onHide()
        }}
      >
        {({ errors, touched, isSubmitting }) => (
          <Form>
            <Modal.Body>
              <div className="mb-3">
                <label htmlFor="channel-name" className="form-label">
                  {t('modals.addChannel.label')}
                </label>
                <Field
                  id="channel-name"
                  name="name"
                  type="text"
                  autoFocus
                  className={`form-control ${errors.name && touched.name ? 'is-invalid' : ''}`}
                  placeholder={t('modals.addChannel.label')}
                  autoComplete="off"
                />
                <ErrorMessage name="name" component="div" className="invalid-feedback" />
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={onHide}>
                {t('modals.addChannel.cancel')}
              </Button>
              <Button variant="primary" type="submit" disabled={isSubmitting}>
                {t('modals.addChannel.submit')}
              </Button>
            </Modal.Footer>
          </Form>
        )}
      </Formik>
    </Modal>
  )
}

export default AddChannelModal
