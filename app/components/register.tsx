import { useState, useEffect } from "react";

import styles from "./register.module.scss";

import CloseIcon from "../icons/close.svg";
import { Input, List, ListItem, PasswordInput } from "./ui-lib";

import { IconButton } from "./button";
import { useAuthStore, useAccessStore, useWebsiteConfigStore } from "../store";

import Locale from "../locales";
import { Path } from "../constant";
import { ErrorBoundary } from "./error";
import { useNavigate } from "react-router-dom";
import { showToast } from "../components/ui-lib";

export function Register() {
  const navigate = useNavigate();
  const authStore = useAuthStore();
  const accessStore = useAccessStore();
  const { registerPageSubTitle } = useWebsiteConfigStore();

  const [loadingUsage, setLoadingUsage] = useState(false);

  useEffect(() => {
    const keydownEvent = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        navigate(Path.Home);
      }
    };
    document.addEventListener("keydown", keydownEvent);
    return () => {
      document.removeEventListener("keydown", keydownEvent);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [emailCode, setEmailCode] = useState("");
  const [emailCodeSending, setEmailCodeSending] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [comfirmedPassword, setComfirmedPassword] = useState("");
  function handleClickSendEmailCode() {
    if (email === null || email == "") {
      showToast(Locale.RegisterPage.EmailIsEmpty);
      return;
    }
    setEmailCodeSending(true);
    authStore
      .sendEmailCode(email)
      .then((resp) => {
        if (resp.code == 0) {
          showToast(Locale.RegisterPage.EmailCodeSent);
          return;
        }
        if (resp.code == 10121) {
          showToast(Locale.RegisterPage.EmailFormatError);
          return;
        } else if (resp.code == 10122) {
          showToast(Locale.RegisterPage.EmailCodeSentFrequently);
          return;
        }
        showToast(resp.message);
      })
      .finally(() => {
        setEmailCodeSending(false);
      });
  }
  function register() {
    if (password == null || password.length == 0) {
      showToast(Locale.RegisterPage.Toast.PasswordEmpty);
      return;
    }
    if (password != comfirmedPassword) {
      // alert("两次输入的密码不一致！");
      showToast(Locale.RegisterPage.Toast.PasswordNotTheSame);
      return;
    }
    // if (username.length <)
    setLoadingUsage(true);
    showToast(Locale.RegisterPage.Toast.Registering);
    authStore
      .register(name, username, password)
      .then((result) => {
        console.log("result", result);
        if (!result) {
          showToast(Locale.RegisterPage.Toast.Failed);
          return;
        }
        if (result.code == 0) {
          showToast(Locale.RegisterPage.Toast.Success);
          navigate(Path.Chat);
        } else {
          if (result.message) {
            showToast(
              Locale.RegisterPage.Toast.FailedWithReason + result.message,
            );
          } else {
            showToast(Locale.RegisterPage.Toast.Failed);
          }
        }
      })
      .finally(() => {
        setLoadingUsage(false);
      });
  }

  return (
    <ErrorBoundary>
      <div className="window-header">
        <div className="window-header-title">
          <div className="window-header-main-title">
            {Locale.RegisterPage.Title}
          </div>
          <div className="window-header-sub-title">{registerPageSubTitle}</div>
        </div>
        <div className="window-actions">
          <div className="window-action-button">
            <IconButton
              icon={<CloseIcon />}
              onClick={() => navigate(Path.Home)}
              bordered
              title={Locale.RegisterPage.Actions.Close}
            />
          </div>
        </div>
      </div>
      <div className={styles["register"]}>
        <List>
          <ListItem
            title={Locale.RegisterPage.Name.Title}
            subTitle={Locale.RegisterPage.Name.SubTitle}
          >
            <Input
              value={name}
              rows={1}
              placeholder={Locale.RegisterPage.Name.Placeholder}
              onChange={(e) => {
                setName(e.currentTarget.value);
              }}
            />
          </ListItem>

          <ListItem
            title={Locale.RegisterPage.Email.Title}
            subTitle={Locale.RegisterPage.Email.SubTitle}
          >
            <Input
              value={email}
              rows={1}
              placeholder={Locale.RegisterPage.Email.Placeholder}
              onChange={(e) => {
                setEmail(e.currentTarget.value);
              }}
            />
          </ListItem>

          <ListItem>
            <IconButton
              text={
                emailCodeSending
                  ? Locale.RegisterPage.EmailCodeSending
                  : Locale.RegisterPage.SendEmailCode
              }
              onClick={() => {
                handleClickSendEmailCode();
              }}
            />
          </ListItem>

          <ListItem
            title={Locale.RegisterPage.EmailCode.Title}
            subTitle={Locale.RegisterPage.EmailCode.SubTitle}
          >
            <Input
              value={emailCode}
              rows={1}
              placeholder={Locale.RegisterPage.EmailCode.Placeholder}
              onChange={(e) => {
                setEmailCode(e.currentTarget.value);
              }}
            />
          </ListItem>

          <ListItem subTitle={Locale.RegisterPage.Username.SubTitle}>
            <Input
              value={username}
              rows={1}
              placeholder={Locale.RegisterPage.Username.Placeholder}
              onChange={(e) => {
                setUsername(e.currentTarget.value);
              }}
            />
          </ListItem>

          <ListItem
            title={Locale.RegisterPage.Password.Title}
            subTitle={Locale.RegisterPage.Password.SubTitle}
          >
            <PasswordInput
              value={password}
              type="text"
              placeholder={Locale.RegisterPage.Password.Placeholder}
              onChange={(e) => {
                setPassword(e.currentTarget.value);
              }}
            />
          </ListItem>

          <ListItem
            title={Locale.RegisterPage.ConfirmedPassword.Title}
            subTitle={Locale.RegisterPage.ConfirmedPassword.SubTitle}
          >
            <PasswordInput
              value={comfirmedPassword}
              type="text"
              placeholder={Locale.RegisterPage.ConfirmedPassword.Placeholder}
              onChange={(e) => {
                setComfirmedPassword(e.currentTarget.value);
              }}
            />
          </ListItem>

          <ListItem>
            <IconButton
              type="primary"
              text={Locale.RegisterPage.Title}
              block={true}
              onClick={() => {
                console.log(username, password);
                register();
              }}
            />
          </ListItem>

          <ListItem>
            <IconButton
              text={Locale.RegisterPage.GoToLogin}
              onClick={() => {
                navigate(Path.Login);
              }}
            />
          </ListItem>
        </List>
      </div>
    </ErrorBoundary>
  );
}
