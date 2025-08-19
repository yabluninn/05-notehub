import { Formik, Form, Field, ErrorMessage, type FormikHelpers } from "formik";
import * as Yup from "yup";
import { createNote } from "../../services/noteService";
import { useQueryClient } from "@tanstack/react-query";

import css from "./NoteForm.module.css";

interface NoteFormProps {
  onSuccess: () => void;
}

interface NoteFormValues {
  title: string;
  content: string;
  tag: "Todo" | "Work" | "Personal" | "Meeting" | "Shopping";
}

const validationSchema = Yup.object({
  title: Yup.string()
    .min(3, "Must be at least 3 characters")
    .max(50, "Max 50 characters")
    .required("Title is required"),
  content: Yup.string().max(500, "Max 500 characters"),
  tag: Yup.string()
    .oneOf(["Todo", "Work", "Personal", "Meeting", "Shopping"])
    .required("Tag is required"),
});

export default function NoteForm({ onSuccess }: NoteFormProps) {
  const queryClient = useQueryClient();

  const initialValues: NoteFormValues = {
    title: "",
    content: "",
    tag: "Todo",
  };

  const handleSubmit = async (
    values: NoteFormValues,
    helpers: FormikHelpers<NoteFormValues>
  ) => {
    const { setSubmitting, resetForm } = helpers;

    try {
      await createNote(values);
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      resetForm();
      onSuccess();
    } catch (err) {
      console.error("Error creating note:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting, handleReset }) => (
        <Form className={css.form}>
          <div className={css.formGroup}>
            <label htmlFor="title">Title</label>
            <Field id="title" name="title" type="text" className={css.input} />
            <ErrorMessage name="title" component="span" className={css.error} />
          </div>

          <div className={css.formGroup}>
            <label htmlFor="content">Content</label>
            <Field
              as="textarea"
              id="content"
              name="content"
              rows={8}
              className={css.textarea}
            />
            <ErrorMessage
              name="content"
              component="span"
              className={css.error}
            />
          </div>

          <div className={css.formGroup}>
            <label htmlFor="tag">Tag</label>
            <Field as="select" id="tag" name="tag" className={css.select}>
              <option value="Todo">Todo</option>
              <option value="Work">Work</option>
              <option value="Personal">Personal</option>
              <option value="Meeting">Meeting</option>
              <option value="Shopping">Shopping</option>
            </Field>
            <ErrorMessage name="tag" component="span" className={css.error} />
          </div>

          <div className={css.actions}>
            <button
              type="button"
              className={css.cancelButton}
              onClick={handleReset}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={css.submitButton}
              disabled={isSubmitting}
            >
              Create note
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
