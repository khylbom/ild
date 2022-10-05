import * as React from "react";
import type { LoginValues, User } from "../../app/api";
import { useAppDispatch } from "../../app/store";
import { useAuth } from "../../hooks/useAuth";
import { login } from "./authSlice";
import { Formik, Form, Field, FormikProps, FormikHelpers } from "formik";
import Stack, { StackProps } from "@mui/material/Stack";
import { TextField } from "formik-mui";
import { unwrapResult } from "@reduxjs/toolkit";

type LoginFormProps = Omit<StackProps, "children"> & {
  onSuccess?: (user?: User) => void;
};

const LoginForm: React.FC<LoginFormProps> = ({
  onSuccess = (x) => x,
  ...props
}) => {
  const dispatch = useAppDispatch();
  const handleLogin = React.useCallback(
    (values: LoginValues) => {
      dispatch(login(values)).then(unwrapResult).then(onSuccess);
    },
    [dispatch, onSuccess]
  );

  return (
    <Formik
      initialValues={{
        username: "",
        password: ""
      }}
      onSubmit={(values, { setSubmitting }) => {
        setSubmitting(true);
        handleLogin(values);
      }}
    >
      {(form) => (
        <Form>
          <Stack {...props}>
            <Field
              component={TextField}
              name="badge"
              label="Username"
              helperText="Please enter your 5-digit badge number."
            />
            <Field
              component={TextField}
              name="password"
              type="password"
              label="Password"
            />
          </Stack>
        </Form>
      )}
    </Formik>
  );
};
