import Input from "@components/forms/input/Input";
import { zodResolver } from "@hookform/resolvers/zod";
import ActSignIn from "@store/Auth/Act/ActSignIn";
import { resetUI } from "@store/Auth/AuthSlice";
import { useAppDispatch, useAppSelector } from "@store/hook";
import { signInSchema, signInType } from "@validations/signInSchema";
import { useEffect } from "react";
import { Alert, Button, Col, Form, Row, Spinner } from "react-bootstrap";
import { SubmitHandler, useForm } from "react-hook-form";
import { Link, Navigate, useNavigate, useSearchParams } from "react-router-dom";
import styles from "./login.module.css";
import ActCheckAuth from "@store/Auth/Act/ActCheckAuth";
import Loader from "@components/common/Loader/Loader";

function Login() {
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useAppDispatch();
  const { loading, error, jwt } = useAppSelector((state) => state.Authslice);
  const navigate = useNavigate();

  const googleLoginUrl = "http://127.0.0.1:8000/api/auth/google/redirect";
  useEffect(() => {
    return () => {
      dispatch(resetUI());
    };
  }, [dispatch]);

  useEffect(() => {
    return () => {
      dispatch(resetUI());
    };
  }, [dispatch]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<signInType>({
    mode: "onBlur",
    resolver: zodResolver(signInSchema),
  });
  const submitForm: SubmitHandler<signInType> = (data) => {
    if (searchParams.get("message")) {
      setSearchParams("");
    };
    dispatch(ActSignIn(data))
      .unwrap()
      .then(() => {
        dispatch(ActCheckAuth()).unwrap().then((result) => {
          // Use role-based navigation instead of always going to "/"
          const user = result.user;
          if (user?.role === 'admin') {
            navigate("/admin/dashboard");
          } else if (user?.role === 'owner') {
            navigate("profile/owner-dashboard");
          } else {
            navigate("/");
          }
        });
      });
  };
  if (jwt) {
    return <Navigate to="/" />;
  }

  return (
    <>
      <Row>
        <Col md={{ span: "4", offset: "4" }}>
          {searchParams.get("message") === "account_created" && (
            <Alert variant="success">
              Your account successfully created, please login
            </Alert>
          )}

          <Form onSubmit={handleSubmit(submitForm)}>
            <Input
              label="Email Address"
              name="email"
              register={register}
              error={errors.email?.message}
            />
            <Input
              label="Password"
              name="password"
              register={register}
              error={errors.password?.message}
              type="password"
            />

            <div
              className={`${styles.forgetPassword} d-flex justify-content-between mt-2`}
            >
              <Link to="/forgot-password">Forgot Password?</Link>
              <Link to="/register">Register Here</Link>
            </div>

            <Button
              variant="info"
              type="submit"
              className={`${styles.loginBtn}  mt-3`}
              style={{ width: "100%" }}
            >
               {loading === "pending"  ? (
                    <>
                      <Spinner animation="border" size="sm" />
                      Loading...
                    </>
                  ) : (
                    "Log in"
                )}
        
            </Button>

            <div className={styles.divider}>
              <span>OR</span>
            </div>

            <a href={googleLoginUrl} className={styles.googleBtn}>
              <img
                src="https://www.svgrepo.com/show/355037/google.svg"
                alt="Google logo"
                className={styles.googleIcon}
              />
              <span>Continue With Google</span>
            </a>
           {error && (
              <div style={{ marginTop: "10px" }}>
                <p style={{ color: "#DC3545" }}>{error}</p>
                {error === "Please verify your email before logging in." && (
                  <Button
                    variant="warning"
                    style={{ marginTop: "5px" }}
                    onClick={() => navigate("/verify-email")}
                  >
                  {loading === "pending"  ? (
                    <>
                      <Spinner animation="border" size="sm" />
                      Verifying...
                    </>
                  ) : (
                    "Verify Email"
                  )}
                  </Button>
                )}
              </div>
            )}
          </Form>
        </Col>
      </Row>
    </>
  );
}

export default Login;
